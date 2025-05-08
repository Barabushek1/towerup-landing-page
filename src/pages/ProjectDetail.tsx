import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { MapPin, Calendar, ArrowRight, Home, Building, Users, CheckCircle2, Image as ImageIcon, LayoutGrid, Map, School, Car, Percent, Paintbrush, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectGallery from '@/components/ProjectGallery';
import { motion } from 'framer-motion';
import FloorPlansSection from '@/components/FloorPlansSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ApartmentCalculator from '@/components/ApartmentCalculator';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  url: string;
  alt: string;
}
interface ProjectBenefit {
  icon: React.ElementType;
  title: string;
  description: string;
}
interface ProjectAdvantage {
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
}
interface ArchitectQuote {
  text: string;
  author: string;
}
interface IProject {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  location: string;
  yearBuilt: string;
  totalArea: string;
  floors: string;
  apartmentsCount: string;
  mainImage: string;
  logo?: string;
  status: string;
  features: string[];
  images: ProjectImage[];
  videoUrl?: string;
  keyBenefits?: ProjectBenefit[];
  architectQuote?: ArchitectQuote;
  hasFloorPlans: boolean;
  advantages?: ProjectAdvantage[];
}
const projectsData: Record<string, IProject> = {
  "pushkin": {
    id: "pushkin",
    title: "ЖК «Пушкин»",
    subtitle: "Жилой комплекс",
    tagline: "Гармония природы и современного комфорта в сердце города.",
    shortDescription: "Современный жилой комплекс в экологически чистом районе с прекрасным видом на город.",
    description: "Жилой комплекс «Пушкин» - это современный комплекс из двух 16-этажных домов в престижном районе города. Комплекс спроектирован с учетом современных требований к комфорту и безопасности. Здесь предусмотрены просторные квартиры различных планировок, подземный паркинг, охраняемая территория и развитая инфраструктура. Из окон верхних этажей открывается великолепный вид на город и гористую местность вдали.",
    location: "г. Ташкент, Сергелийский район",
    yearBuilt: "2022",
    totalArea: "24 000 м²",
    floors: "16",
    apartmentsCount: "160",
    mainImage: "/assets/Pushkin/1.jpg",
    logo: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
    status: "Строительство",
    keyBenefits: [{
      icon: Home,
      title: "Просторные планировки",
      description: "Функциональные квартиры с продуманным зонированием."
    }, {
      icon: MapPin,
      title: "Престижный район",
      description: "Развитая инфраструктура и удобная транспортная доступность."
    }, {
      icon: Users,
      title: "Благоустроенная территория",
      description: "Детские и спортивные площадки, зоны отдыха."
    }],
    architectQuote: {
      text: "Мы стремились создать не просто жилье, а пространство для жизни, где каждая деталь способствует комфорту и эстетическому удовольствию.",
      author: "А. Иванов, Главный архитектор"
    },
    features: ["Подземный паркинг", "Охраняемая территория", "Детская площадка", "Спортивная площадка", "Видеонаблюдение", "Консьерж-сервис", "Высококачественные материалы", "Современные технологии"],
    images: [{
      url: "/assets/Pushkin/1.jpg",
      alt: "ЖК Пушкин - Вид спереди"
    }, {
      url: "/assets/Pushkin/2.jpg",
      alt: "ЖК Пушкин - Внешний вид"
    }, {
      url: "/assets/Pushkin/3.jpg",
      alt: "ЖК Пушкин - Территория"
    }, {
      url: "/assets/Pushkin/5.jpg",
      alt: "ЖК Пушкин - Холл"
    }, {
      url: "/assets/Pushkin/6.jpg",
      alt: "ЖК Пушкин - Квартира"
    }, {
      url: "/assets/Pushkin/8.jpg",
      alt: "ЖК Пушкин - Фасад"
    }, {
      url: "/assets/Pushkin/9.jpg",
      alt: "ЖК Пушкин - Ночной вид"
    }, {
      url: "/assets/Pushkin/10.jpg",
      alt: "ЖК Пушкин - Вечерний вид"
    }, {
      url: "/assets/Pushkin/11.jpg",
      alt: "ЖК Пушкин - Вид сбоку"
    }, {
      url: "/assets/Pushkin/14.jpg",
      alt: "ЖК Пушкин - План территории"
    }],
    videoUrl: "https://www.youtube.com/embed/aBZMFKzGuoM",
    hasFloorPlans: true,
    advantages: [{
      icon: School,
      title: "Всё нужное - рядом",
      description: "Школа, детский сад, зеленая зона, детские площадки и поликлиника в шаговой доступности.",
      image: "https://i.imgur.com/Gpxq4xr.png"
    }, {
      icon: Car,
      title: "Удобный паркинг",
      description: "Многоуровневый надземный паркинг для жителей комплекса и их гостей.",
      image: "https://i.imgur.com/JHUJPdb.png"
    }, {
      icon: Percent,
      title: "Рассрочка 0% до 2-х лет",
      description: "Самые выгодные условия приобретения недвижимости в нашем комплексе.",
      image: "https://i.imgur.com/V4hFuba.png"
    }, {
      icon: Paintbrush,
      title: "Ремонт под ключ",
      description: "Возможность приобрести квартиру с полностью готовым ремонтом от застройщика.",
      image: "https://i.imgur.com/nTzlAUG.png"
    }]
  }
  // ... other projects defined similarly ...
};
const ProjectDetail: React.FC = () => {
  const {
    slug
  } = useParams<{
    slug?: string;
  }>();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [apartmentUnits, setApartmentUnits] = useState<any[]>([]);
  const [pricePerSqm, setPricePerSqm] = useState<number>(12000000); // Default 12 million sum

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      if (slug && projectsData[slug]) {
        setProject(projectsData[slug]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug]);

  // Fetch apartment units data from Supabase
  useEffect(() => {
    const fetchApartmentUnits = async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .order('floor_number', { ascending: false });
      
      if (error) {
        console.error("Error fetching apartment units:", error);
      } else if (data && data.length > 0) {
        setApartmentUnits(data);
        // Set default price per sqm from the first unit if available
        if (data[0]?.price_per_sqm) {
          setPricePerSqm(data[0].price_per_sqm);
        }
      }
    };

    fetchApartmentUnits();
  }, []);

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  const listVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  const getYouTubeId = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        const pathParts = urlObj.pathname.split('/');
        if (pathParts[1] === 'embed' && pathParts[2]) {
          return pathParts[2].split('?')[0];
        }
      }
    } catch (e) {
      console.error("Error parsing video URL:", url, e);
      return null;
    }
    return null;
  };
  const enhancedVideoUrl = useMemo(() => {
    const videoId = getYouTubeId(project?.videoUrl);
    if (videoId) {
      const params = new URLSearchParams({
        controls: '0',
        loop: '1',
        playlist: videoId,
        rel: '0',
        autoplay: '1',
        mute: '1',
        modestbranding: '1',
        vq: 'hd1080'
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    return project?.videoUrl;
  }, [project?.videoUrl]);
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>;
  }
  if (!project) {
    return <div className="min-h-screen bg-background flex flex-col text-foreground">
                <NavBar />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
                    <h2 className="text-3xl font-bold mb-4">Проект не найден</h2>
                    <p className="mb-6 text-muted-foreground max-w-md">
                        Извините, проект с запрашиваемым адресом не существует или еще не добавлен на сайт.
                    </p>
                    <Button asChild>
                        <Link to="/projects">Вернуться ко всем проектам</Link>
                    </Button>
                </div>
                <Footer />
            </div>;
  }
  return <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
            <NavBar />
            <main>
                <PageHeader title={project.title} breadcrumb={`ПРОЕКТЫ / ${project.title.toUpperCase()}`} backgroundImage={project.mainImage} />

                <motion.section className="pt-20 pb-12 md:pt-24 md:pb-16 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden" initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.05
      }} variants={sectionVariants}>
                    <div className="absolute -left-64 -top-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse opacity-50 z-0"></div>
                    <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
                            <div className="lg:col-span-12 mb-8 md:mb-10">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 leading-tight">{project.title}</h1>
                                <p className="text-xl md:text-2xl lg:text-3xl text-primary font-medium mb-3">{project.subtitle}</p>
                                {project.tagline && <p className="text-lg md:text-xl text-slate-300 italic max-w-3xl">{project.tagline}</p>}
                            </div>

                            <div className="lg:col-span-7 xl:col-span-6 mb-10 lg:mb-12">
                                <div className="prose prose-invert prose-lg max-w-none text-slate-200 mb-8">
                                    <p>{project.description}</p>
                                </div>
                                {project.architectQuote && <blockquote className="border-l-4 border-primary/50 pl-4 italic text-slate-300">
                                        <p className="mb-1">"{project.architectQuote.text}"</p>
                                        <footer className="text-sm text-slate-400 not-italic">- {project.architectQuote.author}</footer>
                                    </blockquote>}
                            </div>

                            {project.videoUrl && <motion.div className="lg:col-span-5 xl:col-span-6 lg:col-start-8 xl:col-start-7 mb-10 lg:mb-12" initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.7,
              delay: 0.2,
              ease: "easeOut"
            }} viewport={{
              once: true,
              amount: 0.3
            }}>
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-slate-700/50 relative z-10">
                                        <iframe className="absolute top-0 left-0 w-full h-full" src={enhancedVideoUrl} title={`${project.title} - Видео фон`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                    </div>
                                </motion.div>}

                            {project.advantages && project.advantages.length > 0 && <div className="lg:col-span-12 my-16">
                                    <h2 className="text-3xl font-bold mb-8 text-white text-center">Преимущества проекта</h2>
                                    <Carousel className="w-full max-w-6xl mx-auto" opts={{
                align: "start",
                loop: true
              }}>
                                        <CarouselContent className="-ml-2 md:-ml-4">
                                            {project.advantages.map((advantage, index) => <CarouselItem key={`advantage-${index}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                                    <div className="h-full">
                                                        <Card className="border-slate-800 bg-slate-900/60 h-full">
                                                            <div className="p-1">
                                                                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-md">
                                                                    <img src={advantage.image} alt={advantage.title} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                                                                            <advantage.icon className="w-5 h-5 text-white" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <CardContent className="pt-5 pb-6">
                                                                <h3 className="text-xl font-bold text-white mb-2">{advantage.title}</h3>
                                                                <p className="text-slate-300 text-sm">{advantage.description}</p>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>)}
                                        </CarouselContent>
                                        <div className="flex">
                                            <CarouselPrevious className="mx-0 px-0 my-[40px]" />
                                            <CarouselNext className="my-[40px]" />
                                        </div>
                                    </Carousel>
                                </div>}

                            {project.keyBenefits && project.keyBenefits.length > 0 && <div className="lg:col-span-12 my-10 md:my-12 lg:mt-0">
                                    <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">Ключевые преимущества</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                        {project.keyBenefits.map((benefit, index) => <motion.div key={`benefit-${index}`} className="flex flex-col items-center text-center md:flex-row md:text-left gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 transition-all hover:border-primary/30 hover:bg-slate-800/50" initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }} viewport={{
                  once: true,
                  amount: 0.5
                }}>
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <benefit.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                                                    <p className="text-sm text-slate-300">{benefit.description}</p>
                                                </div>
                                            </motion.div>)}
                                    </div>
                                </div>}

                            <div className="lg:col-span-12 mt-12 md:mt-16 border-t border-slate-700/50 pt-8">
                                <h3 className="text-xl font-semibold text-white mb-5">Основные характеристики</h3>
                                <div className="flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-4">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Расположение</div>
                                        <div className="text-base font-medium text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{project.location}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Год</div>
                                        <div className="text-base font-medium text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{project.yearBuilt}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Площадь</div>
                                        <div className="text-base font-medium text-white flex items-center gap-2"><Home className="w-4 h-4 text-primary" />{project.totalArea}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Статус</div>
                                        <div className="text-base font-medium text-white">
                                             <span className="bg-primary/20 px-2.5 py-0.5 rounded text-primary text-sm">
                                                {project.status}
                                             </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Этажность</div>
                                        <div className="text-base font-medium text-white flex items-center gap-2"><Building className="w-4 h-4 text-primary" />{project.floors}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Помещений</div>
                                        <div className="text-base font-medium text-white flex items-center gap-2"><Users className="w-4 h-4 text-primary" />{project.apartmentsCount}</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800/50 flex flex-wrap items-center gap-x-6 gap-y-2">
                                     <span className="text-sm text-slate-400 mr-2">Быстрый переход:</span>
                                     <a href="#gallery" className="text-sm text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
                                        <ImageIcon size={14} /> Галерея
                                     </a>
                                     {project.hasFloorPlans && <a href="#floor-plans" className="text-sm text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
                                            <LayoutGrid size={14} /> Планировки
                                         </a>}
                                     <a href="#location" className="text-sm text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
                                        <Map size={14} /> Расположение
                                     </a>
                                 </div>
                            </div>

                            <div className="lg:col-span-12 mt-12 md:mt-16">
                                <motion.div className="mb-10" variants={listVariants} initial="hidden" whileInView="visible" viewport={{
                once: true,
                amount: 0.2
              }}>
                                    <h3 className="text-2xl font-bold text-white mb-5">Все особенности проекта</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                        {project.features.map((feature: string, index: number) => <motion.li key={`${project.id}-feature-${index}`} className="flex items-center gap-3" variants={itemVariants}>
                                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                                <span className="text-slate-200">{feature}</span>
                                            </motion.li>)}
                                    </ul>
                                </motion.div>

                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 gap-2 shadow-lg hover:shadow-primary/40">
                                        Узнать цены
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-colors duration-200">
                                        Записаться на просмотр
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.section>

                <section id="gallery" className="py-20 md:py-24 bg-[#161616]">
                  <div className="container mx-auto px-6">
                    <motion.div className="flex flex-col items-center mb-12 md:mb-16 text-center" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true,
            amount: 0.2
          }}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary uppercase tracking-wider">Галерея</h2>
                      <h3 className="text-xl font-medium mb-4 text-white">{project.title}</h3>
                      <div className="w-20 h-1 bg-primary/50 mb-6 rounded-full"></div>
                      <p className="text-slate-300 text-lg max-w-3xl">
                        Ознакомьтесь с фотографиями проекта, чтобы увидеть все детали и особенности {project.subtitle.toLowerCase()}.
                      </p>
                    </motion.div>
                    <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true,
            amount: 0.1
          }}>
                      <ProjectGallery images={project.images} />
                    </motion.div>
                  </div>
                </section>

                {/* Calculator Section */}
                <motion.section className="py-16 bg-[#161616]" id="calculator" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
                    once: true,
                    amount: 0.2
                }}>
                  <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wider flex items-center gap-2">
                        <Calculator className="text-brand-primary w-8 h-8" />
                        Расчет стоимости
                      </h2>
                      <div className="w-20 h-1 bg-brand-primary mb-6 rounded-full"></div>
                      <p className="text-slate-300 text-lg max-w-3xl mb-8">
                        Рассчитайте примерную стоимость квартиры в жилом комплексе {project.title}, 
                        основываясь на текущей цене за квадратный метр.
                      </p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto">
                      <ApartmentCalculator />
                    </div>
                  </div>
                </motion.section>

                {project.hasFloorPlans && <motion.div id="floor-plans" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.2
      }} className="py-20 md:py-24 bg-[#1a1a1a]">
                    <FloorPlansSection projectId={project.id} pricePerSqm={pricePerSqm} />
                  </motion.div>}

                <section id="location" className="py-20 md:py-24 bg-[#1a1a1a]">
                  <div className="container mx-auto px-6">
                    <motion.div className="flex flex-col items-center mb-12 md:mb-16 text-center" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true,
            amount: 0.2
          }}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wider">Расположение</h2>
                      <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
                      <p className="text-slate-300 text-lg max-w-3xl mb-8">
                        {project.title} расположен в удобном месте с развитой инфраструктурой и хорошей транспортной доступностью.
                      </p>
                      <div className="inline-flex items-center justify-center text-lg bg-slate-800/40 px-6 py-3 rounded-lg border border-slate-700/50">
                        <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-slate-200">{project.location}</span>
                      </div>
                    </motion.div>
                    <motion.div className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/50" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true,
            amount: 0.2
          }}>
                      <div className="aspect-video w-full bg-slate-700">
                        <iframe src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${69.25872}!3d${41.240959}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE0JzI3LjQiTiA2OcKwMTUnMzEuNCJF!5e0!3m2!1sen!2sus!4v${Date.now()}&q=${encodeURIComponent(project.location)}`} width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Карта расположения - ${project.title}`} className="w-full h-full block"></iframe>
                      </div>
                    </motion.div>
                  </div>
                </section>

            </main>
            <Footer />
            <ScrollToTopButton />
        </div>;
};
export default ProjectDetail;
