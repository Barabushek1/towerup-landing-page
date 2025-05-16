
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fetchProjectsByType, fetchProjects, Project } from '@/utils/project-helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ChevronDown, Filter, SortAsc } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('all');
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [futureProjects, setFutureProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // First fetch all projects for the "All" tab
        const all = await fetchProjects();
        setAllProjects(sortProjects(all, sortOrder));
        
        // Then fetch projects by type
        const [completed, ongoing, future] = await Promise.all([
          fetchProjectsByType('Реализованные'),
          fetchProjectsByType('Строящиеся'),
          fetchProjectsByType('Будущие')
        ]);
        
        setCompletedProjects(sortProjects(completed, sortOrder));
        setOngoingProjects(sortProjects(ongoing, sortOrder));
        setFutureProjects(sortProjects(future, sortOrder));
        
        console.log("Projects fetched:", {
          all: all.length,
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
  }, [sortOrder]);
  
  // Function to sort projects based on sortOrder
  const sortProjects = (projects: Project[], order: string): Project[] => {
    return [...projects].sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (order === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (order === 'az') {
        return a.title.localeCompare(b.title);
      } else if (order === 'za') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  };
  
  const handleSortChange = (value: string) => {
    setSortOrder(value as 'newest' | 'oldest' | 'az' | 'za');
  };
  
  const renderProjectsDesktop = (projects: Project[]) => {
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
  
  const renderProjectsMobile = () => {
    const getCurrentProjects = () => {
      switch (activeTab) {
        case 'all':
          return allProjects;
        case 'completed':
          return completedProjects;
        case 'ongoing':
          return ongoingProjects;
        case 'future':
          return futureProjects;
        default:
          return allProjects;
      }
    };
    
    const projects = getCurrentProjects();
    
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    if (projects.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-lg text-gray-300">{t('projects.noProjects')}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {activeTab === 'all' && 'Все проекты'}
                  {activeTab === 'completed' && 'Реализованные проекты'}
                  {activeTab === 'ongoing' && 'Строящиеся проекты'}
                  {activeTab === 'future' && 'Будущие проекты'}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
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
          
          <div className="w-full">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="oldest">Сначала старые</SelectItem>
                <SelectItem value="az">По названию (А-Я)</SelectItem>
                <SelectItem value="za">По названию (Я-А)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
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
      </div>
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

            {isMobile ? (
              renderProjectsMobile()
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto text-xs sm:text-sm py-2">
                      <TabsTrigger value="all" className="px-2 sm:px-4">Все</TabsTrigger>
                      <TabsTrigger value="completed" className="px-2 sm:px-4">Реализованные</TabsTrigger>
                      <TabsTrigger value="ongoing" className="px-2 sm:px-4">Строящиеся</TabsTrigger>
                      <TabsTrigger value="future" className="px-2 sm:px-4">Будущие</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Select value={sortOrder} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Сортировать по" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Сначала новые</SelectItem>
                      <SelectItem value="oldest">Сначала старые</SelectItem>
                      <SelectItem value="az">По названию (А-Я)</SelectItem>
                      <SelectItem value="za">По названию (Я-А)</SelectItem>
                    </SelectContent>
                  </Select>
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
