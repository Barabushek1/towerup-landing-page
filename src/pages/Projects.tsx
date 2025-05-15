
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fetchProjectsByType, Project } from '@/utils/project-helpers';
import { useLanguage } from '@/contexts/LanguageContext';

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

const Projects: React.FC = () => {
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
        
        console.log("Projects fetched:", {
          completed: completed.length,
          ongoing: ongoing.length,
          future: future.length
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  const renderProjects = (projects: Project[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (projects.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300">{t('projects.noProjects')}</p>
        </div>
      );
    }
    
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {projects.map((project, index) => (
          <motion.div key={project.id} variants={item}>
            <ProjectCard
              title={project.title}
              description={project.description}
              location={project.location}
              status={project.status}
              imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
              slug={project.url}
              index={index}
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
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        {/* Page Header */}
        <PageHeader title="НАШИ ПРОЕКТЫ" breadcrumb="ПРОЕКТЫ" backgroundImage="/assets/Pushkin/17.jpg" />

        {/* Projects Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('projects.heading')}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                {t('projects.subheading')}
              </p>
            </div>

            <Tabs defaultValue="completed" value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Improved TabsList for better mobile display */}
              <div className="flex justify-center w-full mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto text-xs sm:text-sm py-2">
                  <TabsTrigger value="completed" className="px-2 sm:px-4">Реализованные</TabsTrigger>
                  <TabsTrigger value="ongoing" className="px-2 sm:px-4">Строящиеся</TabsTrigger>
                  <TabsTrigger value="future" className="px-2 sm:px-4">Будущие</TabsTrigger>
                </TabsList>
              </div>
              
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
