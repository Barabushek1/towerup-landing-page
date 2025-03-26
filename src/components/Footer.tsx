import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Linkedin, Instagram, ArrowUp, MessageSquare, PhoneCall } from 'lucide-react';
const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <footer className="text-white pt-16 pb-8 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-6 text-white">
              <img src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png" alt="TOWERUP Logo" className="h-12 w-auto mb-4" />
            </h3>
            <p className="text-white/70 mb-6">
              За годы существования компания TOWERUP зарекомендовала себя как надежного и ответственного застройщика.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links - Updated to match navbar items */}
          <div>
            <h3 className="font-medium text-lg mb-6 text-white">Быстрые ссылки</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-white/70 hover:text-brand-primary transition-colors">Главная</a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-brand-primary transition-colors">О компании</a>
              </li>
              <li>
                <a href="#projects" className="text-white/70 hover:text-brand-primary transition-colors">Проекты</a>
              </li>
              <li>
                <a href="#news" className="text-white/70 hover:text-brand-primary transition-colors">Новости</a>
              </li>
              <li>
                <a href="#vacancies" className="text-white/70 hover:text-brand-primary transition-colors">Вакансии</a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-brand-primary transition-colors">Контакты</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-medium text-lg mb-6 text-white">Контакты</h3>
            <address className="not-italic">
              <p className="text-white/70 mb-2">ул. Бизнес, 123</p>
              <p className="text-white/70 mb-2">Ташкент, 100000</p>
              <p className="text-white/70 mb-6">Узбекистан</p>
              <p className="mb-2">
                <span className="text-white/70">Email: </span>
                <a href="mailto:contact@towerup.uz" className="hover:text-brand-primary transition-colors">contact@towerup.uz</a>
              </p>
              <p>
                <span className="text-white/70">Телефон: </span>
                <a href="tel:+998901234567" className="hover:text-brand-primary transition-colors">+998 (90) 123-45-67</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TOWERUP. Все права защищены.
          </p>
          
          <div className="flex space-x-8">
            <a href="#" className="text-sm text-white/70 hover:text-brand-primary transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-sm text-white/70 hover:text-brand-primary transition-colors">Условия использования</a>
            <a href="#" className="text-sm text-white/70 hover:text-brand-primary transition-colors">Политика cookies</a>
          </div>
          
          {/* Back to top button - now only shows on scroll */}
          {showBackToTop && <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg hover:bg-brand-primary/90 transition-all duration-300 z-30 group" aria-label="Наверх">
              <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
            </button>}
        </div>
      </div>
    </footer>;
};
export default Footer;