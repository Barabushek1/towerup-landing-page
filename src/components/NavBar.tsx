
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, Phone, ChevronRight, ChevronDown, Facebook, Instagram, MessageSquare, MapPin, Mail, PhoneCall } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const companySubMenu = [
    { title: 'О нас', href: '/about' },
    { title: 'История', href: '/history' },
    { title: 'Партнёры', href: '/partners' },
    { title: 'Руководство', href: '/management' },
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

  // Mobile menu component with collapsible submenus
  const MobileMenu = () => (
    <div className="bg-[#222] h-full overflow-auto">
      <nav className="flex flex-col w-full">
        {navLinks.map((link) => (
          link.hasSubmenu ? (
            <Collapsible key={link.key} className="w-full">
              <CollapsibleTrigger className="w-full flex items-center justify-between py-3.5 px-6 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5">
                <span>{link.title}</span>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-[#1a1a1a]">
                  {link.submenu?.map((subItem) => (
                    <Link
                      key={subItem.title}
                      to={subItem.href}
                      className="w-full flex items-center py-3 px-8 text-gray-300 hover:text-white hover:bg-white/5 font-benzin text-sm border-b border-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              key={link.key}
              to={link.href}
              className="w-full flex items-center justify-between py-3.5 px-6 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{link.title}</span>
            </Link>
          )
        ))}
      </nav>
      
      <div className="mt-auto p-6">
        <div className="mb-6">
          <h3 className="text-white text-left font-benzin text-lg mb-3">Контакты</h3>
          <div className="space-y-4">
            <a href="#address" className="flex items-start text-left space-x-3 text-gray-300 hover:text-white">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">г. Ташкент, ул. Большая Якиманка, 24</span>
            </a>
            <a href="mailto:info@example.com" className="flex items-center text-left space-x-3 text-gray-300 hover:text-white">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">info@towerup.uz</span>
            </a>
            <a href="tel:+998901234567" className="flex items-center text-left space-x-3 text-gray-300 hover:text-white">
              <PhoneCall className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">+998 90 123 45 67</span>
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-left font-benzin text-lg mb-3">Соцсети</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#telegram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <MessageSquare className="h-5 w-5" />
            </a>
            <a href="#instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

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
            alt="TOWERUP Logo" 
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

        {/* Mobile Navigation - Modified for click-outside closing */}
        {isMobile && (
          <div ref={menuRef}>
            <button 
              className="md:hidden focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
            
            {/* Custom slide-out menu without the X icon */}
            <div 
              className={cn(
                "fixed top-0 right-0 bottom-0 z-50 w-[250px] bg-[#222] shadow-xl transition-transform duration-300",
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              )}
            >
              <MobileMenu />
            </div>
            
            {/* Backdrop overlay */}
            {isMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
