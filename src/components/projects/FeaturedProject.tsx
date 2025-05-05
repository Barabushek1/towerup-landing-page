
import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeaturedProjectProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  index: number;
  slug?: string;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  index,
  slug
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url(${imageUrl})`
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <div className="inline-block mb-4">
            <span className="text-primary text-sm font-medium tracking-wider uppercase font-benzin">{subtitle}</span>
            <div className="h-[1px] w-full bg-primary/50 mt-1"></div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-benzin">{title}</h2>

          <p className="text-gray-300 mb-8 max-w-lg font-benzin">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white py-2 px-6">
              <a href={slug ? `/projects/${slug}` : '/projects'}>
                {t("projectsSection.learnMore").toUpperCase()}
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white py-2 px-6 bg-slate-900 hover:bg-slate-800">
              <a href="/projects">
                {t("projectsSection.allProjects").toUpperCase()}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;
