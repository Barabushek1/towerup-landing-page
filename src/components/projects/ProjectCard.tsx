
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  status: string;
  imageUrl: string;
  slug: string;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  location,
  status,
  imageUrl,
  slug,
  index = 0
}) => {
  // Ensure we have a valid slug for the link
  const projectLink = slug ? `/projects/${slug}` : '/projects';
  
  return (
    <div className="relative group overflow-hidden rounded-xl border border-slate-800/50 shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-slate-700/80 bg-zinc-900">
      {/* Image Background with error handling */}
      <div 
        className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        aria-hidden="true"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" aria-hidden="true"></div>

      {/* Status Badge */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
        <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium text-white sm:px-3 sm:py-1 sm:text-xs">
          {status}
        </span>
      </div>

      {/* Location Badge */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] backdrop-blur-sm text-white sm:px-3 sm:py-1 sm:text-xs">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {location}
        </span>
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
        {/* Title */}
        <h3 className="mb-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary md:text-xl">{title}</h3>
        
        {/* Description */}
        <p className="mb-3 line-clamp-2 text-xs text-gray-300 sm:text-sm">{description}</p>

        {/* Link Button */}
        <Link to={projectLink} className="inline-block">
          <button className="group/btn flex items-center text-sm font-medium text-white hover:text-primary transition-colors">
            Подробнее
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
