import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  title: string;
  type: string;
  description: string;
  location: string;
  imageUrl: string;
  status: string;
  completion?: string;
  slug: string;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  type,
  description, 
  location, 
  imageUrl, 
  status,
  completion,
  slug,
  featured = false 
}) => {
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-brand-dark/10 shadow-lg transition-all duration-300 hover:shadow-xl ${featured ? 'md:col-span-2' : ''}`}>
      <div 
        className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>
      
      <div className="absolute top-4 left-4">
        <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
          {status}
        </span>
      </div>
      
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm text-white">
          <MapPin className="h-3 w-3" />
          {location}
        </span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="mb-2 text-sm font-medium text-primary">{type}</div>
        <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-200 md:text-base">{description}</p>
        
        <div className="mb-4 flex flex-wrap gap-4">
          {completion && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs">{completion}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4 text-primary" />
            <span className="text-xs">{type}</span>
          </div>
        </div>
        
        <Link to={`/projects/${slug}`}>
          <Button variant="secondary" className="group/btn">
            Подробнее
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'ЖК "Пушкин"',
      type: 'Жилой комплекс',
      description: 'Современный эко-комплекс из 5 домов с благоустроенной территорией, детскими площадками и парковой зоной.',
      location: 'Ташкент',
      imageUrl: '/assets/Pushkin/18.jpg',
      status: 'Строится',
      completion: 'Q4 2025',
      slug: 'pushkin',
      featured: true
    },
    {
      title: 'БЦ "Бочка"',
      type: 'Бизнес-центр',
      description: 'Современный бизнес-центр класса А с конференц-залами, подземным паркингом и зелёной зоной отдыха.',
      location: 'Ташкент',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop',
      status: 'Строится',
      completion: 'Q2 2026',
      slug: 'bochka',
      featured: false
    },
    {
      title: 'ЖК "Кумарык"',
      type: 'Жилой комплекс',
      description: 'Курортный комплекс из отеля 5* и апартаментов с панорамным видом на море и собственным пляжем.',
      location: 'Иссык-Куль',
      imageUrl: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=1170&auto=format&fit=crop',
      status: 'Проектируется',
      completion: 'Q3 2026',
      slug: 'kumaryk',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader title="НАШИ ПРОЕКТЫ" breadcrumb="ПРОЕКТЫ" backgroundImage="/assets/Pushkin/17.jpg" />
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-200">Выдающиеся проекты</h2>
              <p className="text-slate-400 max-w-2xl mx-auto"> Ознакомьтесь с нашими уникальными проектами, которые сочетают в себе высокое качество строительства,
                современные технологии и продуманную </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
