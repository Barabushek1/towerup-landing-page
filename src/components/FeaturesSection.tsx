
import React, { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Building,
  Users,
  Cpu,
  ShieldCheck,
  Clock,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const ParallaxCTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1
    });
    const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
    elementsToObserve?.forEach(el => observer.observe(el));

    // Parallax scroll effect with performance improvements
    const handleScroll = () => {
      if (!parallaxRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const scrollPosition = window.scrollY;
      const offset = scrollPosition * 0.4; // Adjust the parallax speed
      
      // Use transform for better performance (triggers compositor only)
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      elementsToObserve?.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <section 
    id="services" 
    ref={sectionRef} 
    className="py-24 md:py-40 bg-[#161616] overflow-hidden relative"
    aria-label={t("featuresSection.ariaLabel")}
  >
      {/* Parallax background with optimized image loading */}
      <div 
        ref={parallaxRef} 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1582782657732-df11b8ca99a9?q=80&w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: 'translateY(0px)'
        }}
        aria-hidden="true"
      />
      
      {/* Content with dark overlay for readability */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary font-medium mb-6 text-base">
            {t("featuresSection.subtitle")}
          </span>
          <h2 className="md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-brand-secondary text-4xl">
            {t("featuresSection.title")}
          </h2>
          
          {/* Show paragraph only on desktop/tablet */}
          {!isMobile && <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t("featuresSection.description")}
            </p>}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" 
              className={cn("button-hover-effect px-8 py-4 rounded-lg bg-brand-primary text-white font-medium text-base", "shadow-lg shadow-brand-primary/30 flex items-center justify-center")}
              aria-label={t("featuresSection.contactAriaLabel")}
            >
              <span>{t("featuresSection.contactUs")}</span>
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </a>
            <Link 
              to="/projects" 
              className={cn("button-hover-effect px-8 py-4 rounded-lg bg-white/10 text-white font-medium text-base", "shadow-lg border border-white/20 flex items-center justify-center backdrop-blur-sm")}
              aria-label={t("featuresSection.projectsAriaLabel")}
            >
              <span>{t("featuresSection.ourProjects")}</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#161616] to-transparent z-10" aria-hidden="true"></div>
    </section>;
};

export default ParallaxCTASection;
