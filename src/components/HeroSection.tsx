import React, { useEffect, useRef } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedBackground from './AnimatedBackground';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-1000"
    >
      {/* Modern City Skyline Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Light overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
          
          {/* Background image */}
          <img 
            src="/lovable-uploads/499747fd-cec7-42ad-a52d-b4a550043793.png"
            alt="Modern Glass Buildings" 
            className="absolute w-full h-full object-cover object-center"
          />
        </div>
      </div>
      
      {/* Animated background elements with reduced opacity */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-3xl opacity-10 animate-float z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl opacity-10 animate-float z-10" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-10 relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="font-benzin font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up opacity-0 text-white" style={{ animationDelay: '500ms', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Надёжность и комфорт <br/>
            <span className="text-brand-primary">в каждом проекте!</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up opacity-0 w-full sm:w-auto justify-center" style={{ animationDelay: '900ms' }}>
            <a
              href="#about"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-brand-primary text-white font-medium font-benzin w-full sm:w-auto text-center",
                "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
              )}
            >
              Узнать подробнее
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/projects"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-white/20 text-white font-medium font-benzin w-full sm:w-auto text-center",
                "shadow backdrop-blur-sm border border-white/30 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
              )}
            >
              Проекты
              <Briefcase className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
