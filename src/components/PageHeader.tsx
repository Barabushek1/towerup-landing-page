
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  autoplay?: boolean;
  interval?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  breadcrumb, 
  backgroundImage, 
  backgroundImages = [],
  autoplay = false,
  interval = 4000
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = backgroundImages.length > 0 
    ? backgroundImages 
    : (backgroundImage ? [backgroundImage] : []);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, images.length, interval]);

  // Preload images to prevent flickering during transitions
  useEffect(() => {
    if (images.length > 0) {
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  return (
    <div className={cn(
      "relative py-24 md:py-32 bg-cover bg-center bg-no-repeat isolate overflow-hidden",
      "before:absolute before:inset-0 before:bg-black/50 before:z-10"
    )}>
      {images.length > 0 ? (
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <div 
              key={index}
              className={cn(
                "absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000",
                currentImageIndex === index ? "opacity-100" : "opacity-0"
              )}
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(to right, rgba(22, 22, 22, 0.9), rgba(22, 22, 22, 0.8))' }}
          aria-hidden="true"
        />
      )}
      
      <div className="container mx-auto px-6 relative z-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-white/80 mb-4">{subtitle}</p>}
        {breadcrumb && (
          <div className="text-white/80">
            <a href="/" className="hover:text-primary transition-colors">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-white">{breadcrumb}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
