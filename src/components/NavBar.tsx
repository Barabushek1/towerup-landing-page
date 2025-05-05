import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, Phone, ChevronDown, Facebook, Instagram, MessageSquare, MapPin, Mail, PhoneCall } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import TestModeIndicator from './TestModeIndicator'; // Ensure path is correct
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

// Estimate the height of the TestModeIndicator based on its padding (py-1.5 = 6px top/bottom) + content height (~22-28px for text/icon)
// Let's estimate ~35px total height for safety. You might need to adjust this value.
const TEST_INDICATOR_HEIGHT = 35; // in pixels

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Adjust the scroll threshold based on the indicator height + original header offset
      if (offset > 50 + TEST_INDICATOR_HEIGHT) { // Added indicator height to scroll threshold
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
    { title: 'О нас', href: '/about' },
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
    {
      title: 'Проекты',
      href: '/projects',
      key: 'projects',
      hasSubmenu: true,
      submenu: [
        { title: 'ЖК "Пушкин"', href: '/projects/pushkin' },
        { title: 'ТРЦ "Бочка"', href: '/projects/trcbochka' }, // Updated link to TRC Bochka
        { title: 'БЦ "Бочка"', href: '/projects/bochka' },
        { title: 'Массив "Янги Узбекистан"', href: '/projects/newuzbekistan' },
      ]
    },
    { title: 'Новости', href: '/news', key: 'news' },
    { title: 'Вакансии', href: '/vacancies', key: 'vacancies' },
    { title: 'Контакты', href: '/contact', key: 'contacts' },
  ];

  const MobileMenu = () => (
    <div className="bg-[#080C16] h-full w-full overflow-auto">
      <nav className="flex flex-col w-full">
        {navLinks.map((link) => (
          link.hasSubmenu ? (
            <Collapsible key={link.key} className="w-full">
              <CollapsibleTrigger className="w-full flex items-center justify-between py-3 px-4 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5">
                <span>{link.title}</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-[#1a1a1a]">
                  {link.submenu?.map((subItem) => (
                    <SheetClose asChild key={subItem.title}>
                      <a
                        href={subItem.href}
                        className="w-full flex items-center py-2.5 px-6 text-gray-300 hover:text-white hover:bg-white/5 font-benzin text-sm border-b border-white/5"
                      >
                        {subItem.title}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SheetClose asChild key={link.key}>
              <a
                href={link.href}
                className="w-full flex items-center justify-between py-3 px-4 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5"
              >
                <span>{link.title}</span>
              </a>
            </SheetClose>
          )
        ))}
      </nav>

      <div className="mt-6 px-4">
        <div className="mb-5">
          <h3 className="text-white text-left font-benzin text-base mb-2.5">Контакты</h3>
          <div className="space-y-3">
            <a href="#address" className="flex items-start text-left space-x-2.5 text-gray-300 hover:text-white">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">г. Ташкент, ул. Большая Якиманка, 24</span>
            </a>
            <a href="mailto:info@example.com" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">info@towerup.uz</span>
            </a>
            <a href="tel:+998901234567" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white">
              <PhoneCall className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">+998 90 123 45 67</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white text-left font-benzin text-base mb-2.5">Соцсети</h3>
          <div className="flex space-x-3 mt-2">
            <a href="#facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#telegram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <MessageSquare className="h-4 w-4" />
            </a>
            <a href="#instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Test Mode Indicator - Apply fixed positioning directly */}
      {/* z-[60] ensures it's on top */}
      <TestModeIndicator className="fixed top-0 left-0 right-0 z-[60]" />

      {/* Header - Adjust top positioning to be below the indicator */}
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          // Calculate top based on the indicator height
          `top-[${TEST_INDICATOR_HEIGHT}px]`, // Set top position dynamically

          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-md shadow-sm py-3' // Original py-3 for scrolled state
            : 'bg-transparent py-5' // Original py-5 for initial state
            // Removed mt classes as 'top' is used for vertical positioning of a fixed element
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center"
          >
            <img
              src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
              alt="TOWERUP Logo"
              className="h-12 md:h-16 w-auto"
            />
          </a>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link) =>
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
                                  <a
                                    href={subItem.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-brand-dark font-benzin"
                                  >
                                    <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                  </a>
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
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              <a
                href="/contact"
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white font-medium",
                  "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5 font-benzin"
                )}
              >
                <Phone className="h-4 w-4" />
                Консультация
              </a>
            </div>
          )}

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 w-[85vw] max-w-xs bg-[#080C16] text-white border-l border-white/10"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <a
                    href="/"
                    className="flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img
                      src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
                      alt="TOWERUP Logo"
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
                  <MobileMenu />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>
      {/* Add padding-top to the body or a wrapper div to prevent content from being hidden behind fixed header */}
      {/* This might be better handled in a layout component or global CSS */}
       <div style={{ paddingTop: scrolled ? `calc(${TEST_INDICATOR_HEIGHT}px + var(--header-scrolled-height))` : `calc(${TEST_INDICATOR_HEIGHT}px + var(--header-initial-height))` }}>
         {/* The rest of your page content goes here */}
         {/* You need to ensure the actual page content is rendered *after* this layout */}
         {/* If NavBar is used directly within page components, you might need a different approach */}
         {/* A common pattern is a main Layout component that includes NavBar and applies padding to its content area */}
         {/* Example: <MainLayout><HomePageContent /></MainLayout> */}
         {/* For now, this padding div is just a placeholder illustration */}
       </div>
    </>
  );
};

export default NavBar;