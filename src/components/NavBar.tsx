
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Phone, ChevronRight, Facebook, Instagram, Twitter, Youtube, MapPin, Mail, PhoneCall } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

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

  // Add body overflow control to prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSubmenu = (key: string) => {
    if (expandedSubmenu === key) {
      setExpandedSubmenu(null);
    } else {
      setExpandedSubmenu(key);
    }
  };

  const companySubMenu = [
    { title: 'О нас', href: '/about' },
    { title: 'История', href: '/history' },
    { title: 'Партнёры', href: '/partners' },
    { title: 'Руководство', href: '/management' },
  ];

  const servicesSubMenu = [
    { title: 'Строительство объектов', href: '/construction' },
    { title: 'Проектирование', href: '/design' },
    { title: 'Решения для объектов', href: '/solutions' },
  ];

  const usefulLinksSubMenu = [
    { title: 'О компании', href: '/about' },
    { title: 'Наши работы', href: '/projects' },
    { title: 'Новости', href: '/news' },
    { title: 'Вакансии', href: '/vacancies' },
  ];

  const navLinks = [
    { 
      title: 'О компании', 
      href: '/about',
      hasSubmenu: true,
      key: 'company',
      submenu: companySubMenu 
    },
    { title: 'Проекты', href: '/projects', key: 'projects' },
    { title: 'Новости', href: '/news', key: 'news' },
    { title: 'Вакансии', href: '/vacancies', key: 'vacancies' },
    { title: 'Контакты', href: '/contact', key: 'contacts' },
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
        <Link 
          to="/" 
          className="flex items-center"
        >
          <img 
            src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png" 
            alt="UP Logo" 
            className="h-12 md:h-16 w-auto" 
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  link.hasSubmenu ? (
                    <NavigationMenuItem key={link.title}>
                      <NavigationMenuTrigger className={cn(
                        "font-benzin tracking-wide hover:text-brand-primary transition-colors duration-300",
                        scrolled ? "text-white bg-transparent" : "text-white bg-transparent",
                        "hover:bg-transparent focus:bg-transparent"
                      )}>
                        {link.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4 bg-white/90 backdrop-blur-md">
                          {link.submenu?.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-brand-dark font-benzin"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.title}>
                      <Link
                        to={link.href}
                        className={cn(
                          "nav-link tracking-wide hover:text-brand-primary transition-colors duration-300 font-benzin px-3 py-2",
                          scrolled ? "text-white" : "text-white"
                        )}
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuItem>
                  )
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/contact"
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white font-medium",
                "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5 font-benzin"
              )}
            >
              <Phone className="h-4 w-4" />
              Консультация
            </Link>
          </div>
        )}

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden focus:outline-none z-50"
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
        {isMobile && (
          <div
            className={cn(
              "fixed inset-0 bg-[#1A2836] flex flex-col items-stretch pt-20 pb-10 overflow-y-auto",
              "transition-all duration-300",
              isOpen ? "opacity-100 visible z-40" : "opacity-0 invisible -z-10"
            )}
          >
            <div className="absolute top-5 right-5">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-stretch w-full px-6 overflow-y-auto">
              {/* Main navigation */}
              <div className="space-y-1 mb-6">
                {navLinks.map((link) => (
                  <div key={link.key} className="w-full">
                    {link.hasSubmenu ? (
                      <>
                        <button 
                          onClick={() => toggleSubmenu(link.key)}
                          className="w-full flex items-center justify-between py-3 text-white font-benzin text-base"
                        >
                          <span>{link.title}</span>
                          <ChevronRight 
                            className={cn(
                              "h-5 w-5 transition-transform",
                              expandedSubmenu === link.key ? "rotate-90" : ""
                            )} 
                          />
                        </button>
                        {expandedSubmenu === link.key && (
                          <div className="pl-4 space-y-3 mt-1 mb-3">
                            {link.submenu?.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block text-gray-300 hover:text-white text-sm py-1.5 font-benzin"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        className="w-full flex items-center justify-between py-3 text-white font-benzin text-base"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{link.title}</span>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-700 my-4" />
              
              {/* Services Section */}
              <div className="mb-6">
                <h3 className="text-white text-left font-benzin text-lg mb-3">Услуги</h3>
                <div className="space-y-3">
                  {servicesSubMenu.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-center justify-between text-gray-300 hover:text-white py-1.5 text-base font-benzin"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
              
              <Separator className="bg-gray-700 my-4" />
              
              {/* Useful Links */}
              <div className="mb-6">
                <h3 className="text-white text-left font-benzin text-lg mb-3">Полезные ссылки</h3>
                <div className="space-y-3">
                  {usefulLinksSubMenu.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-center justify-between text-gray-300 hover:text-white py-1.5 text-base font-benzin"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
              
              <Separator className="bg-gray-700 my-4" />
              
              {/* Social Media Links */}
              <div className="mb-6">
                <h3 className="text-white text-left font-benzin text-lg mb-3">Соцсети</h3>
                <div className="flex space-x-4 mt-2">
                  <a href="#facebook" className="text-gray-400 hover:text-white p-2">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#twitter" className="text-gray-400 hover:text-white p-2">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#instagram" className="text-gray-400 hover:text-white p-2">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#youtube" className="text-gray-400 hover:text-white p-2">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="mt-auto">
                <h3 className="text-white text-left font-benzin text-lg mb-3">Контактные данные</h3>
                <div className="space-y-4">
                  <a href="#address" className="flex items-start text-left space-x-3 text-gray-300 hover:text-white">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">г. Москва, ул. Большая Якиманка, 24</span>
                  </a>
                  <a href="mailto:info@example.com" className="flex items-center text-left space-x-3 text-gray-300 hover:text-white">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">info@example.com</span>
                  </a>
                  <a href="tel:+79257123000" className="flex items-center text-left space-x-3 text-gray-300 hover:text-white">
                    <PhoneCall className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">+7 925 712 30 00</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
