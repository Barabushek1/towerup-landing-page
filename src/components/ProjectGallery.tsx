import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ProjectGalleryProps {
  projectId?: string; // Add this to accept the projectId prop
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projectId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mock image URLs for demonstration
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
  }, []);

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
  
  // You can now use projectId if needed for filtering images or other purposes
  // e.g., useEffect(() => { if(projectId) { // filter images } }, [projectId]);
  
  return (
    <div className="relative">
      {/* Gallery Preview */}
      <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={openModal}>
        <img
          src={images[currentImageIndex]}
          alt={`Project Gallery Image ${currentImageIndex + 1}`}
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

      {/* Image Modal */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center transition-opacity",
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeModal}
      >
        <div className="relative w-full max-w-5xl max-h-screen p-4">
          <img
            src={images[currentImageIndex]}
            alt={`Project Gallery Image ${currentImageIndex + 1}`}
            className="object-contain w-full h-full rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on image
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
