
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (propImages && propImages.length > 0) {
      setImages(propImages);
      setIsLoading(false);
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
      setIsLoading(false);
    }
  }, [propImages]);

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCurrentImageUrl = () => {
    if (images.length === 0 || currentImageIndex >= images.length) {
      return "/placeholder.svg"; // Fallback image
    }
    
    const currentImage = images[currentImageIndex];
    return typeof currentImage === 'string' ? currentImage : currentImage.url;
  };

  const getCurrentImageAlt = () => {
    if (images.length === 0 || currentImageIndex >= images.length) {
      return "Gallery placeholder image";
    }
    
    return typeof images[currentImageIndex] === 'string' 
      ? `Project Gallery Image ${currentImageIndex + 1}` 
      : (images[currentImageIndex] as ProjectImage).alt;
  };

  if (isLoading) {
    return (
      <div className="relative h-64 md:h-96 bg-slate-800 animate-pulse rounded-lg"></div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-64 md:h-96 bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={openModal}>
        <img
          src={getCurrentImageUrl()}
          alt={getCurrentImageAlt()}
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
            alt={getCurrentImageAlt()}
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
