
import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumb, backgroundImage }) => {
  return (
    <div className={cn(
      "relative py-24 md:py-32 bg-cover bg-center bg-no-repeat isolate overflow-hidden",
      "before:absolute before:inset-0 before:bg-black/50 before:z-10"
    )}
    style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to right, rgba(22, 22, 22, 0.9), rgba(22, 22, 22, 0.8))' }}>
      <div className="container mx-auto px-6 relative z-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {breadcrumb && (
          <div className="text-white/80">
            <a href="/" className="hover:text-primary transition-colors">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-white">{breadcrumb}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
