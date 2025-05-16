
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  status: string;
  imageUrl: string;
  slug: string;
  index?: number;
  // Optional multilingual fields
  title_en?: string | null;
  title_ru?: string | null;
  title_uz?: string | null;
  description_en?: string | null;
  description_ru?: string | null;
  description_uz?: string | null;
  location_en?: string | null;
  location_ru?: string | null;
  location_uz?: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  location,
  status,
  imageUrl,
  slug,
  index = 0,
  // Multilingual fields
  title_en,
  title_ru,
  title_uz,
  description_en,
  description_ru,
  description_uz,
  location_en,
  location_ru,
  location_uz
}) => {
  const { language } = useLanguage();
  
  // Helper function to get the localized content
  const getLocalizedContent = (defaultValue: string, en?: string | null, ru?: string | null, uz?: string | null): string => {
    if (language === 'en' && en) return en;
    if (language === 'ru' && ru) return ru;
    if (language === 'uz' && uz) return uz;
    return defaultValue;
  };
  
  // Get localized values
  const localizedTitle = getLocalizedContent(title, title_en, title_ru, title_uz);
  const localizedDescription = getLocalizedContent(description, description_en, description_ru, description_uz);
  const localizedLocation = getLocalizedContent(location, location_en, location_ru, location_uz);
  
  // Ensure we have a valid slug for the link
  const projectLink = slug ? `/projects/${slug}` : '/projects';
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-[280px] md:h-[320px] rounded-xl overflow-hidden shadow-lg border border-slate-800/50 hover:border-primary/30 transition-all duration-300"
    >
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      
      {/* Status Badge */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-xs font-medium text-white md:px-3 md:py-1">
          {status}
        </span>
      </div>

      {/* Location Badge */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs backdrop-blur-sm md:px-3 md:py-1">
          <MapPin className="h-3 w-3" />
          {localizedLocation}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {localizedTitle}
        </h3>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {localizedDescription}
        </p>
        
        <Link 
          to={projectLink} 
          className="inline-flex items-center font-medium text-sm text-white group-hover:text-primary transition-colors"
        >
          <span>Подробнее</span>
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
