
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TelegramConfig {
  id: string;
  bot_token: string;
  chat_id: string;
  is_active: boolean;
}

const AdminTelegramBot = () => {
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('telegram_bot_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching telegram config:', error);
        return;
      }

      if (data) {
        setConfig(data);
        setBotToken(data.bot_token);
        setChatId(data.chat_id);
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Error fetching telegram config:', error);
    }
  };

  const handleSave = async () => {
    if (!botToken || !chatId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const configData = {
        bot_token: botToken,
        chat_id: chatId,
        is_active: isActive,
      };

      let result;
      if (config) {
        result = await supabase
          .from('telegram_bot_config')
          .update(configData)
          .eq('id', config.id);
      } else {
        result = await supabase
          .from('telegram_bot_config')
          .insert([configData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Успешно",
        description: "Конфигурация Telegram бота сохранена",
      });

      fetchConfig();
    } catch (error) {
      console.error('Error saving telegram config:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить конфигурацию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!botToken || !chatId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните токен бота и ID чата",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
        body: {
          message_id: 'test',
          name: 'Тест',
          email: 'test@example.com',
          message: 'Это тестовое сообщение для проверки подключения Telegram бота',
          bot_token: botToken,
          chat_id: chatId
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Успешно",
        description: "Тестовое сообщение отправлено в Telegram",
      });
    } catch (error) {
      console.error('Error testing telegram connection:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить тестовое сообщение",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Настройки Telegram бота</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Конфигурация Telegram бота</CardTitle>
          <CardDescription>
            Настройте Telegram бота для получения уведомлений о новых сообщениях с сайта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Токен бота</Label>
            <Input
              id="bot-token"
              type="password"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Получите токен у @BotFather в Telegram
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-id">ID чата</Label>
            <Input
              id="chat-id"
              placeholder="-1001234567890"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              ID чата или канала, куда будут отправляться уведомления
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Активен</Label>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
            <Button variant="outline" onClick={testConnection} disabled={loading}>
              Тест подключения
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Инструкции по настройке</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">1. Создание бота</h4>
            <p className="text-sm text-muted-foreground">
              Напишите @BotFather в Telegram и выполните команду /newbot для создания нового бота
            </p>
          </div>
          <div>
            <h4 className="font-semibold">2. Получение ID чата</h4>
            <p className="text-sm text-muted-foreground">
              Добавьте бота в группу или канал, затем используйте @userinfobot для получения ID
            </p>
          </div>
          <div>
            <h4 className="font-semibold">3. Тестирование</h4>
            <p className="text-sm text-muted-foreground">
              После сохранения настроек используйте кнопку "Тест подключения" для проверки работы
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTelegramBot;
