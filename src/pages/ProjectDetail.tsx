import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar'; // Adjust path if needed
import Footer from '@/components/Footer'; // Adjust path if needed
import PageHeader from '@/components/PageHeader'; // Adjust path if needed
import { MapPin, Calendar, ArrowRight, Home, Building, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path if needed
// import { Separator } from '@/components/ui/separator'; // Separator wasn't used in the final version, uncomment if needed
import ProjectGallery from '@/components/ProjectGallery'; // Adjust path if needed
import { motion } from 'framer-motion';
import FloorPlansSection from '@/components/FloorPlansSection'; // Adjust path if needed
import ScrollToTopButton from '@/components/ScrollToTopButton'; // Adjust path if needed

// --- TypeScript Interfaces ---
interface ProjectImage {
  url: string;
  alt: string;
}

interface IProject {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  location: string;
  yearBuilt: string;
  totalArea: string;
  floors: string;
  apartmentsCount: string; // Could be offices too, keep generic name
  mainImage: string;
  logo?: string; // Optional logo
  status: string;
  features: string[];
  images: ProjectImage[];
  videoUrl?: string; // Optional video
  hasFloorPlans: boolean;
}

// --- Project Data (Hardcoded Example) ---
// TODO: Replace with actual data fetching later
const projectsData: Record<string, IProject> = {
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
    images: [{ url: "/assets/Pushkin/1.jpg", alt: "ЖК Пушкин - Вид спереди" }, { url: "/assets/Pushkin/2.jpg", alt: "ЖК Пушкин - Внешний вид" }, { url: "/assets/Pushkin/3.jpg", alt: "ЖК Пушкин - Территория" }, { url: "/assets/Pushkin/5.jpg", alt: "ЖК Пушкин - Холл" }, { url: "/assets/Pushkin/6.jpg", alt: "ЖК Пушкин - Квартира" }, { url: "/assets/Pushkin/8.jpg", alt: "ЖК Пушкин - Фасад" }, { url: "/assets/Pushkin/9.jpg", alt: "ЖК Пушкин - Ночной вид" }, { url: "/assets/Pushkin/10.jpg", alt: "ЖК Пушкин - Вечерний вид" }, { url: "/assets/Pushkin/11.jpg", alt: "ЖК Пушкин - Вид сбоку" }, { url: "/assets/Pushkin/14.jpg", alt: "ЖК Пушкин - План территории" }],
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
    mainImage: "/assets/Pushkin/2.jpg", // Placeholder image
    logo: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
    status: "Проектирование",
    features: ["Современный дизайн", "Просторные планировки", "Зеленые зоны отдыха", "Детская площадка", "Подземный паркинг", "Охрана 24/7", "Развитая инфраструктура"],
    images: [{ url: "/assets/Pushkin/2.jpg", alt: "ЖК Кумарык - Визуализация" }, { url: "/assets/Pushkin/3.jpg", alt: "ЖК Кумарык - Территория" }, { url: "/assets/Pushkin/5.jpg", alt: "ЖК Кумарык - Внутренний двор" }],
    videoUrl: "https://www.youtube.com/embed/aBZMFKzGuoM", // Placeholder video
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
    apartmentsCount: "60 Офисов", // Specify 'Offices'
    mainImage: "/assets/Pushkin/8.jpg", // Placeholder image
    logo: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png",
    status: "Завершено",
    features: ["Панорамное остекление", "Современная инженерия", "Конференц-залы", "Ресторан и кафе", "Подземный паркинг", "Охрана 24/7", "Центральная локация"],
    images: [{ url: "/assets/Pushkin/8.jpg", alt: "БЦ Бочка - Фасад" }, { url: "/assets/Pushkin/9.jpg", alt: "БЦ Бочка - Ночной вид" }, { url: "/assets/Pushkin/11.jpg", alt: "БЦ Бочка - Вид сбоку" }],
    videoUrl: "https://www.youtube.com/embed/aBZMFKzGuoM", // Placeholder video
    hasFloorPlans: false
  }
};

