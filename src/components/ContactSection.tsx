
import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { name, email, subject, message }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.",
      });
      
      // Clear form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-benzin">СВЯЖИТЕСЬ С НАМИ</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-benzin">
            Остались вопросы? Свяжитесь с нами для получения консультации или обсуждения проекта
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-gray-800/80">
            <h3 className="text-2xl font-semibold mb-6 text-white font-benzin">Наши контакты</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Адрес</h4>
                  <p className="text-gray-300 font-benzin">TOWER UP, г. Ташкент, Узбекистан</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Телефон</h4>
                  <p className="text-gray-300 font-benzin">+998 (90) 123-45-67</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Email</h4>
                  <p className="text-gray-300 font-benzin">info@towerup.uz</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-white">Режим работы</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                  <div>
                    <h5 className="text-sm text-gray-400 mb-1">Будние дни</h5>
                    <p className="text-white font-benzin">9:00 - 18:00</p>
                  </div>
                  <div>
                    <h5 className="text-sm text-gray-400 mb-1">Выходные</h5>
                    <p className="text-white font-benzin">Закрыто</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-gray-800/80">
            <h3 className="text-2xl font-semibold mb-6 text-white font-benzin">Форма обратной связи</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="text-gray-300 mb-1.5 block">Ваше имя</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите ваше имя" 
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-gray-300 mb-1.5 block">Email</label>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите ваш email" 
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-gray-300 mb-1.5 block">Тема</label>
                <input 
                  id="subject"
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Тема сообщения" 
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="text-gray-300 mb-1.5 block">Сообщение</label>
                <textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ваше сообщение" 
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none text-white"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="button-hover-effect w-full px-6 py-3 rounded-lg bg-primary text-white font-medium font-benzin shadow-lg shadow-primary/20 transform transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Отправка...
                  </>
                ) : (
                  <>
                    Отправить
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
