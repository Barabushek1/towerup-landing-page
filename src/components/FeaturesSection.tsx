import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
const ParallaxCTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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

    // Parallax scroll effect
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollPosition = window.scrollY;
      const offset = scrollPosition * 0.4; // Adjust the parallax speed
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      elementsToObserve?.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return <section id="services" ref={sectionRef} className="py-24 md:py-40 bg-[#161616] overflow-hidden relative">
      {/* Parallax background */}
      <div ref={parallaxRef} className="absolute inset-0 z-0" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1582782657732-df11b8ca99a9?q=80&w=2070&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      transform: 'translateY(0px)'
    }} />
      
      {/* Content with dark overlay for readability */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-medium mb-6">
            Строим будущее вместе
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">Реализуйте свои мечты с Tower Up</h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            От проектирования до сдачи объекта — мы обеспечиваем полный цикл строительных работ с гарантией качества и в срок
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className={cn("button-hover-effect px-8 py-4 rounded-lg bg-brand-primary text-white font-medium text-base", "shadow-lg shadow-brand-primary/30 flex items-center justify-center")}>
              <span>Связаться с нами</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#projects" className={cn("button-hover-effect px-8 py-4 rounded-lg bg-white/10 text-white font-medium text-base", "shadow-lg border border-white/20 flex items-center justify-center backdrop-blur-sm")}>
              <span>Наши проекты</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#161616] to-transparent z-10"></div>
    </section>;
};
export default ParallaxCTASection;