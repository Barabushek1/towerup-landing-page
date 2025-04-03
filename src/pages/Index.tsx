
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProjectsSection from '@/components/ProjectsSection';
import FloorPlansSection from '@/components/FloorPlansSection';
import NewsVacanciesSection from '@/components/NewsVacanciesSection';
import PartnersShowcaseSection from '@/components/PartnersShowcaseSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { MapPin } from 'lucide-react';
import { usePartnerSeeder } from '@/hooks/use-partner-seeder';
import { useVacancySeeder } from '@/hooks/use-vacancy-seeder';

const Index: React.FC = () => {
  // Seed initial data for partners and vacancies
  usePartnerSeeder();
  useVacancySeeder();
  
  // Add smooth scrolling animations and preload images
  useEffect(() => {
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
    
    // Preload images for better performance
    const imagesToPreload = [
      "/assets/Pushkin/1.jpg",
      "/assets/Pushkin/2.jpg",
      "/assets/Pushkin/3.jpg",
      "/assets/Pushkin/5.jpg",
      "/assets/Pushkin/6.jpg",
      "/assets/Pushkin/8.jpg",
      "/assets/Pushkin/9.jpg",
      "/assets/Pushkin/10.jpg",
      "/assets/Pushkin/11.jpg",
      "/assets/Pushkin/12.jpg",
      "/assets/Pushkin/13.jpg",
      "/assets/Pushkin/14.jpg",
      "/assets/Pushkin/15.jpg",
      "/assets/Pushkin/16.jpg",
      "/assets/Pushkin/17.jpg",
      "/assets/Pushkin/18.jpg",
      "/assets/Pushkin/20.jpg",
      "/assets/Pushkin/21.jpg",
      "/assets/Pushkin/22.jpg",
      "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    return () => {
      // Clean up observer
      document.querySelectorAll('.scroll-animate-section').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ProjectsSection />
        <FloorPlansSection />
        <NewsVacanciesSection />
        <PartnersShowcaseSection />
        <ContactSection />
        
        {/* Map Section */}
        <section id="map" className="py-16 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-12 scroll-animate-section">
              <h2 className="text-4xl font-bold mb-4 text-center text-white">Наше местоположение</h2>
              <div className="w-16 h-1 bg-brand-primary mb-6"></div>
              <p className="text-slate-300 text-lg max-w-2xl text-center mb-8">
                Мы находимся в центре Ташкента и всегда рады видеть вас в нашем офисе
              </p>
              
              <div className="flex items-center mb-8">
                <MapPin className="w-6 h-6 text-brand-primary mr-2" />
                <span className="text-lg font-medium text-slate-200">г. Ташкент, Узбекистан</span>
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
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
