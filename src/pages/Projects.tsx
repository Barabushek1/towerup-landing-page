
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { ArrowRight, Building, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Interface (No changes needed) ---
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

// --- ProjectCard Component (Updated to use anchor tags) ---
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
        // Added cn helper for cleaner conditional classes
        <div className={cn(
            "group relative overflow-hidden rounded-xl border border-slate-800/50 shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-slate-700/80",
            // Featured logic: Spans 2 cols ONLY on medium screens and up IF the parent grid is 2+ cols
            featured ? 'md:col-span-2' : ''
        )}>
            {/* Image Background */}
            <div
                className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden="true" // Decorative image
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" aria-hidden="true"></div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium text-white sm:px-3 sm:py-1 sm:text-xs">
                    {status}
                </span>
            </div>

            {/* Location Badge */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] backdrop-blur-sm text-white sm:px-3 sm:py-1 sm:text-xs">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {location}
                </span>
            </div>

             {/* Content Area with Responsive Adjustments */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
                {/* Type */}
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-primary sm:text-sm">{type}</div>
                {/* Title */}
                <h3 className="mb-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary md:text-xl lg:text-2xl">{title}</h3>
                {/* Description */}
                <p className="mb-3 line-clamp-2 text-xs text-gray-300 sm:text-sm md:line-clamp-2">{description}</p>

                {/* Stats Section */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 text-xs mb-4 items-start sm:items-center">
                    {completion && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            <span>{completion}</span>
                        </div>
                    )}
                </div>

                {/* Link Button */}
                <a href={`/projects/${slug}`} className="inline-block" tabIndex={-1}>
                    <Button variant="secondary" size="sm" className="group/btn bg-white/10 hover:bg-white/20 text-white border-none">
                        Подробнее
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

// --- Projects Component (Main Page) ---
const Projects: React.FC = () => {
    // Data - IMPORTANT: Replace placeholder image URLs with actual paths
    const projects = [
        {
            title: 'ЖК "Пушкин"',
            type: 'Жилой комплекс',
            description: 'Современный эко-комплекс из 5 домов с благоустроенной территорией, детскими площадками и парковой зоной.',
            location: 'Ташкент',
            imageUrl: '/assets/Pushkin/18.jpg', // Verify this path is correct
            status: 'Строится',
            completion: 'Q4 2025',
            slug: 'pushkin',
            featured: true // This project will span 2 columns on md+ screens
        },
        {
            title: 'ТРЦ "Бочка"',
            type: 'Торгово-развлекательный центр',
            description: 'Современный торгово-развлекательный центр с уникальной архитектурой и обширными торговыми площадями.',
            location: 'Ташкентская область',
            imageUrl: '/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png',
            status: 'Строится',
            completion: 'Q3 2025',
            slug: 'trcbochka',
            featured: true
        },
        {
            title: 'БЦ "Бочка"',
            type: 'Бизнес-центр',
            description: 'Современный бизнес-центр класса А с конференц-залами, подземным паркингом и зелёной зоной отдыха.',
            location: 'Ташкент',
            imageUrl: '/assets/Bochka/bochka_hero.jpg', // <<-- REPLACE WITH ACTUAL IMAGE PATH
            status: 'Строится',
            completion: 'Q2 2026',
            slug: 'bochka',
            featured: false
        },
        {
            title: 'ЖК "Кумарык"',
            type: 'Жилой комплекс',
            description: 'Курортный комплекс из отеля 5* и апартаментов с панорамным видом на море и собственным пляжем.',
            location: 'Иссык-Куль', // Example Location
            imageUrl: '/assets/Kumaryk/kumaryk_exterior.jpg', // <<-- REPLACE WITH ACTUAL IMAGE PATH
            status: 'Проектируется',
            completion: 'Q3 2026',
            slug: 'kumaryk',
            featured: false
        }
        // Add more projects here as needed
    ];

    return (
        <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
            <NavBar />
            <main>
                {/* Page Header */}
                <PageHeader title="НАШИ ПРОЕКТЫ" breadcrumb="ПРОЕКТЫ" backgroundImage="/assets/Pushkin/17.jpg" /> {/* Verify path */}

                {/* Projects Section */}
                <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
                    <div className="container mx-auto px-4 sm:px-6"> {/* Adjusted padding */}
                        {/* Section Header */}
                        <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Выдающиеся проекты</h2>
                            <p className="text-slate-400 text-sm md:text-base">
                                Ознакомьтесь с нашими уникальными проектами, которые сочетают в себе высокое качество строительства,
                                современные технологии и продуманную инфраструктуру.
                            </p>
                        </div>

                        {/* Projects Grid with Responsive Gap */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            {projects.map((project) => (
                                <ProjectCard key={project.slug} {...project} /> // Using slug as key
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
