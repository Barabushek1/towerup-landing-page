
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-player', {
        videoId: 'E_MGF3SdLrg',
        playerVars: {
          autoplay: 1,
          loop: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          playlist: 'E_MGF3SdLrg',
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    };
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      // Clean up YouTube API
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-1000"
    >
      {/* YouTube Video Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-darker to-brand-dark opacity-80 z-10"></div>
          
          {/* YouTube player container */}
          <div className="absolute inset-0 w-full h-full">
            <div 
              id="youtube-player" 
              ref={playerRef}
              className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%]"
            ></div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-3xl opacity-10 animate-float z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl opacity-10 animate-float z-10" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-10 relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="font-benzin font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up opacity-0 text-white" style={{ animationDelay: '500ms' }}>
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
            <a
              href="#projects"
              className={cn(
                "button-hover-effect px-6 py-3 rounded-lg bg-white/10 text-white font-medium font-benzin w-full sm:w-auto text-center",
                "shadow border border-white/20 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
              )}
            >
              Проекты
              <Briefcase className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
