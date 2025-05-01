import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight, Building, MapPin, ExternalLink, ArrowLeft, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- ProjectCard Component ---
interface ProjectCardProps {
    title: string;
    description: string;
    location: string;
    status: string;
    imageUrl?: string;
    index: number;
    slug?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    description,
    location,
    status,
    imageUrl,
    index,
    slug
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const handleTouchStart = () => {
        setIsTouched(!isTouched);
    };

    const cardContent = (
        <div ref={cardRef} className={cn("scroll-animate-section relative group overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer", "bg-brand-dark border border-brand-dark/10 shadow-sm h-[350px] md:h-[400px]")} style={{
            transitionDelay: `${index * 100}ms`
        }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onTouchStart={handleTouchStart}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>

            <div className={cn("absolute inset-0 bg-gray-200 transition-transform duration-700 ease-in-out", isHovered || isTouched ? "scale-105" : "scale-100")} style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}></div>

            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium font-benzin">
                {status}
            </div>

            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm font-benzin flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
            </div>

            <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-20">
                <h3 className={cn("text-xl md:text-2xl font-medium text-white mb-2 transform transition-transform duration-300 font-benzin", isHovered || isTouched ? "translate-y-0" : "translate-y-0")}>
                {title}
                </h3>

                <p className={cn("text-white/80 mb-4 transform transition-all duration-300 ease-in-out max-h-0 overflow-hidden opacity-0 font-benzin text-sm md:text-base", isHovered || isTouched ? "max-h-[200px] opacity-100" : "")}>
                {description}
                </p>

                <div className={cn("flex items-center transform transition-all duration-300", isHovered || isTouched ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                <span className="text-white/90 text-sm font-medium mr-2 font-benzin">Подробнее</span>
                <ChevronRight className="h-4 w-4 text-white/90" />
                </div>
            </div>
        </div>
    );

    return slug ? (
        <a href={`/projects/${slug}`} aria-label={`View project ${title}`}>
            {cardContent}
        </a>
    ) : (
        cardContent
    );
};


// --- FeaturedProject Component ---
const FeaturedProject: React.FC<{
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    index: number;
    slug?: string;
}> = ({
    title,
    subtitle,
    description,
    imageUrl,
    index,
    slug
}) => {
        return (
            <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{
                    backgroundImage: `url(${imageUrl})`
                }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
                    <div className="max-w-2xl">
                        <div className="inline-block mb-4">
                            <span className="text-primary text-sm font-medium tracking-wider uppercase font-benzin">{subtitle}</span>
                            <div className="h-[1px] w-full bg-primary/50 mt-1"></div>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-benzin">{title}</h2>

                        <p className="text-gray-300 mb-8 max-w-lg font-benzin">{description}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-white py-2 px-6">
                                <a href={slug ? `/projects/${slug}` : '/projects'}>
                                    ПОДРОБНЕЕ
                                </a>
                            </Button>
                            <Button asChild variant="outline" className="border-white/20 text-white py-2 px-6 bg-slate-900 hover:bg-slate-800">
                                <a href="/projects">
                                    ВСЕ ПРОЕКТЫ
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


// --- ProjectsSection Component ---
const ProjectsSection: React.FC = () => {
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
            }, 5000);
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
        }, { threshold: 0.1 });
        const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
        elementsToObserve?.forEach(el => observer.observe(el));
        return () => elementsToObserve?.forEach(el => el && observer.unobserve(el));
    }, []);

    const featuredProjects = [
        {
            title: 'Всё нужное — рядом',
            subtitle: 'ЖК «Кумарык»',
            description: "Совреенный жилой комплекс в престижном районе.",
            imageUrl: "https://i.pinimg.com/736x/0f/9c/50/0f9c50ad3c8927fd4b64f934cd3f40c8.jpg",
            slug: "pushkin"
        },
        {
            title: 'Удобный паркинг',
            subtitle: 'TOWERUP Проекты',
            description: "Безопасное и комфортное место для вашего автомобиля.",
            imageUrl: "https://i.pinimg.com/736x/41/bd/38/41bd38e601fd7d090e8015387c97c8d1.jpg",
        },
        {
            title: 'Ремонт под ключ',
            subtitle: 'TOWERUP Сервисы',
            description: "Готовые решения для вашего комфорта.",
            imageUrl: "https://i.pinimg.com/736x/41/ab/c6/41abc67a124ab2964986738014229398.jpg",
        }
    ];

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
            imageUrl: "https://images.unsplash.com/photo-1742330425089-1f91d18eaa4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            slug: "bochka"
        },
        {
            title: 'Жилой комплекс "Кумарык"',
            description: "Курортный комплекс из отеля 5* и апартаментов с панорамным видом на море и собственным пляжем.",
            location: "Ташкент",
            status: "Проектируется",
            imageUrl: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
            slug: "kumaryk"
        }
    ];

    return (
        <section id="projects" ref={sectionRef} className="py-0 bg-black overflow-hidden">
            <div className="relative scroll-animate-section">
                <Carousel setApi={setCarouselApi} opts={{ align: "start", loop: true }} className="w-full">
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
                        <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-white/10" onClick={() => carouselApi?.scrollPrev()} aria-label="Previous slide">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {featuredProjects.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"}`}
                                    onClick={() => carouselApi?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-white/10" onClick={() => carouselApi?.scrollNext()} aria-label="Next slide">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </Carousel>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden lg:flex flex-col items-center justify-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-300 cursor-pointer group">
                    <span className="text-xs font-medium uppercase tracking-wider">Наши Проекты</span>
                    <ArrowDown className="h-4 w-4 animate-bounce" />
                </div>
            </div>

            <div className="relative">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />
                
                {/* Animated dot pattern background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-full h-full" 
                         style={{
                             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                             backgroundSize: '32px 32px'
                         }} />
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
                                Наши Проекты
                            </span>
                            <h2 className="section-heading mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl font-bold text-white font-benzin">
                                Инновационные проекты, созданные для будущего
                            </h2>
                            <p className="section-subheading text-sm md:text-base text-gray-400 font-benzin">
                                Познакомьтесь с нашими знаковыми проектами, которые мы создаем с использованием современных технологий и бескомпромиссных стандартов качества.
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
                            <span className="group-hover:translate-x-1 transition-transform duration-300">Все проекты</span>
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
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ProjectCard {...project} index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
