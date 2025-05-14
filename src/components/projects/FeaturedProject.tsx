
import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '../ui/aspect-ratio';

interface FeaturedProjectProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  index: number;
  slug?: string;
}

const FeaturedProject = ({ title, subtitle, description, imageUrl, index, slug }: FeaturedProjectProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full h-[70vh] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={imageUrl} 
          alt={title}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/placeholder-project.jpg';
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-4 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-gray-300 mb-6">{description}</p>
          
          {slug && (
            <Link to={`/projects/${slug}`}>
              <Button className="group flex items-center gap-2 bg-primary hover:bg-primary/90">
                {t('featuredProject.viewProject')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;
