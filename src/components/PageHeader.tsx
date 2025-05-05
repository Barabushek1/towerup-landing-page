
import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string; // Add optional subtitle prop
  imageSrc?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, // Include subtitle in props
  imageSrc, 
  className 
}) => {
  return (
    <div className={cn(
      "relative bg-slate-900 py-24 flex items-center",
      className
    )}>
      {imageSrc && (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/50" />
        </div>
      )}
      
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-benzin font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
