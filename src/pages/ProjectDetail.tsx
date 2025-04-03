
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ProjectGallery from '@/components/ProjectGallery';
import { 
  Building, 
  CalendarClock, 
  CheckCircle, 
  Home, 
  Landmark, 
  MapPin, 
  ParkingSquare, 
  Shield, 
  Trees,
  ArrowRight
} from 'lucide-react';
import FloorPlansSection from '@/components/FloorPlansSection';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ProjectData {
  id: string;
  title: string;
  fullTitle: string;
  subtitle: string;
  type: string;
  description: string;
  location: string;
  address: string;
  status: string;
  completion: string;
  features: { icon: React.ElementType; title: string; description: string }[];
  mainImage: string;
  galleryImages: { url: string; alt?: string }[];
  videoUrl?: string;
  youtubeId?: string;
  hasFloorPlans: boolean;
}

const projectsData: Record<string, ProjectData> = {
  'pushkin': {
    id: 'pushkin',
    title: 'Пушкин',
    fullTitle: 'ЖК "Пушкин"',
    subtitle: 'Современный жилой комплекс',
    type: 'Жилой комплекс',
    description: 'Жилой комплекс "Пушкин" — это современные квартиры и высокий уровень комфорта в экологически чистом районе Ташкента. Пять жилых домов с благоустроенной территорией, детскими площадками и зелеными зонами создают идеальную среду для жизни.',
    location: 'Ташкент',
    address: 'ул. Пушкинская, 15А',
    status: 'Строится',
    completion: 'IV квартал 2025',
    features: [
      {
        icon: Building,
        title: '5 домов',
        description: 'Современные монолитные дома с качественной отделкой'
      },
      {
        icon: Trees,
        title: 'Зеленые зоны',
        description: 'Парковая зона и ландшафтный дизайн территории'
      },
      {
        icon: Shield,
        title: 'Безопасность',
        description: 'Закрытая охраняемая территория и видеонаблюдение 24/7'
      },
      {
        icon: ParkingSquare,
        title: 'Паркинг',
        description: 'Подземная и наземная парковки для жителей и гостей'
      },
      {
        icon: Home,
        title: 'Планировки',
        description: 'Квартиры от 1 до 4 комнат с продуманным зонированием'
      },
      {
        icon: Landmark,
        title: 'Инфраструктура',
        description: 'Собственная инфраструктура и социальные объекты'
      }
    ],
    mainImage: '/assets/Pushkin/18.jpg',
    galleryImages: [
      { url: '/assets/Pushkin/1.jpg', alt: 'ЖК Пушкин - Вид сверху' },
      { url: '/assets/Pushkin/2.jpg', alt: 'ЖК Пушкин - Внутренний двор' },
      { url: '/assets/Pushkin/3.jpg', alt: 'ЖК Пушкин - Окрестности' },
      { url: '/assets/Pushkin/5.jpg', alt: 'ЖК Пушкин - Архитектура' },
      { url: '/assets/Pushkin/6.jpg', alt: 'ЖК Пушкин - Благоустройство территории' },
      { url: '/assets/Pushkin/8.jpg', alt: 'ЖК Пушкин - Вечерний вид' },
      { url: '/assets/Pushkin/9.jpg', alt: 'ЖК Пушкин - Фасад здания' },
      { url: '/assets/Pushkin/10.jpg', alt: 'ЖК Пушкин - Территория комплекса' },
      { url: '/assets/Pushkin/11.jpg', alt: 'ЖК Пушкин - Внутренний двор' },
      { url: '/assets/Pushkin/12.jpg', alt: 'ЖК Пушкин - Вид сверху' },
      { url: '/assets/Pushkin/13.jpg', alt: 'ЖК Пушкин - Архитектурное решение' },
      { url: '/assets/Pushkin/14.jpg', alt: 'ЖК Пушкин - Фасад здания' },
      { url: '/assets/Pushkin/15.jpg', alt: 'ЖК Пушкин - Вечерний вид' },
      { url: '/assets/Pushkin/16.jpg', alt: 'ЖК Пушкин - Инфраструктура' },
      { url: '/assets/Pushkin/17.jpg', alt: 'ЖК Пушкин - Панорамный вид' },
      { url: '/assets/Pushkin/20.jpg', alt: 'ЖК Пушкин - Квартал' },
      { url: '/assets/Pushkin/21.jpg', alt: 'ЖК Пушкин - Дворовая территория' },
      { url: '/assets/Pushkin/22.jpg', alt: 'ЖК Пушкин - Общий вид' },
    ],
    youtubeId: 'aBZMFKzGuoM',
    hasFloorPlans: true
  },
  'bochka': {
    id: 'bochka',
    title: 'Бочка',
    fullTitle: 'БЦ "Бочка"',
    subtitle: 'Бизнес-центр класса А',
    type: 'Бизнес-центр',
    description: 'Бизнес-центр "Бочка" - современное офисное пространство класса А в центре делового района Ташкента. Комплекс предлагает премиальные офисы различной площади, конференц-залы, подземный паркинг и развитую инфраструктуру для успешного бизнеса.',
    location: 'Ташкент',
    address: 'ул. Навои, 37',
    status: 'Строится',
    completion: 'II квартал 2026',
    features: [
      {
        icon: Building,
        title: 'Класс A',
        description: 'Премиальный бизнес-центр высочайшего класса'
      },
      {
        icon: Shield,
        title: 'Безопасность',
        description: 'Многоуровневая система безопасности и контроля доступа'
      },
      {
        icon: ParkingSquare,
        title: 'Паркинг',
        description: 'Трехуровневый подземный паркинг на 200 автомобилей'
      },
      {
        icon: Landmark,
        title: 'Инфраструктура',
        description: 'Рестораны, кафе, фитнес-центр и магазины'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop',
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', alt: 'БЦ Бочка - Фасад' },
      { url: 'https://images.unsplash.com/photo-1577760258779-55d3d511bde7?q=80&w=1964&auto=format&fit=crop', alt: 'БЦ Бочка - Интерьер' },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop', alt: 'БЦ Бочка - Офисное пространство' }
    ],
    hasFloorPlans: false
  },
  'kumaryk': {
    id: 'kumaryk',
    title: 'Кумарык',
    fullTitle: 'ЖК "Кумарык"',
    subtitle: 'Курортный комплекс на берегу моря',
    type: 'Жилой комплекс',
    description: 'ЖК "Кумарык" - уникальный курортный комплекс на берегу Иссык-Куля, сочетающий отель 5* и частные апартаменты. Комплекс предлагает панорамные виды на озеро, собственный пляж, спа-центр и все необходимое для комфортного отдыха и жизни.',
    location: 'Иссык-Куль',
    address: 'Северный берег, 10',
    status: 'Проектируется',
    completion: 'III квартал 2026',
    features: [
      {
        icon: Building,
        title: 'Апартаменты',
        description: 'Комфортабельные апартаменты с видом на озеро'
      },
      {
        icon: Trees,
        title: 'Пляжная зона',
        description: 'Частный пляж протяженностью 150 метров'
      },
      {
        icon: Shield,
        title: 'Безопасность',
        description: 'Круглосуточная охрана и контроль доступа'
      },
      {
        icon: Landmark,
        title: 'Инфраструктура',
        description: 'Рестораны, спа-центр, бассейны и спортивные площадки'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=1170&auto=format&fit=crop',
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop', alt: 'ЖК Кумарык - Вид на озеро' },
      { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop', alt: 'ЖК Кумарык - Бассейн' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop', alt: 'ЖК Кумарык - Апартаменты' }
    ],
    hasFloorPlans: false
  }
};

// Intersection observer for animation triggers
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  threshold = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, threshold]);

  return isVisible;
};

