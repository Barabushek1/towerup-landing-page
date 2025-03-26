
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  bgImage?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  breadcrumb, 
  bgImage = "/lovable-uploads/588f4168-3957-47f6-b722-795cfc295ea7.png",
  className 
}) => {
  return (
    <div className={cn("relative w-full h-[40vh] md:h-[50vh] overflow-hidden", className)}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-darker/70 to-brand-darker/90 z-10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center tracking-wider">{title}</h1>
        
        {breadcrumb && (
          <div className="flex items-center space-x-2 text-sm md:text-base mt-4">
            <Link to="/" className="hover:text-primary transition-colors">ГЛАВНАЯ</Link>
            <span>/</span>
            <span>{breadcrumb}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
