
import { Building, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <a
      href={slug ? `/projects/${slug}` : '#'}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm",
        "transform transition-all duration-500 hover:scale-[1.02]",
        "h-[400px] lg:h-[500px]"
      )}
      style={{
        animationDelay: `${index * 150}ms`
      }}
    >
      {/* Background Image with Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 transition-opacity group-hover:opacity-85" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Building className="mr-1 h-3 w-3" />
          {status}
        </div>

        {/* Location Badge */}
        <div className="mb-4 ml-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <MapPin className="mr-1 h-3 w-3" />
          {location}
        </div>

        {/* Title and Description */}
        <h3 className="mb-2 text-2xl font-bold text-white transition-transform duration-300 ease-out group-hover:translate-x-2">
          {title}
        </h3>
        <p className="max-w-lg text-sm text-gray-300 transition-transform duration-300 ease-out group-hover:translate-x-2">
          {description}
        </p>

        {/* Call to action */}
        <div className="mt-4 inline-flex items-center text-primary transition-transform duration-300 ease-out group-hover:translate-x-2">
          <span className="text-sm font-medium">Узнать больше</span>
          <svg
            className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default ProjectFeatureCard;
