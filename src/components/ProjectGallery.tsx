
import React, { useState } from 'react';
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
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectGalleryProps {
  images: {
    url: string;
    alt?: string;
  }[];
}

const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Dialog open={isDialogOpen && currentImageIndex === index} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) setCurrentImageIndex(index);
              }}>
                <DialogTrigger asChild>
                  <Card className="border-0">
                    <CardContent className="flex aspect-square items-center justify-center p-1">
                      <img
                        src={image.url}
                        alt={image.alt || `Project image ${index + 1}`}
                        className="h-full w-full object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] h-[90vh] p-0 bg-black/80 border-0">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-50 rounded-full bg-black/40 hover:bg-black/60 text-white"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 z-40 rounded-full bg-black/40 hover:bg-black/60 text-white"
                      onClick={handlePrevImage}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <img
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].alt || `Project image ${currentImageIndex + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 z-40 rounded-full bg-black/40 hover:bg-black/60 text-white"
                      onClick={handleNextImage}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="bg-black/50 rounded-full px-4 py-1.5 text-white text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default ProjectGallery;
