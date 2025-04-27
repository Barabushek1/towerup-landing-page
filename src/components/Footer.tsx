import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Linkedin, Instagram, ArrowUp, Send, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
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
                    <div>
                        <a href="/" aria-label="TOWERUP Home">
                            <img src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
            alt="TOWERUP Logo" className="h-10 w-auto mb-4"
            loading="lazy"
            />
                         </a>
                        <p className="text-white/70 mb-6 text-sm">
                            За годы существования компания TOWERUP зарекомендовала себя как надежного и ответственного застройщика.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TOWERUP Facebook" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://t.me/towerup_uz" target="_blank" rel="noopener noreferrer" aria-label="TOWERUP Telegram" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Send className="h-5 w-5" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TOWERUP LinkedIn" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TOWERUP Instagram" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-base mb-5 text-white uppercase tracking-wider">Навигация</h3>
                        <ul className="space-y-2.5">
                            <li><a href="/" className="text-sm text-white/70 hover:text-primary transition-colors">Главная</a></li>
                            <li><a href="/about" className="text-sm text-white/70 hover:text-primary transition-colors">О компании</a></li>
                            <li><a href="/projects" className="text-sm text-white/70 hover:text-primary transition-colors">Проекты</a></li>
                            <li><a href="/news" className="text-sm text-white/70 hover:text-primary transition-colors">Новости</a></li>
                            <li><a href="/vacancies" className="text-sm text-white/70 hover:text-primary transition-colors">Вакансии</a></li>
                            <li><a href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Контакты</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-base mb-5 text-white uppercase tracking-wider">Контакты</h3>
                        <address className="not-italic text-sm">
                            <p className="text-white/70 mb-2 leading-relaxed">
                                г. Ташкент, Сергелийский р-н,<br /> МСГ Янги Қумариқ.<br /> Ориентир: Моторный завод GM.
                            </p>
                            <div className="mt-4 space-y-2">
                                <p className="flex items-center">
                                    <a href="mailto:info@towerup.uz" className="text-white/70 hover:text-primary transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                        info@towerup.uz
                                    </a>
                                </p>
                                <p className="flex items-center gap-2 text-white/70">
                                    <PhoneCall size={16} className="text-primary flex-shrink-0" />
                                    <span className='flex flex-col'>
                                        <a href="tel:+998555100003" className="hover:text-primary transition-colors">+998 (55) 510-00-03</a>
                                        <a href="tel:+998555110003" className="hover:text-primary transition-colors">+998 (55) 511-00-03</a>
                                    </span>
                                </p>
                             </div>
                        </address>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10">
                    <p className="text-white/50 text-xs mb-4 md:mb-0">
                        © {new Date().getFullYear()} TOWERUP. Все права защищены.
                    </p>
                    <div className="flex space-x-6">
                        <Link to="/privacy-policy" className="text-xs text-white/50 hover:text-primary transition-colors">
                            Политика конфиденциальности
                        </Link>
                    </div>
                </div>
            </div>

            {showBackToTop}
        </footer>;
};

export default Footer;
