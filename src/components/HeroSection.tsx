
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
      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-60"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-down opacity-0" style={{ animationDelay: '300ms' }}>
            Innovative Solutions
          </span>
          
          <h1 className="font-display font-medium text-5xl sm:text-6xl md:text-7xl leading-tight mb-6 animate-slide-up opacity-0" style={{ animationDelay: '500ms' }}>
            Creating the future <br/>
            <span className="text-primary">together</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up opacity-0" style={{ animationDelay: '700ms' }}>
            We combine innovative technology and human expertise to solve complex problems and build sustainable solutions for a better tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up opacity-0" style={{ animationDelay: '900ms' }}>
            <a
              href="#contact"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium",
                "shadow-lg shadow-primary/20 transform transition hover:-translate-y-0.5"
              )}
            >
              Get Started
            </a>
            <a
              href="#about"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-white text-foreground font-medium",
                "shadow border border-gray-200 transform transition hover:-translate-y-0.5"
              )}
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <a 
        href="#about" 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-foreground/60 hover:text-foreground transition-colors duration-300 animate-pulse-slow"
        aria-label="Scroll down"
      >
        <span className="text-sm mb-2">Scroll</span>
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
};

export default HeroSection;
