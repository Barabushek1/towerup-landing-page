import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Assuming cn is available
import { Menu, Phone, ChevronDown, Facebook, Instagram, MessageSquare, MapPin, Mail, PhoneCall, Handshake } from 'lucide-react'; // Ensure icons are imported
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming hook exists
import TestModeIndicator from './TestModeIndicator'; // Assuming component exists
import LanguageSelector from './LanguageSelector'; // Assuming component exists
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming context exists
import {
  NavigationMenu, // Keep NavigationMenu for context
  // REMOVED: NavigationMenuContent - we'll replace its functionality
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger, // Keep Trigger for styling and interaction
} from "@/components/ui/navigation-menu"; // Assuming Shadcn components are styled

import {
  Collapsible, // Keep for mobile
  CollapsibleContent, // Keep for mobile
  CollapsibleTrigger, // Keep for mobile
} from "@/components/ui/collapsible"; // Assuming Shadcn components are styled

import {
  Sheet, // Keep for mobile
  SheetContent, // Keep for mobile
  SheetTrigger, // Keep for mobile
  SheetClose // Keep for mobile
} from "@/components/ui/sheet"; // Assuming Shadcn components are styled


// Estimate the height of the TestModeIndicator
const TEST_INDICATOR_HEIGHT = 35; // in pixels

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // State to manage which dropdown is open
  // Stores the key of the open dropdown (e.g., 'company', 'projects') or null
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Ref to close dropdown when clicking outside
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50 + TEST_INDICATOR_HEIGHT) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Click occurred outside the navbar/menu area, close dropdowns
        setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside); // Add listener for outside clicks

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside); // Clean up listener
    };
  }, [images.length]); // Make sure images.length dependency is correct or remove if not used

  // Corrected navLinks data structure
  const navLinks = [
    {
      title: t('nav.company'),
      href: '/about',
      hasSubmenu: true,
      key: 'company', // Use a unique key for dropdown state management
      submenu: [
        { title: t('nav.about'), href: '/about' },
        { title: t('nav.partners'), href: '/partners' },
        { title: t('nav.management'), href: '/management' },
      ]
    },
    {
      title: t('nav.projects'),
      href: '/projects',
      hasSubmenu: true,
      key: 'projects', // Use a unique key
      submenu: [
        { title: t('nav.projectPushkin'), href: '/projects/pushkin' },
        { title: t('nav.projectTrcBochka'), href: '/projects/trcbochka' },
        { title: t('nav.projectNewUzbekistan'), href: '/projects/new-uzbekistan' },
      ]
    },
    { title: t('nav.news'), href: '/news', hasSubmenu: false, key: 'news' },
    { title: t('nav.vacancies'), href: '/vacancies', hasSubmenu: false, key: 'vacancies' },
    { title: t('nav.collaboration'), href: '/collaboration', hasSubmenu: false, key: 'collaboration' },
    { title: t('nav.contacts'), href: '/contact', hasSubmenu: false, key: 'contacts' },
    // Add any other top-level links here
  ];

  // Helper function to toggle dropdown state
  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Mobile menu component (remains largely the same)
  const MobileMenu = () => (
    <div className="bg-[#080C16] h-full w-full overflow-auto">
      <nav className="flex flex-col w-full">
        {navLinks.map((link) => (
          link.hasSubmenu ? (
            // Mobile: Use Collapsible
            <Collapsible key={link.key} className="w-full">
              <CollapsibleTrigger className="w-full flex items-center justify-between py-3 px-4 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5">
                <span>{link.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-300 data-[state=open]:rotate-180" /> {/* Add rotation */}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-[#1a1a1a]">
                  {link.submenu?.map((subItem) => (
                    <SheetClose asChild key={subItem.title}>
                      {/* Use Link for internal navigation */}
                      <Link
                        to={subItem.href}
                        className="w-full flex items-center py-2.5 px-6 text-gray-300 hover:text-white hover:bg-white/5 font-benzin text-sm border-b border-white/5"
                        onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} // Close sheet and any open dropdown
                      >
                        {subItem.title}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            // Mobile: Regular link
            <SheetClose asChild key={link.key}>
              {/* Use Link for internal navigation */}
              <Link
                to={link.href}
                className="w-full flex items-center justify-between py-3 px-4 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5"
                onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} // Close sheet and any open dropdown
              >
                <span>{link.title}</span>
              </Link>
            </SheetClose>
          )
        ))}
      </nav>

      {/* Mobile Menu Footer - Keep as is, but ensure links close sheet/dropdowns */}
      <div className="mt-6 px-4 pb-6"> {/* Added padding-bottom */}
        <div className="mb-5">
          <h3 className="text-white text-left font-benzin text-base mb-2.5">{t('nav.contacts')}</h3>
          <div className="space-y-3">
             <SheetClose asChild>
              <a href="#address" className="flex items-start text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('footer.address')}</span>
              </a>
             </SheetClose>
             <SheetClose asChild>
              <a href="mailto:info@towerup.uz" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">info@towerup.uz</span>
              </a>
             </SheetClose>
             <SheetClose asChild>
              <a href="tel:+998901234567" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>
                <PhoneCall className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+998 90 123 45 67</span>
              </a>
             </SheetClose>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-left font-benzin text-base mb-2.5">{t('footer.services')}</h3> {/* Check if this key is correct for Socials heading */}
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
          <div className="pt-2">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Test Mode Indicator */}
      <TestModeIndicator className="fixed top-0 left-0 right-0 z-[60]" />

      {/* Header */}
      <header
         // Add ref to header or a parent div that contains the navigation, for click-outside detection
         ref={navRef}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          `top-[${TEST_INDICATOR_HEIGHT}px]`, // Position below indicator

          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo Link */}
          <Link to="/" className="flex items-center" onClick={() => setOpenDropdown(null)}> {/* Close dropdown on logo click */}
            <img
              src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
              alt="TOWERUP Logo"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu> {/* Shadcn NavigationMenu context */}
                <NavigationMenuList className="flex items-center space-x-6"> {/* Flex items with spacing */}
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.key} className="relative"> {/* Make item relative for dropdown positioning */}
                      {link.hasSubmenu ? (
                        <>
                          {/* NavigationMenuTrigger for dropdown */}
                          {/* Use onClick to toggle custom dropdown state */}
                          <NavigationMenuTrigger
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default link behavior on click
                              toggleDropdown(link.key);
                            }}
                            // Use onMouseEnter/onMouseLeave for hover interaction (optional)
                            // onMouseEnter={() => setOpenDropdown(link.key)}
                            // onMouseLeave={() => setOpenDropdown(null)} // Simple leave might close too fast, consider delayed close
                            className={cn(
                              "font-benzin tracking-wide transition-colors duration-300 px-3 py-2", // Base styling
                              scrolled ? "text-white" : "text-white", // Scrolled/initial text color
                              location.pathname.startsWith(link.href) ? 'text-primary' : 'hover:text-primary' // Active/Hover color
                              // Removed bg-transparent and focus:bg-transparent from here as they are handled by Shadcn Trigger base style
                            )}
                             // Add aria-expanded for accessibility
                             aria-expanded={openDropdown === link.key}
                             aria-controls={`submenu-${link.key}`} // Link trigger to dropdown content
                          >
                            {link.title}
                             <ChevronDown className={cn(
                                "ml-1 h-4 w-4 transition duration-200",
                                openDropdown === link.key ? "rotate-180" : "" // Rotate icon
                             )} />
                          </NavigationMenuTrigger>

                          {/* Custom Dropdown Content */}
                          {/* Conditionally render based on openDropdown state */}
                          {openDropdown === link.key && (
                            <div
                               id={`submenu-${link.key}`} // ID for aria-controls
                               className={cn(
                                  "absolute top-full left-1/2 -translate-x-1/2 mt-2", // Position below trigger, centered
                                  "w-[200px] rounded-md shadow-lg overflow-hidden", // Styling for dropdown box
                                  "bg-white/90 backdrop-blur-md border border-white/20", // Background and border
                                  "animate-in data-[side=top]:slide-in-from-top-1 data-[side=bottom]:slide-in-from-bottom-1", // Animation example (needs classes defined)
                                  "z-50" // Ensure it's above other content
                                )}
                                // Add event listeners if using hover (optional)
                                // onMouseEnter={() => setOpenDropdown(link.key)}
                                // onMouseLeave={() => setOpenDropdown(null)}
                             >
                              <ul className="grid gap-1 p-2"> {/* Grid for items, padding */}
                                {link.submenu?.map((subItem) => (
                                  <li key={subItem.title}>
                                    {/* Use Link for internal navigation */}
                                    <Link
                                      to={subItem.href}
                                      className={cn(
                                        "block select-none space-y-1 rounded-sm p-2 leading-none no-underline outline-none transition-colors", // Base link styling
                                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", // Hover/Focus styles (from Shadcn accent)
                                        "text-brand-dark font-benzin text-sm" // Font styles (assuming brand-dark is suitable for dark theme dropdown text)
                                      )}
                                       onClick={() => setOpenDropdown(null)} // Close dropdown on click
                                    >
                                      <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        // Regular link without submenu
                        <NavigationMenuLink asChild> {/* Use NavigationMenuLink for single items too */}
                          <Link
                            to={link.href}
                            className={cn(
                              "nav-link tracking-wide transition-colors duration-300 font-benzin px-3 py-2",
                              scrolled ? "text-white" : "text-white",
                              location.pathname === link.href ? 'text-primary' : 'hover:text-primary' // Active/Hover color
                            )}
                            onClick={() => setOpenDropdown(null)} // Close dropdown on link click
                          >
                            <span>{link.title}</span>
                             {/* Removed the buggy conditional rendering */}
                             {/* {link.key === 'collaboration'} */}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Right side: Language Selector and Consultation Button */}
              <div className="flex items-center gap-4">
                <LanguageSelector /> {/* Keep language selector */}

                {/* Consultation Button */}
                <Link
                  to="/contact" // Link to contact page
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium", // Primary button styling
                    "shadow-lg shadow-primary/20 transform transition hover:-translate-y-0.5 font-benzin" // Hover effect and font
                  )}
                   onClick={() => setOpenDropdown(null)} // Close dropdown on button click
                >
                  <Phone className="h-4 w-4" />
                  {t('nav.consultation')}
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Sheet Menu */}
          {isMobile && (
             // Keep the Sheet component for mobile menu
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                {/* Mobile Menu Trigger Button */}
                <button
                  className="md:hidden focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6 text-white" />
                </button>
              </SheetTrigger>
              {/* Sheet Content (Mobile Menu) */}
              <SheetContent
                side="right"
                className="p-0 w-[85vw] max-w-xs bg-[#080C16] text-white border-l border-white/10" // Dark theme styling
              >
                {/* Sheet Header (Logo) */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Link to="/" className="flex items-center" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>
                    <img
                      src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
                      alt="TOWERUP Logo"
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>
                {/* Mobile Menu Links (Uses MobileMenu component) */}
                <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
                  <MobileMenu />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {/* Padding div to prevent content from being hidden by fixed header */}
      {/* You might need to refine the padding value based on the actual header heights */}
       <div style={{ paddingTop: scrolled ? `calc(${TEST_INDICATOR_HEIGHT}px + 60px)` : `calc(${TEST_INDICATOR_HEIGHT}px + 80px)` }}>
         {/* The rest of your page content goes here */}
         {/* This div should wrap the content rendered by your router */}
       </div>
    </>
  );
};

export default NavBar;