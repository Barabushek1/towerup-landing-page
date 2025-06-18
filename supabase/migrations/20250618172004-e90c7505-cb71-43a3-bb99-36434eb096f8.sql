
-- Create a table to store Telegram bot configuration
CREATE TABLE public.telegram_bot_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_token TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_telegram_bot_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_telegram_bot_config_updated_at
  BEFORE UPDATE ON public.telegram_bot_config
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_bot_config_updated_at();

-- Create a function to send telegram notifications
CREATE OR REPLACE FUNCTION notify_telegram_new_message()
RETURNS TRIGGER AS $$
DECLARE
  config_record RECORD;
BEGIN
  -- Get active telegram bot configuration
  SELECT bot_token, chat_id INTO config_record
  FROM public.telegram_bot_config
  WHERE is_active = true
  LIMIT 1;

  -- If we have a configuration, call the edge function
  IF config_record.bot_token IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://ynkkdrfgzrurlhoalblz.supabase.co/functions/v1/send-telegram-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua2tkcmZnenJ1cmxob2FsYmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjQyMDQsImV4cCI6MjA1ODYwMDIwNH0.UWuWONJhoTFuutaBXmzHay382Kwb0zAnZBrXsBpb8Gw"}'::jsonb,
      body := json_build_object(
        'message_id', NEW.id,
        'name', NEW.name,
        'email', NEW.email,
        'message', NEW.message,
        'bot_token', config_record.bot_token,
        'chat_id', config_record.chat_id
      )::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the messages table to automatically send notifications
CREATE TRIGGER telegram_notification_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_telegram_new_message();

-- Enable the pg_net extension if not already enabled (for HTTP requests)
CREATE EXTENSION IF NOT EXISTS pg_net;
