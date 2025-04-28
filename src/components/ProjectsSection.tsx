
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Building } from 'lucide-react';
import ProjectFeatureCard from './ProjectFeatureCard';

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

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#161616] py-20 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className={cn(
          "mb-16 max-w-2xl transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Building className="mr-2 h-4 w-4" />
            Наши Проекты
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Создаем будущее<br />в настоящем
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Откройте для себя наши знаковые проекты, воплощающие инновации, комфорт и стиль
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={cn(
                "transition-all duration-1000 delay-[var(--delay)]",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              )}
              style={{ '--delay': `${index * 200}ms` } as React.CSSProperties}
            >
              <ProjectFeatureCard {...project} index={index} />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={cn(
          "mt-12 text-center transition-all duration-1000 delay-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <a
            href="/projects"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Все проекты
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
