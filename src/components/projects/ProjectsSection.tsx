
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, ArrowDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import ProjectCard from './ProjectCard';
import FeaturedProject from './FeaturedProject';
import { Project } from '@/types/project';

interface ProjectsSectionProps {
  customProjects?: Project[];
  loading?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ customProjects, loading = false }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (!carouselApi) return;
    
    const handleSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on('select', handleSelect);
    
    let autoplayInterval: NodeJS.Timeout | null = null;
    
    const startAutoplay = () => {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        carouselApi?.scrollNext();
      }, 4000);
    };
    
    const stopAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
    
    startAutoplay();
    
    const carouselElement = carouselApi.containerNode();
    carouselElement.addEventListener('mouseenter', stopAutoplay);
    carouselElement.addEventListener('mouseleave', startAutoplay);
    
    return () => {
      carouselApi.off('select', handleSelect);
      stopAutoplay();
      carouselElement.removeEventListener('mouseenter', stopAutoplay);
      carouselElement.removeEventListener('mouseleave', startAutoplay);
    };
  }, [carouselApi]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1
    });
    
    const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
    elementsToObserve?.forEach(el => observer.observe(el));
    
    return () => elementsToObserve?.forEach(el => el && observer.unobserve(el));
  }, []);
  
  const featuredProjects = [
    {
      title: t("projectsSection.featured.nearby.title"),
      subtitle: t("projectsSection.featured.nearby.subtitle"),
      description: t("projectsSection.featured.nearby.description"),
      imageUrl: "https://i.imgur.com/gvSrzzp.jpeg",
      slug: "pushkin"
    },
    {
      title: t("projectsSection.featured.parking.title"),
      subtitle: t("projectsSection.featured.parking.subtitle"),
      description: t("projectsSection.featured.parking.description"),
      imageUrl: "https://i.imgur.com/JHUJPdb.png"
    },
    {
      title: t("projectsSection.featured.turnkey.title"),
      subtitle: t("projectsSection.featured.turnkey.subtitle"),
      description: t("projectsSection.featured.turnkey.description"),
      imageUrl: "https://i.imgur.com/nTzlAUG.png"
    }
  ];
  
  // If custom projects are provided, use them; otherwise, use the default projects
  const projects = customProjects || [
    {
      id: '1',
      title: t("projectsSection.projects.pushkin.title"),
      description: t("projectsSection.projects.pushkin.description"),
      location: t("projectsSection.projects.pushkin.location"),
      status: t("projectsSection.projects.pushkin.status"),
      image_url: "/assets/Pushkin/18.jpg",
      url: "/projects/pushkin",
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      title: t("projectsSection.projects.newUzbekistan.title"),
      description: t("projectsSection.projects.newUzbekistan.description"),
      location: t("projectsSection.projects.newUzbekistan.location"),
      status: t("projectsSection.projects.newUzbekistan.status"),
      image_url: "/lovable-uploads/36f32494-e938-41ca-815a-e71e74b2e791.png",
      url: "/projects/new-uzbekistan",
      created_at: '',
      updated_at: ''
    },
    {
      id: '3',
      title: t("projectsSection.projects.kumaryk.title"),
      description: t("projectsSection.projects.kumaryk.description"),
      location: t("projectsSection.projects.kumaryk.location"),
      status: t("projectsSection.projects.kumaryk.status"),
      image_url: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
      url: "/projects/kumaryk",
      created_at: '',
      updated_at: ''
    }
  ];
  
  return (
    <section id="projects" ref={sectionRef} className="py-0 bg-black overflow-hidden">
      <div className="relative scroll-animate-section">
        <Carousel 
          setApi={setCarouselApi} 
          opts={{
            align: "start",
            loop: true
          }} 
          className="w-full"
        >
          <CarouselContent>
            {featuredProjects.map((project, index) => (
              <CarouselItem key={index} className="pl-0 w-full">
                <FeaturedProject 
                  title={project.title}
                  subtitle={project.subtitle}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  index={index}
                  slug={project.slug}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute left-8 md:left-16 lg:left-24 bottom-8 z-20 flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-white/10" 
              onClick={() => carouselApi?.scrollPrev()}
              aria-label={t("projectsSection.previousSlide")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              {featuredProjects.map((_, index) => (
                <button 
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"}`}
                  onClick={() => carouselApi?.scrollTo(index)}
                  aria-label={`${t("projectsSection.goToSlide")} ${index + 1}`}
                />
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-white/10" 
              onClick={() => carouselApi?.scrollNext()}
              aria-label={t("projectsSection.nextSlide")}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Carousel>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden lg:flex flex-col items-center justify-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-300 cursor-pointer group">
          <span className="text-xs font-medium uppercase tracking-wider">{t("projectsSection.ourProjects")}</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>

      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />
        
        {/* Animated dot pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-16 scroll-animate-section">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }} 
              className="max-w-2xl mb-8 lg:mb-0"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 font-benzin backdrop-blur-sm">
                {t("projectsSection.sectionTitle")}
              </span>
              <h2 className="section-heading mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl font-bold text-white font-benzin">
                {t("projectsSection.sectionHeading")}
              </h2>
              <p className="section-subheading text-sm md:text-base text-gray-400 font-benzin">
                {t("projectsSection.sectionDescription")}
              </p>
            </motion.div>

            <motion.a 
              href="/projects" 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.2 }} 
              className="group flex items-center bg-primary/10 hover:bg-primary text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-primary/20 hover:border-primary scroll-animate-section font-benzin"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-brand-secondary">
                {t("projectsSection.allProjects")}
              </span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.3 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {loading ? (
              <div className="col-span-3 flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : projects.map((project, index) => (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard 
                  title={project.title} 
                  description={project.description}
                  location={project.location}
                  status={project.status}
                  imageUrl={project.image_url}
                  index={index}
                  slug={project.url.split('/').pop()}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
