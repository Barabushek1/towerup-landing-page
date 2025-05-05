
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

  const images = [
    '/lovable-uploads/36f32494-e938-41ca-815a-e71e74b2e791.png',
    '/lovable-uploads/b0a81c01-4a79-4eaa-86da-7501517139b7.png',
    '/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png',
    '/lovable-uploads/1a71108b-2bfd-43b5-be89-cf6eb56cf58c.png',
    '/lovable-uploads/01ec8090-c3b7-4770-b254-07c6f1ac1521.png',
    '/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png',
    '/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png',
    '/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png',
    '/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png',
    '/lovable-uploads/32c3e8f6-2da4-474c-904f-fd321d91e87e.png',
    '/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png',
    '/lovable-uploads/c2c35248-d734-4728-8780-204a498e2b4e.png'
  ];

  const openFullscreen = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  return (
    <section 
      id="gallery" 
      className="py-20 bg-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Image className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.gallery.title')}
          </h2>
          
          <p className="text-xl text-blue-600">
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
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
              onClick={() => openFullscreen(image)}
            >
              <img 
                src={image} 
                alt={`Yangi Uzbekistan Gallery ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Maximize2 className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 bg-black/90 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <button
              className="absolute left-4 p-2 text-white bg-black/50 rounded-full z-50"
              onClick={() => {
                if (selectedImage) {
                  const currentIndex = images.indexOf(selectedImage);
                  const prevIndex = (currentIndex - 1 + images.length) % images.length;
                  setSelectedImage(images[prevIndex]);
                }
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              className="absolute right-4 p-2 text-white bg-black/50 rounded-full z-50"
              onClick={() => {
                if (selectedImage) {
                  const currentIndex = images.indexOf(selectedImage);
                  const nextIndex = (currentIndex + 1) % images.length;
                  setSelectedImage(images[nextIndex]);
                }
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Fullscreen view" 
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