// --- React Component ---
const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate fetching project data
    const timer = setTimeout(() => {
      if (slug && projectsData[slug]) {
        setProject(projectsData[slug]);
      }
      setLoading(false);
    }, 300); // Simulate network delay
    return () => clearTimeout(timer); // Cleanup timer on unmount/slug change
  }, [slug]);

  // --- Animation Variants ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center"> {/* Use theme background */}
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col text-foreground"> {/* Use theme background/foreground */}
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
          <h2 className="text-3xl font-bold mb-4">Проект не найден</h2>
          <p className="mb-6 text-muted-foreground max-w-md"> {/* Use theme muted text */}
            Извините, проект с запрашиваемым адресом не существует или еще не добавлен на сайт.
          </p>
          <Button asChild>
            <Link to="/projects">Вернуться ко всем проектам</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden"> {/* Use theme background/foreground */}
      <NavBar />
      <main>
        <PageHeader
          title={project.title}
          breadcrumb={`ПРОЕКТЫ / ${project.title.toUpperCase()}`}
          backgroundImage={project.mainImage}
        />

                {/* === Hero Section (Approach 2: Feature-Focused Intro Grid) === */}
        <motion.section
          className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {/* Background Blobs (Keep these) */}
          <div className="absolute -left-64 -top-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse opacity-50 z-0"></div>
          <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

          <div className="container mx-auto px-6 relative z-10">
             {/* Project Title & Subtitle */}
             <div className="mb-10 md:mb-12 max-w-4xl"> {/* Limit width if needed */}
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">{project.title}</h1>
               <p className="text-xl md:text-2xl text-primary font-medium">{project.subtitle}</p>
             </div>

             {/* --- Feature/Stats Grid --- */}
             {/* Adjust grid columns for different screen sizes */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">

                {/* Video Block (Takes more space on larger screens) */}
                {project.videoUrl && (
                    <motion.div
                        className="sm:col-span-2 lg:col-span-2 xl:row-span-2 rounded-xl overflow-hidden shadow-xl border border-slate-700/50 bg-black aspect-video relative" // Use aspect-video for sizing
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                         <iframe
                           className="absolute top-0 left-0 w-full h-full"
                           src={project.videoUrl}
                           title={`${project.title} - Видео обзор`}
                           frameBorder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                         ></iframe>
                    </motion.div>
                )}

                {/* Location Info */}
                <motion.div
                    className="bg-slate-800/40 rounded-xl p-5 md:p-6 border border-slate-700/50 flex flex-col justify-center"
                     initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}
                >
                    <MapPin className="w-7 h-7 text-primary mb-3"/>
                    <h3 className="font-semibold text-white mb-1 text-lg">Расположение</h3>
                    <p className="text-slate-300 text-sm">{project.location}</p>
                </motion.div>

                {/* Status Info */}
                 <motion.div
                    className="bg-gradient-to-br from-primary/15 to-slate-800/50 rounded-xl p-5 md:p-6 border border-primary/40 flex flex-col justify-center"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}
                 >
                     <Calendar className="w-7 h-7 text-primary mb-3"/> {/* Using Calendar icon as proxy */}
                    <h3 className="font-semibold text-white mb-1 text-lg">Статус</h3>
                     <span className="inline-block bg-primary/20 px-3 py-1 rounded-md text-primary font-medium text-sm self-start">
                         {project.status}
                     </span>
                     <p className="text-slate-400 text-sm mt-2">({project.yearBuilt})</p> {/* Year added here */}
                 </motion.div>

                {/* Key Feature 1 (Example: Parking) */}
                {project.features.find(f => f.toLowerCase().includes("паркинг")) && (
                     <motion.div
                        className="bg-slate-800/40 rounded-xl p-5 md:p-6 border border-slate-700/50 flex flex-col justify-center"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}
                     >
                        <CheckCircle2 className="w-7 h-7 text-primary mb-3"/> {/* Generic Feature Icon */}
                        <h3 className="font-semibold text-white mb-1 text-lg">Подземный паркинг</h3>
                        <p className="text-slate-300 text-sm">Безопасное и удобное хранение автомобиля.</p>
                     </motion.div>
                 )}

                 {/* Area / Units Info */}
                 <motion.div
                    className="bg-slate-800/40 rounded-xl p-5 md:p-6 border border-slate-700/50 flex flex-col justify-center"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }}
                 >
                     <Home className="w-7 h-7 text-primary mb-3"/>
                    <h3 className="font-semibold text-white mb-1 text-lg">Площадь / Юниты</h3>
                    <p className="text-slate-300 text-sm">Общая площадь: {project.totalArea}</p>
                     <p className="text-slate-300 text-sm">{project.apartmentsCount} квартир/офисов</p>
                 </motion.div>

                 {/* Key Feature 2 (Example: Security) - Add more if space/design allows */}
                {project.features.find(f => f.toLowerCase().includes("охрана") || f.toLowerCase().includes("охраняемая")) && (
                     <motion.div
                        className="bg-slate-800/40 rounded-xl p-5 md:p-6 border border-slate-700/50 flex flex-col justify-center xl:col-start-3" // Example positioning on XL
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }}
                     >
                        <CheckCircle2 className="w-7 h-7 text-primary mb-3"/> {/* Generic Feature Icon */}
                        <h3 className="font-semibold text-white mb-1 text-lg">Охраняемая территория</h3>
                        <p className="text-slate-300 text-sm">Круглосуточная охрана и видеонаблюдение.</p>
                     </motion.div>
                 )}
             </div>

             {/* Description (Placed after the grid) */}
             <div className="prose prose-invert prose-lg max-w-none lg:max-w-4xl mx-auto mb-10 md:mb-12 text-slate-200 text-center lg:text-left">
               <h3 className="text-2xl font-bold text-white mb-4">Подробнее о проекте</h3>
               <p>{project.description}</p>
             </div>

             {/* Full Features List & CTAs (Can be centered or within a column) */}
             <div className="max-w-4xl mx-auto">
                 {/* Optional: Full Features List if needed */}
                 {/* <motion.div className="mb-10" ... > ... </motion.div> */}

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
        </motion.section>

        {/* === Gallery Section === */}
        <section id="gallery" className="py-20 md:py-24 bg-[#161616]"> {/* Darker background */}
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <motion.div
              className="flex flex-col items-center mb-12 md:mb-16 text-center"
              variants={sectionVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary uppercase tracking-wider">Галерея</h2>
              <h3 className="text-xl font-medium mb-4 text-white">{project.title}</h3>
               <div className="w-20 h-1 bg-primary/50 mb-6 rounded-full"></div> {/* Accent line */}
              <p className="text-slate-300 text-lg max-w-3xl">
                Ознакомьтесь с фотографиями проекта, чтобы увидеть все детали и особенности {project.subtitle.toLowerCase()}.
              </p>
            </motion.div>

            {/* Gallery Component */}
            <motion.div
               variants={sectionVariants} // Use section animation
               initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} // Animate when gallery starts appearing
            >
              <ProjectGallery images={project.images} />
             </motion.div>
          </div>
        </section>

        {/* === Floor Plans Section (Conditional) === */}
        {project.hasFloorPlans && (
          <motion.div
             id="floor-plans"
             variants={sectionVariants} // Use section animation
             initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
             // Add background and padding if FloorPlansSection doesn't handle it
             className="py-20 md:py-24 bg-[#1a1a1a]" // Slightly lighter background maybe
          >
            {/* Assuming FloorPlansSection handles its own container/padding */}
            <FloorPlansSection projectId={project.id} /> {/* Pass project ID if needed */}
           </motion.div>
        )}

        {/* === Location Section === */}
        <section id="location" className="py-20 md:py-24 bg-[#1a1a1a]"> {/* Slightly lighter background */}
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <motion.div
              className="flex flex-col items-center mb-12 md:mb-16 text-center"
               variants={sectionVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wider">Расположение</h2>
               <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div> {/* Accent line */}
              <p className="text-slate-300 text-lg max-w-3xl mb-8">
                {project.title} расположен в удобном месте с развитой инфраструктурой и хорошей транспортной доступностью.
              </p>
              {/* Location Address Display */}
              <div className="inline-flex items-center justify-center text-lg bg-slate-800/40 px-6 py-3 rounded-lg border border-slate-700/50">
                <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-slate-200">{project.location}</span>
              </div>
            </motion.div>

            {/* Map Embed */}
            <motion.div
              className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/50"
               variants={sectionVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            >
              <div className="aspect-video w-full bg-slate-700"> {/* Background color while map loads */}
                {/* TODO: Replace with actual coordinates/query for the specific project */}
                {/* Example using coordinates (replace 41.240959, 69.25872 with actual project coords) */}
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${69.25872}!3d${41.240959}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE0JzI3LjQiTiA2OcKwMTUnMzEuNCJF!5e0!3m2!1sen!2sus!4v${Date.now()}&q=${encodeURIComponent(project.location)}`} // Using coords & query
                  width="100%"
                  height="100%" // Use 100% height for aspect-video container
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Карта расположения - ${project.title}`}
                  className="w-full h-full block" // Ensure block display and fills container
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default ProjectDetail;
