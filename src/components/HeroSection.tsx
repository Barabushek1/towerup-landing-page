
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedBackground from './AnimatedBackground';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Define the images for the carousel
  const heroImages = [
    "https://i.postimg.cc/SQV9jGk2/003.jpg", // Original image
    "https://i.imgur.com/jQAr3bM.jpeg", // First additional image
    "https://i.imgur.com/3geqXON.jpeg", // Second additional image
  ];
  
  // Auto-rotate background images every 4 seconds
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Set up image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Preload images for smooth transitions
  useEffect(() => {
    heroImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-1000"
      aria-label={t('home.hero.ariaLabel')}
    >
      {/* Modern City Skyline Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Light overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
          
          {/* Image carousel with fade transition */}
          {heroImages.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`${t('home.hero.imageAlt')} ${index + 1}`} 
              className={cn(
                "absolute w-full h-full object-cover object-center transition-opacity duration-1000",
                currentImageIndex === index ? "opacity-100" : "opacity-0"
              )}
              loading={index === 0 ? "eager" : "lazy"} 
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          ))}
        </div>
      </div>
      
      {/* Animated background elements with reduced opacity */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-3xl opacity-10 animate-float z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl opacity-10 animate-float z-10" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-10 relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="font-benzin font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up opacity-0 text-white" style={{ animationDelay: '500ms', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {t('home.hero.title')} <br/>
            <span className="text-brand-primary">{t('home.hero.subtitle')}</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up opacity-0 w-full sm:w-auto justify-center" style={{ animationDelay: '900ms' }}>
            <a
              href="#about"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-brand-primary text-white font-medium font-benzin w-full sm:w-auto text-center",
                "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
              )}
              aria-label={t('home.hero.learnMoreAriaLabel')}
            >
              {t('home.hero.learnMore')}
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/projects"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-white/20 text-white font-medium font-benzin w-full sm:w-auto text-center",
                "shadow backdrop-blur-sm border border-white/30 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
              )}
              aria-label={t('home.hero.projectsAriaLabel')}
            >
              {t('home.hero.projects')}
              <Briefcase className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Optional: Image pagination indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {heroImages.map((_, index) => (
          <button 
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentImageIndex === index ? "bg-white w-4" : "bg-white/40"
            )}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`${t('home.hero.imageNavAriaLabel')} ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
