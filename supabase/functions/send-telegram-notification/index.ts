
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramNotificationRequest {
  message_id: string;
  name: string;
  email: string;
  message: string;
  bot_token?: string;
  chat_id?: string;
  type?: 'contact' | 'vacancy_application' | 'tender_submission' | 'commercial_offer';
  additional_data?: any;
}

const sendTelegramMessage = async (botToken: string, chatId: string, message: string) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

const formatMessage = (data: TelegramNotificationRequest): string => {
  const { type, name, email, message, additional_data } = data;
  
  switch (type) {
    case 'vacancy_application':
      return `🎯 <b>Новая заявка на вакансию</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Телефон:</b> ${additional_data?.phone || 'Не указан'}
💼 <b>Вакансия:</b> ${additional_data?.vacancy_title || 'Не указана'}

📝 <b>Сопроводительное письмо:</b>
${message || 'Не предоставлено'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

    case 'tender_submission':
      return `📋 <b>Новая заявка на тендер</b>

🏢 <b>Компания:</b> ${additional_data?.company_name || 'Не указана'}
👤 <b>Контактное лицо:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Телефон:</b> ${additional_data?.phone || 'Не указан'}
📄 <b>Тендер:</b> ${additional_data?.tender_title || 'Не указан'}

📝 <b>Сообщение:</b>
${message || 'Не предоставлено'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

    case 'commercial_offer':
      return `💼 <b>Новое коммерческое предложение</b>

${additional_data?.applicant_type === 'company' ? '🏢' : '👤'} <b>${additional_data?.applicant_type === 'company' ? 'Компания' : 'Физическое лицо'}:</b> ${additional_data?.applicant_type === 'company' ? additional_data?.company_name : name}
👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Телефон:</b> ${additional_data?.phone || 'Не указан'}

📝 <b>Описание предложения:</b>
${message || 'Не предоставлено'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

    default: // contact message
      return `📨 <b>Новое сообщение с сайта</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}

📝 <b>Сообщение:</b>
${message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing Telegram notification request");
    const requestData: TelegramNotificationRequest = await req.json();
    
    console.log("Request data received:", {
      message_id: requestData.message_id,
      name: requestData.name,
      email: requestData.email,
      type: requestData.type || 'contact'
    });

    // Use provided bot_token and chat_id or fetch from environment
    let botToken = requestData.bot_token;
    let chatId = requestData.chat_id;

    // If not provided in request, try to get from environment variables
    if (!botToken || !chatId) {
      botToken = botToken || Deno.env.get("TELEGRAM_BOT_TOKEN");
      chatId = chatId || Deno.env.get("TELEGRAM_CHAT_ID");
    }

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      return new Response(
        JSON.stringify({ error: "Telegram bot token or chat ID not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the message based on type
    const telegramMessage = formatMessage(requestData);
    
    console.log("Sending Telegram message:", telegramMessage.substring(0, 100) + "...");

    // Send message to Telegram
    const result = await sendTelegramMessage(botToken, chatId, telegramMessage);
    
    console.log("Telegram message sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
