import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1
    });
    const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
    elementsToObserve?.forEach(el => observer.observe(el));
    return () => {
      elementsToObserve?.forEach(el => observer.unobserve(el));
    };
  }, []);
  const contactInfo = [{
    icon: <Mail className="h-5 w-5" />,
    label: "Эл. почта",
    value: "info@towerup.uz"
  }, {
    icon: <Phone className="h-5 w-5" />,
    label: "Телефон",
    value: "+998 (90) 123-45-67"
  }, {
    icon: <MapPin className="h-5 w-5" />,
    label: "Адрес",
    value: "TOWER UP, г. Ташкент, Узбекистан"
  }];
  return <section id="contact" ref={sectionRef} className="py-24 md:py-32 bg-[#1e1e1e] overflow-hidden relative">
      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 w-full rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Gradient background effects */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="scroll-animate-section">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Контакты
            </span>
            <h2 className="section-heading mb-6 text-white">
              Свяжитесь с нашей командой
            </h2>
            <p className="section-subheading mb-12 text-gray-300">
              Мы здесь, чтобы ответить на ваши вопросы и обсудить, как мы можем помочь вашему бизнесу процветать. Свяжитесь с нами любым из способов ниже.
            </p>
            
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => <div key={index} className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <div className="text-primary">{info.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">{info.label}</h4>
                    <p className="font-medium text-white">{info.value}</p>
                  </div>
                </div>)}
            </div>
            
            <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/30">
              <h3 className="text-xl font-medium mb-4 text-white">Рабочие часы</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Будние дни</h4>
                  <p className="text-gray-200">9:00 - 18:00</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Выходные</h4>
                  <p className="text-gray-200">Закрыто</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="scroll-animate-section">
            <form className="bg-slate-800/40 p-8 rounded-xl border border-slate-700/30 shadow-xl">
              <h3 className="text-xl font-medium mb-6 text-white">Отправьте нам сообщение</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-400 mb-2">Имя</label>
                    <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-white" placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-400 mb-2">Эл. почта</label>
                    <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-white" placeholder="Ваш email" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm text-gray-400 mb-2">Тема</label>
                  <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-white" placeholder="Тема сообщения" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-2">Сообщение</label>
                  <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none text-white" placeholder="Ваше сообщение"></textarea>
                </div>
                
                <button type="submit" className={cn("button-hover-effect w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium", "shadow-lg shadow-primary/20 flex items-center justify-center")}>
                  <span>Отправить сообщение</span>
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        
      </div>
    </section>;
};
export default ContactSection;