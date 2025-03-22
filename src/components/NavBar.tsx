
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

  const companySubMenu = [
    { title: 'О нас', href: '#about' },
    { title: 'История', href: '#history' },
    { title: 'Партнёры', href: '#partners' },
    { title: 'Руководство', href: '#management' },
  ];

  const navLinks = [
    { 
      title: 'О компании', 
      href: '#about',
      hasSubmenu: true,
      submenu: companySubMenu 
    },
    { title: 'Проекты', href: '#projects' },
    { title: 'Услуги', href: '#services' },
    { title: 'Новости', href: '#news' },
    { title: 'Вакансии', href: '#vacancies' },
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
            className="h-16 w-auto" 
          />
        </a>

        {/* Desktop Navigation */}
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
                            <NavigationMenuLink
                              href={subItem.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-brand-dark font-benzin"
                            >
                              <div className="text-sm font-medium leading-none">{subItem.title}</div>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={link.title}>
                    <a
                      href={link.href}
                      className={cn(
                        "nav-link tracking-wide hover:text-brand-primary transition-colors duration-300 font-benzin px-3 py-2",
                        scrolled ? "text-white" : "text-white"
                      )}
                    >
                      {link.title}
                    </a>
                  </NavigationMenuItem>
                )
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <a
            href="#contact"
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white font-medium",
              "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5 font-benzin"
            )}
          >
            <Phone className="h-4 w-4" />
            Консультация
          </a>
        </div>

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
              link.hasSubmenu ? (
                <div key={link.title} className="flex flex-col items-center space-y-4">
                  <span className="text-white text-2xl font-benzin font-medium">{link.title}</span>
                  <div className="flex flex-col items-center space-y-4">
                    {link.submenu?.map((subItem) => (
                      <a
                        key={subItem.title}
                        href={subItem.href}
                        className="text-white/80 hover:text-brand-primary text-lg font-benzin transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                        style={{ 
                          opacity: 0,
                          animation: isOpen ? 'fadeIn 0.5s forwards' : 'none',
                          animationDelay: isOpen ? `${index * 100}ms` : '0ms'
                        }}
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  className="text-white hover:text-brand-primary text-2xl font-benzin font-medium transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    opacity: 0,
                    animation: isOpen ? 'fadeIn 0.5s forwards' : 'none',
                    animationDelay: isOpen ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {link.title}
                </a>
              )
            ))}
            
            <a
              href="#contact"
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white font-benzin font-medium shadow-lg"
              onClick={() => setIsOpen(false)}
              style={{ 
                opacity: 0,
                animation: isOpen ? 'fadeIn 0.5s forwards' : 'none',
                animationDelay: isOpen ? `${navLinks.length * 100 + 100}ms` : '0ms'
              }}
            >
              <Phone className="h-4 w-4" />
              Консультация
            </a>
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
