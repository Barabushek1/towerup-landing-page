
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchProjectsByType, Project } from '@/utils/project-helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectCard from '@/components/projects/ProjectCard';

const ProjectsShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('completed');
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [futureProjects, setFutureProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // Fetch all three types of projects in parallel
        const [completed, ongoing, future] = await Promise.all([
          fetchProjectsByType('Реализованные'),
          fetchProjectsByType('Строящиеся'),
          fetchProjectsByType('Будущие')
        ]);
        
        setCompletedProjects(completed);
        setOngoingProjects(ongoing);
        setFutureProjects(future);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const renderProjects = (projects: Project[]) => {
    if (loading) {
      return (
        <div className="col-span-3 flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    if (projects.length === 0) {
      return (
        <div className="col-span-3 text-center py-16">
          <p className="text-gray-400">Проекты не найдены</p>
        </div>
      );
    }
    
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project, index) => (
          <motion.div key={project.id} variants={item}>
            <ProjectCard
              title={project.title}
              description={project.description}
              location={project.location}
              status={project.status}
              imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
              link={project.url}
              title_en={project.title_en}
              title_ru={project.title_ru}
              title_uz={project.title_uz}
              description_en={project.description_en}
              description_ru={project.description_ru}
              description_uz={project.description_uz}
              location_en={project.location_en}
              location_ru={project.location_ru}
              location_uz={project.location_uz}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('projectsShowcase.title')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('projectsShowcase.heading')}
          </h2>
          <p className="text-gray-400">
            {t('projectsShowcase.description')}
          </p>
        </div>
        
        <Tabs defaultValue="completed" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 md:w-fit mx-auto">
            <TabsTrigger value="completed">Реализованные</TabsTrigger>
            <TabsTrigger value="ongoing">Строящиеся</TabsTrigger>
            <TabsTrigger value="future">Будущие</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completed" className="space-y-4">
            {renderProjects(completedProjects)}
          </TabsContent>
          
          <TabsContent value="ongoing" className="space-y-4">
            {renderProjects(ongoingProjects)}
          </TabsContent>
          
          <TabsContent value="future" className="space-y-4">
            {renderProjects(futureProjects)}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-10">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-primary/30 text-white">
            <span>Посмотреть все проекты</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
