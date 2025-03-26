
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
    <div className={cn("relative w-full h-[30vh] md:h-[40vh] overflow-hidden", className)}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Gray gradient overlay instead of dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 to-slate-900/90 z-10"></div>
      </div>
      
      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#1a1a1a" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center tracking-wider">{title}</h1>
        
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
