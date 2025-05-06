import React, { useState, useEffect, useRef, useMemo } from 'react'; // Import useMemo
import { useLocation, Link } from 'react-router-dom'; // Import Link
import { cn } from '@/lib/utils'; // Assuming cn is available
import { Menu, Phone, ChevronDown, Facebook, Instagram, MessageSquare, MapPin, Mail, PhoneCall, Handshake } from 'lucide-react'; // Ensure icons are imported
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming hook exists
import TestModeIndicator from './TestModeIndicator'; // Assuming component exists
import LanguageSelector from './LanguageSelector'; // Assuming component exists
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming context exists
// Removing Shadcn NavigationMenu related imports we are no longer using
// import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";

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
  // Use a single state for the currently open dropdown key
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  // Ref to close dropdown when clicking outside
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Adjust the scroll threshold based on the indicator height + original header offset
      // Assume initial header height is around 80px (py-5) and scrolled is 60px (py-3)
      const initialHeaderHeight = 80;
      const scrolledHeaderHeight = 60;

      if (offset > initialHeaderHeight + TEST_INDICATOR_HEIGHT - 10) { // Adjust threshold if needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // If the click target is outside the navbar ref AND a dropdown is open
      if (navRef.current && !navRef.current.contains(event.target as Node) && openDropdownKey !== null) {
        setOpenDropdownKey(null); // Close the open dropdown
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside); // Add listener for outside clicks

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside); // Clean up listener
    };
  }, [openDropdownKey]); // Dependency on openDropdownKey to ensure listener is correct

  // Corrected navLinks data structure - Memoized
  const navLinks = useMemo(() => [
    {
      title: t('nav.company'),
      href: '/about', // Top-level link is still /about
      hasSubmenu: true,
      key: 'company',
      submenu: [
        { title: t('nav.about'), href: '/about' },
        { title: t('nav.partners'), href: '/partners' },
        { title: t('nav.management'), href: '/management' },
      ]
    },
    {
      title: t('nav.projects'),
      href: '/projects', // Top-level link is still /projects
      hasSubmenu: true,
      key: 'projects',
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
  ], [t]); // Dependency on t for translation updates

  // Helper function to toggle dropdown state
  const toggleDropdown = (key: string) => {
    setOpenDropdownKey(openDropdownKey === key ? null : key);
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
                <ChevronDown className="h-4 w-4 transition-transform duration-300 data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-[#1a1a1a]">
                  {link.submenu?.map((subItem) => (
                    <SheetClose asChild key={subItem.title}>
                      <Link
                        to={subItem.href}
                        className="w-full flex items-center py-2.5 px-6 text-gray-300 hover:text-white hover:bg-white/5 font-benzin text-sm border-b border-white/5"
                        onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }} // Close sheet and dropdowns
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
              <Link
                to={link.href}
                className="w-full flex items-center justify-between py-3 px-4 text-white border-b border-white/10 font-benzin text-base hover:bg-white/5"
                onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }} // Close sheet and dropdowns
              >
                <span>{link.title}</span>
              </Link>
            </SheetClose>
          )
        ))}
      </nav>

      {/* Mobile Menu Footer - Keep as is, ensure links close sheet/dropdowns */}
      <div className="mt-6 px-4 pb-6"> {/* Added padding-bottom */}
        <div className="mb-5">
          <h3 className="text-white text-left font-benzin text-base mb-2.5">{t('nav.contacts')}</h3> {/* Assuming key is correct */}
          <div className="space-y-3">
             <SheetClose asChild>
              <a href="#address" className="flex items-start text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }}>
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('footer.address')}</span> {/* Assuming key is correct */}
              </a>
             </SheetClose>
             <SheetClose asChild>
              <a href="mailto:info@towerup.uz" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }}>
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">info@towerup.uz</span>
              </a>
             </SheetClose>
             <SheetClose asChild>
              <a href="tel:+998901234567" className="flex items-center text-left space-x-2.5 text-gray-300 hover:text-white" onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }}>
                <PhoneCall className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+998 90 123 45 67</span>
              </a>
             </SheetClose>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {/* Check if this key is correct for Socials heading */}
            <h3 className="text-white text-left font-benzin text-base mb-2.5">{t('footer.services')}</h3>
            <div className="flex space-x-3 mt-2">
              {/* Social Media Links */}
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
            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Test Mode Indicator - Stays fixed at the very top */}
      <TestModeIndicator className="fixed top-0 left-0 right-0 z-[60]" />

      {/* Header - Positioned below the indicator */}
      <header
         // Add ref to header or a parent div that contains the navigation, for click-outside detection
         ref={navRef}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          `top-[${TEST_INDICATOR_HEIGHT}px]`, // Position below indicator

          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-md shadow-sm py-3' // Scrolled state styling
            : 'bg-transparent py-5' // Initial state styling
        )}
      >
        {/* Container to control content width and centering */}
        <div className="container mx-auto px-6">
          {/* Flex container for Logo and Menu items */}
          <div className="flex items-center justify-between"> {/* Use justify-between to push logo and menu to opposite ends */}

            {/* Logo - Positioned at the far left by flex-shrink-0 and justify-between on parent */}
            <Link to="/" className="flex-shrink-0" onClick={() => setOpenDropdownKey(null)}> {/* Close dropdown on logo click */}
              <img
                src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
                alt="TOWERUP Logo"
                className="h-12 md:h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation and Actions - All positioned at the far right by justify-between */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-8"> {/* space-x between nav and right items */}

                {/* Navigation Links */}
                <nav className="flex items-center">
                  <ul className="flex items-center space-x-6"> {/* space-x between main nav items */}
                    {navLinks.map((link) => (
                      <li
                        key={link.key}
                        className="relative" // Needed for absolute positioning of the dropdown
                        // Use onMouseEnter/onMouseLeave to toggle dropdown state for hover
                        onMouseEnter={() => setOpenDropdownKey(link.key)}
                        onMouseLeave={() => setOpenDropdownKey(null)} // Simple leave to close
                      >
                        {link.hasSubmenu ? (
                           // Item with submenu
                          <>
                            {/* Trigger for dropdown - styled as a button/link */}
                             {/* Use a button for semantic correctness as it triggers an action */}
                            <button
                              // Use onClick to also toggle on click (good for touchpads)
                              onClick={(e) => {
                                e.preventDefault(); // Prevent potential default link behavior
                                toggleDropdown(link.key);
                              }}
                              className={cn(
                                "flex items-center gap-1.5 p-2 font-benzin tracking-wide transition-colors duration-300 bg-transparent border-0 cursor-pointer", // Base styling
                                scrolled ? "text-white" : "text-white", // Scrolled/initial text color
                                location.pathname.startsWith(link.href) ? 'text-primary' : 'hover:text-primary' // Active/Hover color
                              )}
                                // Add aria-expanded for accessibility
                                aria-expanded={openDropdownKey === link.key}
                                aria-controls={`submenu-${link.key}`} // Link trigger to dropdown content
                            >
                              <span>{link.title}</span>
                               {/* Chevron icon rotated when dropdown is open */}
                              <ChevronDown className={cn(
                                  "ml-1 h-4 w-4 transition duration-200",
                                  openDropdownKey === link.key ? "rotate-180" : ""
                              )} />
                            </button>

                            {/* Custom Dropdown Content */}
                            {/* Conditionally render based on openDropdownKey state */}
                            {/* Use transition classes for fade/scale effect */}
                            <div
                               id={`submenu-${link.key}`} // ID for aria-controls
                               className={cn(
                                  "absolute left-1/2 -translate-x-1/2 mt-0", // Position below trigger, centered
                                  "top-full", // Place directly below the trigger
                                  "w-[200px] rounded-md shadow-lg overflow-hidden", // Styling for dropdown box
                                  "bg-white/90 backdrop-blur-md border border-white/20", // Background and border
                                   // Transition and visibility based on state
                                  "transition-all duration-200 ease-in-out origin-top",
                                  openDropdownKey === link.key
                                      ? "scale-100 opacity-100 visible translate-y-0" // Visible state
                                      : "scale-95 opacity-0 invisible translate-y-[-10px] pointer-events-none" // Hidden state
                               )}
                                // Adding margin top might help visual spacing
                               style={{ marginTop: '8px' }} // Add some space below the trigger
                            >
                              <ul className="grid gap-1 p-2"> {/* Grid for items, padding */}
                                {link.submenu?.map((subItem) => (
                                   <li key={subItem.title}>
                                     {/* Use Link for internal navigation */}
                                     <Link
                                       to={subItem.href}
                                       className={cn(
                                         "block select-none rounded-sm p-2 leading-none no-underline outline-none transition-colors", // Base link styling
                                         "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", // Hover/Focus styles (from Shadcn accent)
                                         "text-brand-dark font-benzin text-sm" // Font styles
                                       )}
                                        onClick={() => setOpenDropdownKey(null)} // Close dropdown on click
                                     >
                                       <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                     </Link>
                                   </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          // Regular link without submenu
                           <li key={link.key}> {/* Wrap single links in li for consistency */}
                            <Link
                              to={link.href}
                              className={cn(
                                "nav-link tracking-wide transition-colors duration-300 font-benzin px-3 py-2",
                                scrolled ? "text-white" : "text-white",
                                location.pathname === link.href ? 'text-primary' : 'hover:text-primary' // Active/Hover color
                              )}
                              onClick={() => setOpenDropdownKey(null)} // Close dropdown on link click
                            >
                              <span>{link.title}</span>
                               {/* Removed the buggy conditional rendering */}
                               {/* {link.key === 'collaboration'} */}
                            </Link>
                           </li>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Language Selector and Contact Button */}
                <div className="flex items-center gap-4 ml-8"> {/* Add left margin for space */}
                  <LanguageSelector /> {/* Keep language selector */}

                  {/* Consultation Button */}
                  <Link
                    to="/contact" // Link to contact page
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium", // Primary button styling
                      "shadow-lg shadow-primary/20 transform transition hover:-translate-y-0.5 font-benzin" // Hover effect and font
                    )}
                     onClick={() => setOpenDropdownKey(null)} // Close dropdown on button click
                  >
                    <Phone className="h-4 w-4" />
                    {t('nav.consultation')}
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Sheet Menu Trigger */}
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
                 {/* Mobile Sheet Content */}
                <SheetContent
                  side="right"
                  className="p-0 w-[85vw] max-w-xs bg-[#080C16] text-white border-l border-white/10" // Dark theme styling
                >
                   {/* Sheet Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Link to="/" className="flex items-center" onClick={() => { setIsMenuOpen(false); setOpenDropdownKey(null); }}>
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
        </div>
      </header>

      {/* Padding div to prevent content from being hidden by fixed header */}
      {/* Adjust padding based on actual header height in initial and scrolled states */}
       <div style={{ paddingTop: scrolled ? `calc(${TEST_INDICATOR_HEIGHT}px + ${scrolledHeaderHeight}px)` : `calc(${TEST_INDICATOR_HEIGHT}px + ${initialHeaderHeight}px)` }}>
         {/* The rest of your page content goes here */}
       </div>
    </>
  );
};

export default NavBar;