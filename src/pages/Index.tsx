import React, { useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import { MapPin } from 'lucide-react';
import { usePartnerSeeder } from '@/hooks/use-partner-seeder';
import { useVacancySeeder } from '@/hooks/use-vacancy-seeder';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectsSection from '@/components/ProjectsSection';
import ProjectsShowcase from '@/components/ProjectsShowcase';

// Lazy load non-critical components for better initial load performance
const NewsVacanciesSection = lazy(() => import('@/components/NewsVacanciesSection'));
const PartnersShowcaseSection = lazy(() => import('@/components/PartnersShowcaseSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));
const ChatBot = lazy(() => import('@/components/ChatBot'));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="w-full py-16 bg-[#161616] animate-pulse">
    <div className="container mx-auto px-6">
      <div className="h-8 w-1/3 bg-gray-700 rounded mb-8 mx-auto"></div>
      <div className="h-16 w-2/3 bg-gray-700 rounded mb-8 mx-auto"></div>
      <div className="h-32 w-full bg-gray-800 rounded"></div>
    </div>
  </div>
);

// Track if the interaction observer has been initialized
let observerInitialized = false;

const Index: React.FC = () => {
  // Seed initial data for partners and vacancies (now with optimized checks)
  usePartnerSeeder();
  useVacancySeeder();
  
  // Add smooth scrolling animations and preload images
  useEffect(() => {
    // Skip if already initialized to prevent duplicate observers
    if (observerInitialized) return;
    
    // Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );
    
    // Observe all elements with scroll-animate-section class
    document.querySelectorAll('.scroll-animate-section').forEach((el) => {
      observer.observe(el);
    });
    
    observerInitialized = true;
    
    // More efficient image preloading
    const preloadCriticalImages = () => {
      const criticalImages = [
        "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
        "/lovable-uploads/f33c0024-7a3c-4110-864c-856ff30a1689.png"
      ];
      
      // Preload critical images sequentially to avoid overwhelming the browser
      let index = 0;
      const loadNextImage = () => {
        if (index < criticalImages.length) {
          const img = new Image();
          img.onload = loadNextImage;
          img.src = criticalImages[index++];
        }
      };
      
      loadNextImage();
    };
    
    // Start preloading critical images right away
    preloadCriticalImages();
    
    // Preload non-critical images after page load, when browser is idle
    const preloadNonCriticalImages = () => {
      if (document.visibilityState !== 'visible') return; // Don't preload when tab is not visible
      
      const nonCriticalImages = [
        "/assets/Pushkin/1.jpg",
        "/assets/Pushkin/2.jpg",
        "/assets/Pushkin/18.jpg"
      ];
      
      // Create preload link elements instead of new Image()
      // This gives the browser more control over priority
      nonCriticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };
    
    // Use requestIdleCallback for non-critical preloading when browser is idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadNonCriticalImages, { timeout: 2000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(preloadNonCriticalImages, 2000);
    }
    
    return () => {
      // Clean up observer
      if (observer) {
        document.querySelectorAll('.scroll-animate-section').forEach((el) => {
          observer.unobserve(el);
        });
        observerInitialized = false;
      }
    };
  }, []);

  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-foreground overflow-x-hidden">
      <Helmet>
        <title>TOWERUP | Лучший застройщик элитной недвижимости в Ташкенте</title>
        <meta name="description" content="TOWER UP - современный жилой комплекс премиум-класса в Ташкенте. Элитные квартиры с панорамными видами, высококачественной отделкой и подземным паркингом." />
        <meta name="keywords" content="towerup, TOWERUP, Tower Up, жилой комплекс, недвижимость Ташкент, элитная недвижимость, ЖК Пушкин" />
        <link rel="canonical" href="https://towerup.uz/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://towerup.uz/" />
        <meta property="og:title" content="TOWERUP | Лучший застройщик элитной недвижимости в Ташкенте" />
        <meta property="og:description" content="TOWER UP - современный жилой комплекс премиум-класса в Ташкенте. Элитные квартиры с панорамными видами и высококачественной отделкой." />
        <meta property="og:image" content="https://towerup.uz/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://towerup.uz/" />
        <meta property="twitter:title" content="TOWERUP | Лучший застройщик элитной недвижимости в Ташкенте" />
        <meta property="twitter:description" content="TOWER UP - современный жилой комплекс премиум-класса в Ташкенте. Элитные квартиры с панорамными видами и высококачественной отделкой." />
      </Helmet>

      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        
        {/* Project Showcase Section from admin panel */}
        <ProjectsShowcase />
        
        {/* Company Statistics Section */}
        <ProjectsSection />
               
        <Suspense fallback={<SectionSkeleton />}>
          <NewsVacanciesSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <PartnersShowcaseSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
        
        {/* Map Section with accessibility improvements */}
        <section id="map" className="py-16 bg-[#1a1a1a]" aria-label={t('home.map.title')}>
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-12 scroll-animate-section">
              <h2 className="text-4xl font-bold mb-4 text-center text-white">{t('home.map.title')}</h2>
              <div className="w-16 h-1 bg-brand-primary mb-6"></div>
              <p className="text-slate-300 text-lg max-w-2xl text-center mb-8">
                {t('home.map.subtitle')}
              </p>
              
              <div className="flex items-center mb-8">
                <MapPin className="w-6 h-6 text-brand-primary mr-2" aria-hidden="true" />
                <span className="text-lg font-medium text-slate-200">{t('home.map.address')}</span>
              </div>
            </div>
            
            <div className="w-full rounded-xl overflow-hidden shadow-xl scroll-animate-section border border-slate-700/30">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7976.879721623986!2d69.25872!3d41.240959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae61aaa924ee97%3A0x64bd413fa7c03f6d!2sTOWER%20UP!5e1!3m2!1sen!2sus!4v1742675836272!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TOWER UP Location"
                  className="w-full h-full"
                  aria-label="Интерактивная карта расположения TOWER UP"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Lazy-loaded footer and chat components */}
      <Suspense fallback={<div className="h-40 bg-[#101010]"></div>}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
