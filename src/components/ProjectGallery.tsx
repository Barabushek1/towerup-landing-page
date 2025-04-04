import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ProjectImage {
  url: string;
  alt: string;
}

interface ProjectGalleryProps {
  projectId?: string;
  images?: ProjectImage[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projectId, images: propImages }) => {
  const [images, setImages] = useState<string[] | ProjectImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (propImages && propImages.length > 0) {
      setImages(propImages);
    } else {
      const mockImages = [
        '/lovable-uploads/01.jpeg',
        '/lovable-uploads/02.jpeg',
        '/lovable-uploads/03.jpeg',
        '/lovable-uploads/04.jpeg',
        '/lovable-uploads/05.jpeg',
        '/lovable-uploads/06.jpeg',
        '/lovable-uploads/07.jpeg',
        '/lovable-uploads/08.jpeg',
        '/lovable-uploads/09.jpeg',
      ];
      setImages(mockImages);
    }
  }, [propImages]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCurrentImageUrl = () => {
    const currentImage = images[currentImageIndex];
    return typeof currentImage === 'string' ? currentImage : currentImage.url;
  };

  return (
    <div className="relative">
      <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={openModal}>
        <img
          src={getCurrentImageUrl()}
          alt={typeof images[currentImageIndex] === 'string' 
               ? `Project Gallery Image ${currentImageIndex + 1}` 
               : (images[currentImageIndex] as ProjectImage).alt}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded text-xs">
          {currentImageIndex + 1} / {images.length}
        </div>
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center transition-opacity",
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeModal}
      >
        <div className="relative w-full max-w-5xl max-h-screen p-4">
          <img
            src={getCurrentImageUrl()}
            alt={typeof images[currentImageIndex] === 'string' 
                 ? `Project Gallery Image ${currentImageIndex + 1}` 
                 : (images[currentImageIndex] as ProjectImage).alt}
            className="object-contain w-full h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
