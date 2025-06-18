
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramRequest {
  message_id: string;
  name: string;
  email: string;
  message: string;
  bot_token: string;
  chat_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing Telegram notification request');
    
    const { message_id, name, email, message, bot_token, chat_id }: TelegramRequest = await req.json();
    
    if (!bot_token || !chat_id) {
      console.error('Missing bot_token or chat_id');
      return new Response(
        JSON.stringify({ error: 'Missing bot configuration' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format the message for Telegram
    const telegramMessage = `🔔 *Новое сообщение с сайта*\n\n` +
      `👤 *Имя:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💬 *Сообщение:*\n${message}\n\n` +
      `🆔 ID: ${message_id}`;

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`;
    
    console.log('Sending message to Telegram:', { chat_id, message_length: telegramMessage.length });
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send Telegram message', 
          details: telegramResult 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Telegram message sent successfully:', telegramResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        telegram_message_id: telegramResult.result?.message_id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-telegram-notification function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
