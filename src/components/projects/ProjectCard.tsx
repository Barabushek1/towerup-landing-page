
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  status: string;
  imageUrl?: string;
  index: number;
  slug?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  location,
  status,
  imageUrl,
  index,
  slug
}) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  const handleTouchStart = () => {
    setIsTouched(!isTouched);
  };
  
  const cardContent = (
    <div 
      ref={cardRef} 
      className={cn(
        "scroll-animate-section relative group overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer", 
        "bg-brand-dark border border-brand-dark/10 shadow-sm h-[350px] md:h-[400px]"
      )} 
      style={{
        transitionDelay: `${index * 100}ms`
      }} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>

      <div 
        className={cn(
          "absolute inset-0 bg-gray-200 transition-transform duration-700 ease-in-out", 
          isHovered || isTouched ? "scale-105" : "scale-100"
        )} 
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium font-benzin">
        {status}
      </div>

      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm font-benzin flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {location}
      </div>

      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-20">
        <h3 className={cn(
          "text-xl md:text-2xl font-medium text-white mb-2 transform transition-transform duration-300 font-benzin", 
          isHovered || isTouched ? "translate-y-0" : "translate-y-0"
        )}>
          {title}
        </h3>

        <p className={cn(
          "text-white/80 mb-4 transform transition-all duration-300 ease-in-out max-h-0 overflow-hidden opacity-0 font-benzin text-sm md:text-base", 
          isHovered || isTouched ? "max-h-[200px] opacity-100" : ""
        )}>
          {description}
        </p>

        <div className={cn(
          "flex items-center transform transition-all duration-300", 
          isHovered || isTouched ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <span className="text-white/90 text-sm font-medium mr-2 font-benzin">{t("projectsSection.viewMore")}</span>
          <ChevronRight className="h-4 w-4 text-white/90" />
        </div>
      </div>
    </div>
  );
  
  return slug ? (
    <a href={`/projects/${slug}`} aria-label={`${t("projectsSection.viewProject")} ${title}`}>
      {cardContent}
    </a>
  ) : cardContent;
};

export default ProjectCard;
