
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import TestModeIndicator from './TestModeIndicator';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Effect to close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Effect for scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { title: t('nav.projects'), path: '/projects' },
    { title: t('nav.about'), path: '/about' },
    { title: t('nav.news'), path: '/news' },
    { title: t('nav.vacancies'), path: '/vacancies' },
    { title: t('nav.collaboration'), path: '/collaboration' },
    { title: t('nav.contacts'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div 
      ref={navRef}
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png" 
              alt="Tower Up Logo" 
              className="h-8 md:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.path) 
                    ? "text-primary" 
                    : "text-slate-700 dark:text-slate-200"
                )}
              >
                {link.title}
              </Link>
            ))}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col px-6 py-8 h-full">
          <div className="space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={cn(
                  "block text-lg font-medium",
                  isActive(link.path) 
                    ? "text-primary" 
                    : "text-slate-700 dark:text-slate-200"
                )}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="mt-auto py-6">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      <TestModeIndicator />
    </div>
  );
};

export default NavBar;
