
import { Building, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProjectFeatureCardProps {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  status: string;
  index: number;
  slug?: string;
}

const ProjectFeatureCard = ({
  title,
  location,
  description,
  imageUrl,
  status,
  index,
  slug
}: ProjectFeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="h-full"
    >
      <a
        href={slug ? `/projects/${slug}` : '#'}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl h-full",
          "transform transition-all duration-700 ease-in-out hover:shadow-2xl hover:scale-[1.02]",
          "min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-black/10 to-black/30 backdrop-blur-sm"
        )}
      >
        {/* Background Image with 3D Parallax Effect */}
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 transition-opacity group-hover:opacity-75" />
          
          {/* Subtle Gradient Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/20 to-transparent opacity-50 mix-blend-overlay" />
        </div>

        {/* Content */}
        <div className="relative mt-auto p-6 lg:p-8 z-10 transition-all duration-500 group-hover:translate-y-[-8px]">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Building className="mr-1 h-3 w-3" />
              {status}
            </div>

            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" />
              {location}
            </div>
          </div>

          {/* Title with animated underline */}
          <h3 className="relative mb-3 text-2xl font-bold text-white">
            <span className="inline-block">
              {title}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </span>
          </h3>
          
          {/* Description */}
          <p className="max-w-lg text-sm text-gray-300 line-clamp-3 mb-4">
            {description}
          </p>

          {/* Call to action */}
          <div className="flex items-center text-primary opacity-90 transition-all duration-300 group-hover:opacity-100">
            <span className="text-sm font-semibold">Узнать больше</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-bl-full" />
        <div className="absolute top-6 right-6 h-2 w-2 rounded-full bg-white/70 opacity-0 transition-opacity delay-300 duration-500 group-hover:opacity-100" />
      </a>
    </motion.div>
  );
};

export default ProjectFeatureCard;
