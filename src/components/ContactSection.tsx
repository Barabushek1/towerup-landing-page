import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
const ContactSection: React.FC = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все поля формы",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Submitting message from contact section:', formData);

      // Добавляем сообщение в базу данных
      const {
        data,
        error
      } = await supabase.from('messages').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        created_at: new Date().toISOString(),
        read: false
      });
      if (error) {
        console.error('Error submitting message:', error);
        throw error;
      }
      console.log('Message submitted successfully:', data);
      toast({
        title: "Успешно отправлено",
        description: "Мы получили ваше сообщение и свяжемся с вами в ближайшее время"
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error in contact section form submission:', error);
      toast({
        title: "Ошибка отправки",
        description: `Произошла ошибка при отправке сообщения: ${error.message || 'Неизвестная ошибка'}. Пожалуйста, попробуйте еще раз.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="contact" className="py-16 bg-[#161616] relative overflow-hidden scroll-animate-section">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-center text-white">Связаться с нами</h2>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-slate-300 text-lg max-w-2xl text-center">
            Мы всегда готовы ответить на ваши вопросы и помочь решить ваши задачи
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:order-2">
            <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl border border-slate-700/30">
              <h3 className="text-2xl font-bold mb-6 text-white">Отправить сообщение</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ваше имя" className="bg-slate-800 border-slate-700 focus:border-primary" />
                  </div>
                  <div>
                    <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Ваш email" className="bg-slate-800 border-slate-700 focus:border-primary" />
                  </div>
                  <div>
                    <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Ваше сообщение" rows={5} className="bg-slate-800 border-slate-700 focus:border-primary" />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Отправка...
                      </> : <>
                        <Send className="mr-2 h-4 w-4" />
                        Отправить сообщение
                      </>}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:order-1">
            <h3 className="text-2xl font-bold mb-6 text-white">Контактная информация</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Адрес</h4>
                  <p className="text-slate-300">Город Ташкент, Сергелийский район, МСГ Янги Қумариқ.
Ориентир: Моторный завод GM.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Телефон</h4>
                  <p className="text-slate-300">+998 99 123-45-67</p>
                  <p className="text-slate-300">+998 99 987-65-43</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                  <p className="text-slate-300">info@towerup.uz</p>
                  <p className="text-slate-300">support@towerup.uz</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-medium text-white mb-4">Социальные сети</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path></svg>
                  </a>
                  <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;