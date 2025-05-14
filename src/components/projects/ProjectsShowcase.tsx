
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Project } from '@/utils/project-helpers';

const ProjectsShowcase: React.FC = () => {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        setProjects(data || []);
      } catch (err) {
        console.error('Unexpected error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to get localized field based on current language
  const getLocalizedField = (item: Project, field: string) => {
    const langField = `${field}_${language}` as keyof Project;
    return (item[langField] as string) || item[field as keyof Project] as string;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="projects-showcase" className="py-20 bg-[#161616] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 font-benzin backdrop-blur-sm">
            {t('projectsSection.sectionTitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-benzin">
            {t('projectsSection.sectionHeading')}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg font-benzin">
            {t('projectsSection.sectionDescription')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-10 bg-[#1a1a1a] rounded-xl">
            <p className="text-gray-400">{t('noProjectsAvailable')}</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.id} 
                className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 shadow-lg hover:shadow-primary/10"
                variants={itemVariants}
              >
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={project.image_url || '/placeholder.svg'} 
                      alt={getLocalizedField(project, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#111111]/70 backdrop-blur-sm text-xs text-primary font-medium px-3 py-1 rounded-full border border-primary/20">
                      {getLocalizedField(project, 'status')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white tracking-tight font-benzin group-hover:text-primary transition-colors">
                    {getLocalizedField(project, 'title')}
                  </h3>
                  <div className="flex items-center mb-4 text-gray-400">
                    <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{getLocalizedField(project, 'location')}</span>
                  </div>
                  <p className="text-gray-400 mb-5 line-clamp-3">
                    {getLocalizedField(project, 'description')}
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="group/btn mt-2 px-6 border-primary/40 text-primary hover:bg-primary hover:text-white font-benzin transition-all duration-300"
                  >
                    <a href={`/projects/${project.url}`}>
                      <span className="group-hover/btn:mr-2 transition-all duration-300">
                        {t('projectsSection.viewProject')}
                      </span>
                      <ArrowRight className="inline-block w-4 h-4 ml-1 opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            asChild
            className="group font-bold px-8 py-3 border-2 border-primary/40 text-primary hover:bg-primary hover:text-white font-benzin transition-all"
          >
            <a href="/projects">
              <span>{t('projectsSection.allProjects')}</span>
              <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
