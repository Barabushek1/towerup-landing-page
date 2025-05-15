
import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  src: string;
  alt: string;
}

const GallerySection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const galleryImages: GalleryImage[] = [
    { src: "/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png", alt: "Фасад здания" },
    { src: "/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png", alt: "Внутренний двор" },
    { src: "/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png", alt: "Входная группа" },
    { src: "/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png", alt: "Детская площадка" },
    { src: "https://i.imgur.com/PW2thZ0.png", alt: "Лобби" },
    { src: "https://i.imgur.com/O15CmEG.png", alt: "Пример отделки" },
  ];

  const openImage = (index: number) => {
    setSelectedImage(index);
    setIsImageOpen(true);
  };

  const navigateGallery = (direction: 'next' | 'prev') => {
    if (selectedImage === null) return;
    
    if (direction === 'next') {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    } else {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <>
      <section ref={ref} id="gallery" className="py-16 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Галерея</h2>
            <p className="text-xl text-primary mb-6">Фотографии жилого комплекса</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                className="cursor-pointer relative overflow-hidden rounded-xl group"
                onClick={() => openImage(index)}
              >
                <AspectRatio ratio={16/9} className="bg-slate-800">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">{image.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Full Screen Gallery Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-5xl p-0 border-slate-700 bg-black">
          <div className="relative">
            {selectedImage !== null && (
              <>
                <div className="relative aspect-video">
                  <img 
                    src={galleryImages[selectedImage].src} 
                    alt={galleryImages[selectedImage].alt} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setIsImageOpen(false)} 
                    className="rounded-full p-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={() => navigateGallery('prev')} 
                    className="rounded-full p-3 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={() => navigateGallery('next')} 
                    className="rounded-full p-3 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="inline-block px-4 py-2 bg-black/70 rounded-full text-white text-sm">
                    {selectedImage + 1} / {galleryImages.length}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GallerySection;
