
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { title: 'Главная', href: '#home' },
    { title: 'О нас', href: '#about' },
    { title: 'Продукты', href: '#products' },
    { title: 'Услуги', href: '#services' },
    { title: 'Отзывы', href: '#testimonials' },
    { title: 'Контакты', href: '#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-brand-dark/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a 
          href="#home" 
          className="flex items-center"
        >
          <img 
            src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png" 
            alt="UP Logo" 
            className="h-8 w-auto" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              className={cn(
                "nav-link tracking-wide hover:text-brand-primary transition-colors duration-300",
                scrolled ? "text-white" : "text-white"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.title}
            </a>
          ))}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-brand-darker/95 backdrop-blur-sm md:hidden transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
            {navLinks.map((link, index) => (
              <a
                key={link.title}
                href={link.href}
                className="text-white hover:text-brand-primary text-2xl font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
                style={{ 
                  opacity: 0,
                  animation: isOpen ? 'fadeIn 0.5s forwards' : 'none',
                  animationDelay: isOpen ? `${index * 100}ms` : '0ms'
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
          <button
            className="absolute top-6 right-6 focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
