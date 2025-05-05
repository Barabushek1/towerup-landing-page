
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const images = [
    '/lovable-uploads/36f32494-e938-41ca-815a-e71e74b2e791.png',
    '/lovable-uploads/b0a81c01-4a79-4eaa-86da-7501517139b7.png',
    '/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-screen max-h-[800px] overflow-hidden">
      {/* Background Slideshow */}
      {images.map((src, index) => (
        <motion.div
          key={src}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: activeSlide === index ? 1 : 0,
            scale: activeSlide === index ? 1 : 1.1
          }}
          transition={{ 
            opacity: { duration: 1.5 },
            scale: { duration: 8 }
          }}
        >
          <img 
            src={src} 
            alt={`Yangi Uzbekistan ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      {/* Overlay with brand gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F2C]/80 to-[#1A1F2C]/60 z-10"></div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1 bg-[#9b87f5] text-white rounded-full text-sm font-medium">
              TOWER UP PRESENTS
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('newUzbekistan.hero.title')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-6 text-[#9b87f5]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('newUzbekistan.hero.subtitle')}
          </motion.p>
          
          <motion.p 
            className="text-lg mb-8 text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('newUzbekistan.hero.description')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white group"
              onClick={() => {
                document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('home.hero.button')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('newUzbekistan.contact.form.title')}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSlide === index ? 'bg-[#9b87f5] scale-100' : 'bg-white/50 scale-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
