
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot, Send, Check, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TelegramConfig {
  id: string;
  bot_token: string;
  chat_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminTelegramBot: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    bot_token: '',
    chat_id: '',
    is_active: true
  });
  const [testMessage, setTestMessage] = useState('Это тестовое сообщение от TOWERUP Admin панели');

  // Fetch current configuration
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['telegram-bot-config'],
    queryFn: async () => {
      console.log('Fetching Telegram bot configuration');
      
      const { data, error } = await supabase
        .from('telegram_bot_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching config:', error);
        throw error;
      }
      
      console.log('Fetched config:', data);
      return data as TelegramConfig | null;
    }
  });

  // Update form data when config loads
  React.useEffect(() => {
    if (config) {
      setFormData({
        bot_token: config.bot_token,
        chat_id: config.chat_id,
        is_active: config.is_active
      });
    }
  }, [config]);

  // Save configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Saving Telegram bot configuration:', data);
      
      if (config?.id) {
        // Update existing config
        const { data: result, error } = await supabase
          .from('telegram_bot_config')
          .update({
            bot_token: data.bot_token,
            chat_id: data.chat_id,
            is_active: data.is_active
          })
          .eq('id', config.id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        // Create new config
        const { data: result, error } = await supabase
          .from('telegram_bot_config')
          .insert([{
            bot_token: data.bot_token,
            chat_id: data.chat_id,
            is_active: data.is_active
          }])
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-bot-config'] });
      toast({
        title: "Конфигурация сохранена",
        description: "Настройки Telegram бота успешно обновлены",
      });
    },
    onError: (error) => {
      console.error('Error saving config:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить конфигурацию: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Test message mutation
  const testMessageMutation = useMutation({
    mutationFn: async () => {
      console.log('Sending test message');
      
      const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
        body: {
          message_id: 'test-' + Date.now(),
          name: 'Тестовое сообщение',
          email: 'admin@towerup.uz',
          message: testMessage,
          bot_token: formData.bot_token,
          chat_id: formData.chat_id
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Тестовое сообщение отправлено",
        description: "Проверьте ваш Telegram канал",
      });
    },
    onError: (error) => {
      console.error('Error sending test message:', error);
      toast({
        title: "Ошибка отправки",
        description: `Не удалось отправить тестовое сообщение: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bot_token || !formData.chat_id) {
      toast({
        title: "Заполните все поля",
        description: "Bot Token и Chat ID обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }
    
    saveConfigMutation.mutate(formData);
  };

  const handleTestMessage = () => {
    if (!formData.bot_token || !formData.chat_id) {
      toast({
        title: "Сначала сохраните конфигурацию",
        description: "Укажите Bot Token и Chat ID перед отправкой тестового сообщения",
        variant: "destructive",
      });
      return;
    }
    
    testMessageMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-red-400">Произошла ошибка при загрузке конфигурации</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['telegram-bot-config'] })}
          className="mt-4"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Настройки Telegram Бота</h1>
      </div>

      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          Настройте Telegram бота для получения уведомлений о новых сообщениях с сайта. 
          Сначала создайте бота через @BotFather в Telegram, затем добавьте его в ваш канал или чат.
        </AlertDescription>
      </Alert>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Конфигурация бота
          </CardTitle>
          <CardDescription>
            Введите данные вашего Telegram бота для получения уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot_token" className="text-white">Bot Token</Label>
              <Input
                id="bot_token"
                name="bot_token"
                type="password"
                value={formData.bot_token}
                onChange={handleInputChange}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-sm text-slate-400">
                Получите токен у @BotFather в Telegram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat_id" className="text-white">Chat ID</Label>
              <Input
                id="chat_id"
                name="chat_id"
                value={formData.chat_id}
                onChange={handleInputChange}
                placeholder="-1001234567890 или @channel_username"
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-sm text-slate-400">
                ID чата или канала куда отправлять уведомления
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active" className="text-white">
                Активировать уведомления
              </Label>
            </div>

            <Button 
              type="submit" 
              disabled={saveConfigMutation.isPending}
              className="w-full"
            >
              {saveConfigMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Сохранить конфигурацию
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {config && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="h-5 w-5" />
              Тестирование
            </CardTitle>
            <CardDescription>
              Отправьте тестовое сообщение для проверки работы бота
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test_message" className="text-white">Тестовое сообщение</Label>
              <Input
                id="test_message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Button 
              onClick={handleTestMessage}
              disabled={testMessageMutation.isPending || !formData.is_active}
              variant="outline"
              className="w-full"
            >
              {testMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Отправить тест
                </>
              )}
            </Button>
            
            {!formData.is_active && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Уведомления отключены. Включите их для отправки тестового сообщения.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTelegramBot;
