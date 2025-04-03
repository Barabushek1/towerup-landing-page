import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { MapPin, Calendar, ArrowRight, Home, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProjectGallery from '@/components/ProjectGallery';
import { motion } from 'framer-motion';
import FloorPlansSection from '@/components/FloorPlansSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';

// Project data (hardcoded for now)
const projectsData = {
  "pushkin": {
    id: "pushkin",
    title: "ЖК «Пушкин»",
    subtitle: "Жилой комплекс",
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
    hasFloorPlans: true
  },
  "kumaryk": {
    id: "kumaryk",
    title: "ЖК «Кумарык»",
    subtitle: "Жилой комплекс",
    shortDescription: "Уютный жилой комплекс с современной инфраструктурой и благоустроенной территорией.",
    description: "Жилой комплекс «Кумарык» - это уютный комплекс из трех 12-этажных домов с современной архитектурой и продуманными планировками квартир. В комплексе предусмотрены все необходимые условия для комфортной жизни: детские и спортивные площадки, зоны отдыха, охраняемая территория, подземный паркинг и развитая инфраструктура района.",
    location: "г. Ташкент, Яшнабадский район",
    yearBuilt: "2023",
    totalArea: "18 000 м²",
    floors: "12",
    apartmentsCount: "144",
    mainImage: "/assets/Pushkin/2.jpg",
    // Временно используем изображение из Pushkin
    logo: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
    status: "Проектирование",
    features: ["Современный дизайн", "Просторные планировки", "Зеленые зоны отдыха", "Детская площадка", "Подземный паркинг", "Охрана 24/7", "Развитая инфраструктура"],
    images: [{
      url: "/assets/Pushkin/2.jpg",
      alt: "ЖК Кумарык - Визуализация"
    }, {
      url: "/assets/Pushkin/3.jpg",
      alt: "ЖК Кумарык - Территория"
    }, {
      url: "/assets/Pushkin/5.jpg",
      alt: "ЖК Кумарык - Внутренний двор"
    }],
    videoUrl: "https://www.youtube.com/embed/aBZMFKzGuoM",
    // Временно используем тот же видео
    hasFloorPlans: false
  },
  "bochka": {
    id: "bochka",
    title: "БЦ «Бочка»",
    subtitle: "Бизнес центр",
    shortDescription: "Современный бизнес-центр класса А с развитой инфраструктурой и удобной локацией.",
    description: "Бизнес-центр «Бочка» - это современное 8-этажное здание с панорамными окнами и стильным интерьером. БЦ отличается удобным расположением в деловом районе города, развитой инфраструктурой и предлагает офисные помещения различной площади. Здесь предусмотрены подземный паркинг, конференц-залы, ресторан, кафе и зоны отдыха.",
    location: "г. Ташкент, Мирзо-Улугбекский район",
    yearBuilt: "2021",
    totalArea: "12 000 м²",
    floors: "8",
    apartmentsCount: "60",
    // офисы
    mainImage: "/assets/Pushkin/8.jpg",
    // Временно используем изображение из Pushkin
    logo: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
    status: "Завершено",
    features: ["Панорамное остекление", "Современная инженерия", "Конференц-залы", "Ресторан и кафе", "Подземный паркинг", "Охрана 24/7", "Центральная локация"],
    images: [{
      url: "/assets/Pushkin/8.jpg",
      alt: "БЦ Бочка - Фасад"
    }, {
      url: "/assets/Pushkin/9.jpg",
      alt: "БЦ Бочка - Ночной вид"
    }, {
      url: "/assets/Pushkin/11.jpg",
      alt: "БЦ Бочка - Вид сбоку"
    }],
    videoUrl: "https://www.youtube.com/embed/aBZMFKzGuoM",
    // Временно используем тот же видео
    hasFloorPlans: false
  }
};
const ProjectDetail: React.FC = () => {
  const {
    slug
  } = useParams<{
    slug?: string;
  }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Simulate fetching project data
    setTimeout(() => {
      if (slug && projectsData[slug as keyof typeof projectsData]) {
        setProject(projectsData[slug as keyof typeof projectsData]);
      }
      setLoading(false);
    }, 300);
  }, [slug]);
  if (loading) {
    return <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  if (!project) {
    return <div className="min-h-screen bg-[#161616] flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Проект не найден</h2>
        <p className="mb-6">Извините, запрашиваемый проект не существует.</p>
        <Button asChild>
          <Link to="/projects">Вернуться к проектам</Link>
        </Button>
      </div>;
  }

  // Animation variants
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
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
        delayChildren: 0.3
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
      x: 0
    }
  };
  return <div className="min-h-screen antialiased bg-[#161616] text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader title={project.title} breadcrumb={`ПРОЕКТЫ / ${project.title.toUpperCase()}`} backgroundImage={project.mainImage} />
        
        {/* Hero Section */}
        <section className="py-16 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#161616] to-transparent"></div>
          
          {/* Animated background elements */}
          <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse"></div>
          <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12">
              <motion.div className="lg:w-2/3" variants={{
              hidden: {
                opacity: 0,
                y: 30
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }} initial="hidden" whileInView="visible" viewport={{
              once: true
            }}>
                <div className="flex items-center gap-4 mb-6">
                  
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h1>
                    <p className="text-brand-primary">{project.subtitle}</p>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-lg text-slate-300">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Расположение</h3>
                        <p className="text-slate-300">{project.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Год постройки</h3>
                        <p className="text-slate-300">{project.yearBuilt}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Общая площадь</h3>
                        <p className="text-slate-300">{project.totalArea}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Количество этажей</h3>
                        <p className="text-slate-300">{project.floors}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Количество квартир/офисов</h3>
                        <p className="text-slate-300">{project.apartmentsCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-brand-primary/20 to-slate-800/30 rounded-xl p-5 border border-brand-primary/30">
                    <div className="flex gap-4 items-center">
                      <div className="text-lg font-medium text-white">Текущий статус:</div>
                      <div className="bg-brand-primary/20 px-3 py-1 rounded-full text-brand-primary font-medium">
                        {project.status}
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.div className="mb-8" variants={listVariants} initial="hidden" whileInView="visible" viewport={{
                once: true
              }}>
                  <h3 className="text-xl font-bold text-white mb-4">Особенности проекта</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.features.map((feature: string, index: number) => <motion.li key={index} className="flex items-center gap-2" variants={itemVariants}>
                        <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                        <span className="text-slate-300">{feature}</span>
                      </motion.li>)}
                  </ul>
                </motion.div>
                
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white transition-colors gap-2">
                    Узнать цены
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Записаться на просмотр
                  </Button>
                </div>
              </motion.div>
              
              <motion.div className="lg:w-1/3" variants={{
              hidden: {
                opacity: 0,
                y: 30
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }} initial="hidden" whileInView="visible" viewport={{
              once: true
            }}>
                <div className="relative h-0 pb-[56.25%] bg-black rounded-xl overflow-hidden">
                  <iframe className="absolute top-0 left-0 w-full h-full" src={project.videoUrl} title={`${project.title} видео`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Gallery Section */}
        <section className="py-16 bg-[#161616]">
          <div className="container mx-auto px-6">
            <motion.div className="flex flex-col items-center mb-12" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-2 text-brand-primary">ГАЛЕРЕЯ</h2>
              <h3 className="text-xl font-medium mb-6 text-white">{project.title}</h3>
              <p className="text-slate-300 text-lg max-w-3xl text-center">
                Ознакомьтесь с фотографиями проекта, чтобы увидеть все детали и особенности {project.subtitle.toLowerCase()}.
              </p>
            </motion.div>
            
            <ProjectGallery images={project.images} />
          </div>
        </section>
        
        {/* Floor Plans Section - Only for Pushkin project */}
        {project.hasFloorPlans && <FloorPlansSection />}
        
        {/* Location Section */}
        <section className="py-16 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <motion.div className="flex flex-col items-center mb-12" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-2 text-white">РАСПОЛОЖЕНИЕ</h2>
              <div className="w-16 h-1 bg-brand-primary mb-6"></div>
              <p className="text-slate-300 text-lg max-w-3xl text-center mb-8">
                {project.title} расположен в удобном месте с развитой инфраструктурой и хорошей транспортной доступностью.
              </p>
              
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-brand-primary mr-2" />
                <span className="text-lg text-slate-200">{project.location}</span>
              </div>
            </motion.div>
            
            <motion.div className="w-full rounded-xl overflow-hidden shadow-xl border border-slate-700/30" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }}>
              <div className="aspect-video w-full">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7976.879721623986!2d69.25872!3d41.240959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae61aaa924ee97%3A0x64bd413fa7c03f6d!2sTOWER%20UP!5e1!3m2!1sen!2sus!4v1742675836272!5m2!1sen!2sus" width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Project Location" className="w-full h-full"></iframe>
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