// YouTube Player setup
const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Create YouTube Player once API is loaded
    const onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return;
      
      new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => setIsLoading(false),
        }
      });
    };

    // Set up global callback
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    // Clean up
    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [videoId]);

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;
  
  // Refs for scroll animations
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const floorPlansSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  
  const isFeaturesVisible = useIntersectionObserver(featuresSectionRef);
  const isVideoVisible = useIntersectionObserver(videoSectionRef);
  const isGalleryVisible = useIntersectionObserver(gallerySectionRef);
  const isFloorPlansVisible = useIntersectionObserver(floorPlansSectionRef);
  const isLocationVisible = useIntersectionObserver(locationSectionRef);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Preload gallery images
    if (project) {
      project.galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.url;
      });
    }
  }, [slug, project]);
  
  const handleContactClick = () => {
    toast({
      title: "Заявка отправлена",
      description: "Наш менеджер свяжется с вами в ближайшее время",
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold">Проект не найден</h1>
          <p className="mt-4">Запрашиваемый проект не существует или был удален.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  
  const featureItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title={project.fullTitle}
          breadcrumb={`ПРОЕКТЫ / ${project.title.toUpperCase()}`}
          bgImage={project.mainImage}
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-5xl mx-auto">
              {/* Project Info Header */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                    {project.status}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <span>Сдача: {project.completion}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white relative">
                  <span className="relative inline-block">
                    {project.fullTitle}
                    <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary"></span>
                  </span>
                </h1>
                
                <div className="text-lg text-gray-300 mb-12 max-w-3xl">
                  {project.description}
                </div>
              </motion.div>
              
              {/* Features */}
              <motion.div 
                ref={featuresSectionRef}
                initial="hidden"
                animate={isFeaturesVisible ? "visible" : "hidden"}
                variants={staggerChildren}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16"
              >
                {project.features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    variants={featureItem}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                    }}
                    className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="mb-4 bg-primary/10 p-3 rounded-lg inline-block">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Video */}
              {project.youtubeId && (
                <motion.div 
                  className="mb-16"
                  ref={videoSectionRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVideoVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                    <span className="w-10 h-1 bg-primary mr-4 hidden sm:block"></span>
                    Видеопрезентация проекта
                  </h2>
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
                    <YouTubePlayer videoId={project.youtubeId} />
                  </div>
                </motion.div>
              )}
              
              {/* Gallery */}
              <motion.div 
                className="mb-16"
                ref={gallerySectionRef}
                initial={{ opacity: 0 }}
                animate={isGalleryVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                  <span className="w-10 h-1 bg-primary mr-4 hidden sm:block"></span>
                  Галерея проекта
                </h2>
                <ProjectGallery images={project.galleryImages} />
              </motion.div>
              
              {/* Call to action */}
              <motion.div 
                className="mb-16 bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/30 shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Заинтересовал проект?</h3>
                    <p className="text-gray-400">Свяжитесь с нами для получения подробной информации о проекте и условиях приобретения.</p>
                  </div>
                  <Button 
                    onClick={handleContactClick}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-xl text-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Связаться с нами
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
              
              {/* Floor Plans - Only for projects with floor plans */}
              {project.hasFloorPlans && (
                <motion.div 
                  className="mb-16"
                  ref={floorPlansSectionRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isFloorPlansVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                    <span className="w-10 h-1 bg-primary mr-4 hidden sm:block"></span>
                    Планировки квартир
                  </h2>
                  <FloorPlansSection />
                </motion.div>
              )}
              
              {/* Location */}
              <motion.div 
                ref={locationSectionRef}
                initial={{ opacity: 0, y: 40 }}
                animate={isLocationVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                  <span className="w-10 h-1 bg-primary mr-4 hidden sm:block"></span>
                  Расположение
                </h2>
                <div className="rounded-xl overflow-hidden h-[400px] shadow-2xl shadow-primary/5">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.5026427678!2d69.13928787792154!3d41.282737347591396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2z0KLQsNGI0LrQtdC90YIsINCj0LfQsdC10LrQuNGB0YLQsNC9!5e0!3m2!1sru!2sru!4v1712237318152!5m2!1sru!2sru" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Расположение на карте"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
