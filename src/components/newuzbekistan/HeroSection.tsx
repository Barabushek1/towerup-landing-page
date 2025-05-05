import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
const HeroSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  // Keep your specific hero images here for this component
  const images = ['/lovable-uploads/36f32494-e938-41ca-815a-e71e74b2e791.png', '/lovable-uploads/b0a81c01-4a79-4eaa-86da-7501515139b7.png',
  // Ensure path is correct
  '/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png'];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => prev === images.length - 1 ? 0 : prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  return <section className="relative w-full h-screen max-h-[800px] overflow-hidden bg-[#161616]"> {/* Added fallback dark background */}
      {/* Background Slideshow */}
      {images.map((src, index) => <motion.div key={src} className="absolute inset-0 w-full h-full" initial={{
      opacity: 0
    }} animate={{
      opacity: activeSlide === index ? 1 : 0,
      scale: activeSlide === index ? 1 : 1.1 // Keep the scale effect
    }} transition={{
      opacity: {
        duration: 1.5
      },
      scale: {
        duration: 8
      } // Keep the scale transition duration
    }}>
          <img src={src} alt={`Yangi Uzbekistan Hero Slide ${index + 1}`} // Added alt text
      className="w-full h-full object-cover" />
        </motion.div>)}

      {/* Overlay with dark theme gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#161616]/80 via-[#161616]/60 to-transparent z-10"></div> {/* Darker overlay */}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 text-white"> {/* Added text color */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.1
        }} className="mb-6">
            <span className="inline-block px-4 py-1 bg-primary text-white rounded-full text-sm font-medium shadow-md"> {/* Primary accent background */}
              TOWER UP PRESENTS
            </span>
          </motion.div>

          <motion.h1 className="text-4xl md:text-6xl font-bold mb-4 text-white" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }}>
            {t('newUzbekistan.hero.title')}
          </motion.h1>

          <motion.p className="text-xl md:text-2xl mb-6 text-primary" // Primary accent color
        initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }}>
            {t('newUzbekistan.hero.subtitle')}
          </motion.p>

          <motion.p className="text-lg mb-8 text-white/80 max-w-3xl mx-auto" // Adjusted text color
        initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }}>
            {t('newUzbekistan.hero.description')}
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.5
        }} className="flex flex-col sm:flex-row gap-4 justify-center">
            

            
          </motion.div>
        </motion.div>
      </div>

      {/* Slideshow Indicators - Restyle for dark theme */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {images.map((_, index) => <button key={index} onClick={() => setActiveSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === index ? 'bg-primary scale-100' : 'bg-white/50 scale-75' // Primary active state
      }`} aria-label={`Go to slide ${index + 1}`} // Added aria label
      />)}
      </div>
    </section>;
};
export default HeroSection;