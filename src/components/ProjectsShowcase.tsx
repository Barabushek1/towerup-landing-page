
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, SortAsc, Filter, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchProjectsByType, Project, fetchProjects } from '@/utils/project-helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectCard from '@/components/projects/ProjectCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const ProjectsShowcase: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('all');
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [futureProjects, setFutureProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // Fetch all projects for the "All" tab
        const all = await fetchProjects();
        setAllProjects(sortProjects(all, sortOrder));
        
        // Fetch all three types of projects in parallel
        const [completed, ongoing, future] = await Promise.all([
          fetchProjectsByType('Реализованные'), 
          fetchProjectsByType('Строящиеся'), 
          fetchProjectsByType('Будущие')
        ]);
        setCompletedProjects(sortProjects(completed, sortOrder));
        setOngoingProjects(sortProjects(ongoing, sortOrder));
        setFutureProjects(sortProjects(future, sortOrder));
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [sortOrder]);

  // Function to sort projects based on sortOrder
  const sortProjects = (projects: Project[], order: 'newest' | 'oldest'): Project[] => {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

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
      transition: { duration: 0.5 }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const renderProjectsMobile = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSortOrder} 
            className="flex items-center gap-1 text-xs"
          >
            <SortAsc className="h-3.5 w-3.5 mr-1" /> 
            {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
          </Button>
        </div>

        <Collapsible className="w-full mb-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {activeTab === 'all' && 'Все проекты'}
                {activeTab === 'completed' && 'Реализованные проекты'}
                {activeTab === 'ongoing' && 'Строящиеся проекты'}
                {activeTab === 'future' && 'Будущие проекты'}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 border rounded-md p-1">
            <div className="flex flex-col gap-1 w-full">
              <Button 
                variant={activeTab === 'all' ? 'default' : 'ghost'} 
                className="justify-start" 
                onClick={() => setActiveTab('all')}
              >
                Все
              </Button>
              <Button 
                variant={activeTab === 'completed' ? 'default' : 'ghost'} 
                className="justify-start" 
                onClick={() => setActiveTab('completed')}
              >
                Реализованные
              </Button>
              <Button 
                variant={activeTab === 'ongoing' ? 'default' : 'ghost'} 
                className="justify-start" 
                onClick={() => setActiveTab('ongoing')}
              >
                Строящиеся
              </Button>
              <Button 
                variant={activeTab === 'future' ? 'default' : 'ghost'} 
                className="justify-start" 
                onClick={() => setActiveTab('future')}
              >
                Будущие
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <motion.div 
          className="grid grid-cols-1 gap-6" 
          variants={container} 
          initial="hidden" 
          animate="visible"
        >
          {activeTab === 'all' && allProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard 
                title={project.title}
                description={project.description}
                location={project.location}
                status={project.status}
                imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
                slug={project.url}
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

          {activeTab === 'completed' && completedProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard 
                title={project.title}
                description={project.description}
                location={project.location}
                status={project.status}
                imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
                slug={project.url}
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
          
          {activeTab === 'ongoing' && ongoingProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard 
                title={project.title}
                description={project.description}
                location={project.location}
                status={project.status}
                imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
                slug={project.url}
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
          
          {activeTab === 'future' && futureProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard 
                title={project.title}
                description={project.description}
                location={project.location}
                status={project.status}
                imageUrl={project.image_url || '/assets/placeholder-project.jpg'}
                slug={project.url}
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
      </div>
    );
  };

  const renderProjectsDesktop = (projects: Project[]) => {
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
              slug={project.url}
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
        </div>
        
        {isMobile ? (
          renderProjectsMobile()
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto text-xs sm:text-sm py-2">
                  <TabsTrigger value="all" className="px-2 sm:px-4">Все</TabsTrigger>
                  <TabsTrigger value="completed" className="px-2 sm:px-4">Реализованные</TabsTrigger>
                  <TabsTrigger value="ongoing" className="px-2 sm:px-4">Строящиеся</TabsTrigger>
                  <TabsTrigger value="future" className="px-2 sm:px-4">Будущие</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSortOrder} 
                className="hidden md:flex items-center gap-1"
              >
                <SortAsc className="h-4 w-4 mr-1" /> 
                {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
              </Button>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {renderProjectsDesktop(allProjects)}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {renderProjectsDesktop(completedProjects)}
            </TabsContent>
            
            <TabsContent value="ongoing" className="space-y-4">
              {renderProjectsDesktop(ongoingProjects)}
            </TabsContent>
            
            <TabsContent value="future" className="space-y-4">
              {renderProjectsDesktop(futureProjects)}
            </TabsContent>
          </>
        )}
        
        <div className="flex justify-center mt-10">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-white border border-primary/20 hover:bg-primary/20 transition-all duration-300">
            <span>Все проекты</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
