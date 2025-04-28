
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Building, ArrowRight } from 'lucide-react';
import ProjectFeatureCard from './ProjectFeatureCard';
import { motion } from 'framer-motion';

const ProjectsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const projects = [
    {
      title: 'Жилой комплекс "Пушкин"',
      description: "Современный эко-комплекс из 5 домов с благоустроенной территорией, детскими площадками и парковой зоной.",
      location: "Ташкент",
      status: "Строится",
      imageUrl: "/assets/Pushkin/18.jpg",
      slug: "pushkin"
    },
    {
      title: 'Бизнес-центр "Бочка"',
      description: "Современный бизнес-центр класса А с конференц-залами, подземным паркингом и зелёной зоной отдыха.",
      location: "Ташкент",
      status: "Строится",
      imageUrl: "/assets/Pushkin/20.jpg",
      slug: "bochka"
    },
    {
      title: 'Жилой комплекс "Кумарык"',
      description: "Курортный комплекс из отеля 5* и апартаментов с панорамным видом на море и собственным пляжем.",
      location: "Ташкент",
      status: "Проектируется",
      imageUrl: "/assets/Pushkin/21.jpg",
      slug: "kumaryk"
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden py-20 lg:py-32"
      style={{
        background: 'linear-gradient(to bottom, #161616, #0c0c0c)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', 
            backgroundSize: '30px 30px' 
          }}>
        </div>

        {/* Background Blobs */}
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Building className="mr-2 h-4 w-4" />
            Наши Проекты
          </div>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Создаем будущее<br className="hidden md:block" /> в настоящем
          </h2>
          <p className="mt-6 text-lg text-gray-400 leading-relaxed">
            Откройте для себя наши знаковые проекты, воплощающие инновации, комфорт и стиль
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div key={project.slug} className="h-full">
              <ProjectFeatureCard {...project} index={index} />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            <span>Все проекты</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
