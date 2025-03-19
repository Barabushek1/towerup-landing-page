
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
    elementsToObserve?.forEach((el) => observer.observe(el));
    
    return () => {
      elementsToObserve?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Эл. почта",
      value: "contact@company.com"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Телефон",
      value: "+1 (555) 123-4567"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Адрес",
      value: "123 Бизнес Авеню, Ташкент, 100000"
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="scroll-animate-section">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Контакты
            </span>
            <h2 className="section-heading mb-6">
              Свяжитесь с нашей командой
            </h2>
            <p className="section-subheading mb-12">
              Мы здесь, чтобы ответить на ваши вопросы и обсудить, как мы можем помочь вашему бизнесу процветать. Свяжитесь с нами любым из способов ниже.
            </p>
            
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <div className="text-primary">{info.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">{info.label}</h4>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-card p-8">
              <h3 className="text-xl font-medium mb-4">Рабочие часы</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Будние дни</h4>
                  <p>9:00 - 18:00</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Выходные</h4>
                  <p>Закрыто</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="scroll-animate-section">
            <form className="glass-card p-8">
              <h3 className="text-xl font-medium mb-6">Отправьте нам сообщение</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">Имя</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">Эл. почта</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Ваш email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm text-muted-foreground mb-2">Тема</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Тема сообщения"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm text-muted-foreground mb-2">Сообщение</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Ваше сообщение"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={cn(
                    "button-hover-effect w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium",
                    "shadow-lg shadow-primary/20 flex items-center justify-center"
                  )}
                >
                  <span>Отправить сообщение</span>
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
