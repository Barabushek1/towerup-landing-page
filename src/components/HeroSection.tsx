
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState(true);

  // Default hero images in case the DB doesn't have any
  const defaultHeroImages = [
    {
      id: '1',
      image_url: '/lovable-uploads/499747fd-cec7-42ad-a52d-b4a550043793.png',
      alt_text: 'TOWER UP современный жилой комплекс'
    },
    {
      id: '2',
      image_url: '/assets/Pushkin/18.jpg',
      alt_text: 'Современный архитектурный проект TOWER UP'
    },
    {
      id: '3',
      image_url: '/assets/Pushkin/1.jpg',
      alt_text: 'Инновационные решения TOWER UP'
    }
  ];

  useEffect(() => {
    // Fetch hero images from the database
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('id, image_url, alt_text')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
          
        if (error) {
          console.error('Error fetching hero images:', error);
          setHeroImages(defaultHeroImages);
          return;
        }
        
        if (data && data.length > 0) {
          setHeroImages(data);
        } else {
          setHeroImages(defaultHeroImages);
        }
      } catch (err) {
        console.error('Error loading hero images:', err);
        setHeroImages(defaultHeroImages);
      } finally {
        setIsImagesLoading(false);
      }
    };
    
    fetchHeroImages();
    
    // Auto-rotate images
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % (heroImages.length || defaultHeroImages.length));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Animation variants
  const textVariants = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const displayedImages = heroImages.length > 0 ? heroImages : defaultHeroImages;
  
  return (
    <section id="hero" className="relative h-screen min-h-[700px] max-h-[1080px] overflow-hidden">
      {/* Background images with parallax effect */}
      <div className="absolute inset-0 z-0">
        {displayedImages.map((image, index) => (
          <div 
            key={image.id} 
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 bg-black",
              index === activeIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <img 
              src={image.image_url} 
              alt={image.alt_text || "TOWER UP"} 
              className="object-cover w-full h-full opacity-70"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto h-full flex items-center relative z-10 px-6">
        <div className="max-w-3xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="space-y-8"
          >
            <motion.span 
              variants={textVariants}
              className="inline-block px-4 py-2 border border-primary/30 text-primary font-medium rounded-full mb-6"
            >
              {t('home.hero.badge')}
            </motion.span>
            
            <motion.h1 
              variants={textVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {t('home.hero.heading')}
            </motion.h1>
            
            <motion.p 
              variants={textVariants}
              className="text-lg md:text-xl text-gray-300 max-w-2xl"
            >
              {t('home.hero.subheading')}
            </motion.p>
            
            <motion.div variants={textVariants} className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/projects">
                  {t('home.hero.primaryCta')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-black/30 text-white hover:bg-white/10">
                <Link to="/contact">
                  {t('home.hero.secondaryCta')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Image navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {displayedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === activeIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white"
              )}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-12 right-12 z-10 hidden md:block"
      >
        <Link 
          to="#about" 
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
          aria-label="Scroll to About section"
        >
          <span className="text-sm mb-2">{t('home.hero.scrollDown')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="h-5 w-5 transform rotate-90" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
