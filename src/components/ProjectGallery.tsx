
import React, { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, X, ZoomIn } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectGalleryProps {
  images: {
    url: string;
    alt?: string;
  }[];
}

const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setLoadedImages(new Array(images.length).fill(false));
    
    // Add animation when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [images.length]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => {
      const newLoadedImages = [...prev];
      newLoadedImages[index] = true;
      return newLoadedImages;
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Preload all images for smoother gallery experience
  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => handleImageLoad(index);
    });
  }, [images]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="w-full"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <motion.div variants={itemVariants}>
                <Card className="border-0 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="flex aspect-square items-center justify-center p-1 overflow-hidden">
                    <div 
                      className="relative w-full h-full overflow-hidden rounded-md cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsDialogOpen(true);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                      {!loadedImages[index] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <motion.img
                        src={image.url}
                        alt={image.alt || `Project image ${index + 1}`}
                        className="h-full w-full object-cover rounded-md cursor-pointer"
                        style={{ opacity: loadedImages[index] ? 1 : 0 }}
                        onLoad={() => handleImageLoad(index)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <ZoomIn className="h-8 w-8 text-white" />
                          <span className="text-white bg-primary/80 px-3 py-1 rounded-full text-sm">Просмотреть</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Fullscreen Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black border-0 rounded-none flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-black/70 hover:bg-black/90 text-white"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-40 rounded-full bg-black/70 hover:bg-black/90 text-white"
              onClick={handlePrevImage}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].alt || `Project image ${currentImageIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-40 rounded-full bg-black/70 hover:bg-black/90 text-white"
              onClick={handleNextImage}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <motion.div 
              className="absolute bottom-4 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectGallery;
