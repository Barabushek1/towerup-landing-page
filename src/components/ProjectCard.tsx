
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  status: string;
  imageUrl: string;
  link: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  location,
  status,
  imageUrl,
  link,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleTouchStart = () => {
    setIsTouched(!isTouched);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative group overflow-hidden rounded-xl transition-all duration-500 cursor-pointer",
        "bg-brand-dark border border-white/5 shadow-lg h-[300px] md:h-[350px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>
      
      {/* Background image */}
      <div 
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-in-out",
          (isHovered || isTouched) ? "scale-110" : "scale-100"
        )}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Status badge */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
        {status}
      </div>

      {/* Location badge */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {location}
      </div>

      {/* Content */}
      <Link to={link} className="relative h-full flex flex-col justify-end p-6 z-20 block">
        <h3 className="text-xl font-medium text-white mb-2 font-benzin">
          {title}
        </h3>

        <p className={cn(
          "text-white/80 mb-4 transition-all duration-300 ease-in-out max-h-0 overflow-hidden opacity-0 font-benzin text-sm",
          (isHovered || isTouched) ? "max-h-[200px] opacity-100" : ""
        )}>
          {description}
        </p>

        <div className={cn(
          "flex items-center transform transition-all duration-300",
          (isHovered || isTouched) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <span className="text-white/90 text-sm font-medium mr-2">Подробнее</span>
          <ArrowRight className="h-4 w-4 text-white/90" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
