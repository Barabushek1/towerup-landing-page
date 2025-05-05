
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
        <video 
          className="absolute min-w-full min-h-full object-cover opacity-60"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/lovable-uploads/fd0b85fc-caff-4e79-8acf-8c3e7ce81787.png" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#1A1F2C]"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 pt-32 md:pt-40 lg:pt-52 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-white leading-tight">
            {t('newUzbekistan.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-medium mb-6">
            {t('newUzbekistan.subtitle')}
          </p>
          
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            {t('newUzbekistan.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 gap-2 shadow-lg hover:shadow-primary/40">
              {t('newUzbekistan.buttons.learnMore')}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-colors duration-200">
              {t('newUzbekistan.buttons.showApartments')}
            </Button>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 cursor-pointer hidden sm:flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={() => {
            document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-sm mb-2">{t('common.scrollDown')}</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
