
import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Image, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

const GallerySection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

   // Keep your specific image list here for this component
  const images = [
    '/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png',
    '/lovable-uploads/01ec8090-c3b7-4770-b254-07c6f1ac1521.png',
    '/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png',
    '/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png',
    '/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png',
    '/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png',
    '/lovable-uploads/32c3e8f6-2da4-474c-904f-fd321d91e87e.png',
    '/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png'
  ];

  const openFullscreen = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  // Helper for navigating between images in fullscreen
  const navigateFullscreen = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    } else { // 'next'
      newIndex = (currentIndex + 1) % images.length;
    }
    setSelectedImage(images[newIndex]);
  };

  return (
    <section
      id="gallery"
      className="py-16 md:py-24 bg-[#161616]" // Dark background
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Use px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"> {/* Primary accent background */}
            <Image className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.gallery.title')}
          </h2>

          <p className="text-xl text-primary"> {/* Primary accent color */}
            {t('newUzbekistan.gallery.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.1 }}
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer border border-slate-700/50 hover:border-primary/30 transition-colors" // Added border, hover effect
              onClick={() => openFullscreen(image)}
            >
              <img
                src={image}
                alt={`Yangi Uzbekistan Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> {/* Darker overlay */}
                <Maximize2 className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Improved Dialog for gallery images */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button - made more visible and tap-friendly for mobile */}
            <button
              className="absolute top-4 right-4 p-3 text-white bg-black/70 rounded-full z-50 hover:bg-black/90 transition"
              onClick={() => setSelectedImage(null)}
              aria-label="Закрыть галерею"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons - enlarged for better mobile tapping */}
            <button
              className="absolute left-2 md:left-4 p-3 md:p-4 text-white bg-black/70 rounded-full z-50 hover:bg-black/90 transition"
              onClick={() => navigateFullscreen('prev')}
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            <button
              className="absolute right-2 md:right-4 p-3 md:p-4 text-white bg-black/70 rounded-full z-50 hover:bg-black/90 transition"
              onClick={() => navigateFullscreen('next')}
              aria-label="Следующее изображение"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Галерея Yangi Uzbekistan"
                className="max-w-full max-h-full object-contain p-2"
              />
            )}
            
            {/* Image counter for better UX */}
            {selectedImage && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {images.indexOf(selectedImage) + 1} / {images.length}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
