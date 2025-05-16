
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building, SortAsc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchProjects, Project } from '@/utils/project-helpers';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        // Only show featured or active projects, limit to 3
        const filteredProjects = data
          .filter(project => project.is_featured || project.is_active)
          .sort((a, b) => sortOrder === 'newest' 
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          .slice(0, 3);
        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [sortOrder]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Helper function to get localized content based on current language
  const getLocalizedField = (project: Project, field: string, fallback: string): string => {
    const langField = `${field}_${language}` as keyof Project;
    return (project[langField] as string) || fallback;
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // If no projects, don't render the section
  if (projects.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('featuredProjects.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl">
              {t('featuredProjects.subtitle')}
            </p>
          </div>
          
          {!isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} 
              className="mt-4 md:mt-0 flex items-center gap-1"
            >
              <SortAsc className="h-4 w-4 mr-1" /> 
              {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
            </Button>
          )}
        </div>
        
        {isMobile && (
          <div className="mb-6">
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="oldest">Сначала старые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              className="group bg-[#212121] rounded-xl overflow-hidden border border-slate-800/50 shadow-lg transition-all hover:border-primary/30 hover:shadow-lg duration-300 hover:-translate-y-2"
              variants={item}
            >
              <AspectRatio ratio={16/9} className="bg-slate-800">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={getLocalizedField(project, 'title', project.title)} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/placeholder-project.jpg';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-800/80">
                    <Building className="h-12 w-12 text-slate-500" />
                  </div>
                )}
              </AspectRatio>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    {getLocalizedField(project, 'location', project.location)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {getLocalizedField(project, 'title', project.title)}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {getLocalizedField(project, 'description', project.description)}
                </p>
                
                <Link to={`/projects/${project.url}`} className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                  <span className="font-medium">
                    {t('featuredProjects.learnMore')}
                  </span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-10 text-center">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-white border border-primary/20 hover:bg-primary/20 transition-all duration-300"
          >
            <span>{t('featuredProjects.viewAll')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
