
import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-darker to-brand-dark opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-medium mb-6 animate-slide-down opacity-0" style={{ animationDelay: '300ms' }}>
            Инновационные решения
          </span>
          
          <h1 className="font-display font-medium text-5xl sm:text-6xl md:text-7xl leading-tight mb-6 animate-slide-up opacity-0 text-white" style={{ animationDelay: '500ms' }}>
            Создаём будущее <br/>
            <span className="text-brand-primary">вместе</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up opacity-0" style={{ animationDelay: '700ms' }}>
            Мы объединяем инновационные технологии и человеческий опыт для решения сложных задач и создания устойчивых решений для лучшего завтра.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up opacity-0" style={{ animationDelay: '900ms' }}>
            <a
              href="#contact"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-brand-primary text-white font-medium",
                "shadow-lg shadow-brand-primary/20 transform transition hover:-translate-y-0.5"
              )}
            >
              Начать сейчас
            </a>
            <a
              href="#about"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-white/10 text-white font-medium",
                "shadow border border-white/20 transform transition hover:-translate-y-0.5"
              )}
            >
              Узнать больше
            </a>
          </div>
        </div>
      </div>
      
      {/* Improved scroll indicator */}
      <a 
        href="#about" 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-brand-primary transition-colors duration-300 group"
        aria-label="Scroll down"
      >
        <span className="text-sm font-medium mb-2 group-hover:text-brand-primary">Далее</span>
        <div className="w-10 h-10 rounded-full border-2 border-brand-primary/30 flex items-center justify-center group-hover:border-brand-primary transition-all duration-300 group-hover:translate-y-1">
          <ChevronDown className="h-5 w-5 text-brand-primary" />
        </div>
      </a>
    </section>
  );
};

export default HeroSection;
