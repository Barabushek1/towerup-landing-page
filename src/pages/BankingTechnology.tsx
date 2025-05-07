import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ProjectGallery from '@/components/ProjectGallery';
import { motion } from 'framer-motion';
import { Building, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
const BankingTechnology: React.FC = () => {
  // Smooth scrolling to sections when clicking on navigation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target && target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const id = target.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
          history.pushState(null, '', target.hash);
        }
      }
    };
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick as EventListener);
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const staggerChildren = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Project gallery images
  const galleryImages = [{
    url: "/lovable-uploads/cf9752f7-44b9-4249-932c-6ba52b072297.png",
    alt: "Бизнес-центр Banking Technology - главный фасад"
  }, {
    url: "/lovable-uploads/1a7ee14a-48e9-488c-ab6e-6c3c26c31662.png",
    alt: "Панорамный вид на вход"
  }, {
    url: "/lovable-uploads/0bf9c963-622d-425e-b5bd-569ff287e477.png",
    alt: "Главный вход со стороны улицы"
  }, {
    url: "/lovable-uploads/76308b48-98d4-49ce-b48d-1aefaec36737.png",
    alt: "Вечерний вид входной группы"
  }, {
    url: "/lovable-uploads/2e1e8779-365c-4488-8369-d3b2528bbcff.png",
    alt: "Ночной вид бизнес-центра"
  }, {
    url: "/lovable-uploads/aa408c5e-8460-4748-9cb2-5482a57656da.png",
    alt: "Дневной вид главного здания"
  }, {
    url: "/lovable-uploads/9e62ecd5-cc9e-4669-931b-f2637f823c6e.png",
    alt: "Вечерний вид офисного блока"
  }, {
    url: "/lovable-uploads/33f8f5d4-56e8-432f-8dcb-3a1b93805a52.png",
    alt: "Внешний вид здания с улицы"
  }];

  // Project specification items
  const specificationItems = [{
    label: "Тип",
    value: "Бизнес-центр класса А"
  }, {
    label: "Расположение",
    value: "Ташкент, Деловой квартал"
  }, {
    label: "Площадь",
    value: "18,500 м²"
  }, {
    label: "Количество этажей",
    value: "15 (основная башня), 2 (стеклянный павильон)"
  }, {
    label: "Статус",
    value: "Строится"
  }, {
    label: "Срок сдачи",
    value: "Q3 2026"
  }];

  // Project features
  const features = [{
    title: "Футуристическая архитектура",
    description: "Уникальное сочетание стеклянного фасада со структурными элементами вертикального членения, создающее элегантный и современный облик."
  }, {
    title: "Энергоэффективность",
    description: "Фасады спроектированы с использованием специального стекла, сокращающего теплопотери зимой и защищающего от перегрева летом."
  }, {
    title: "Панорамное остекление",
    description: "Максимальное использование естественного света в рабочих пространствах благодаря сплошному остеклению фасадов."
  }, {
    title: "Многофункциональность",
    description: "Комплекс сочетает офисные пространства, конференц-зоны и коммерческие помещения для комплексного обслуживания арендаторов."
  }];
  return <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        {/* Page Header */}
        <PageHeader title="БЦ &quot;BANKING TECHNOLOGY&quot;" breadcrumb="ПРОЕКТЫ / BANKING TECHNOLOGY" backgroundImage="/lovable-uploads/cf9752f7-44b9-4249-932c-6ba52b072297.png" />

        {/* Project Overview Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16" initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={staggerChildren}>
              {/* Left Column - Project Description */}
              <motion.div className="lg:col-span-7" variants={fadeInUp}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-benzin">
                      Бизнес-центр нового поколения
                    </h2>
                    <p className="text-slate-400 mb-4">
                      Бизнес-центр «Banking Technology» — это инновационный архитектурный проект, олицетворяющий современный деловой подход и высокие технологии. Здание представляет собой гармоничное сочетание строгих геометрических форм с элементами футуристического дизайна.
                    </p>
                    <p className="text-slate-400 mb-4">
                      Главный фасад комплекса выполнен из стекла с вертикальными элементами членения, создающими уникальный ритмический рисунок. Особенностью проекта является комбинация основной высотной башни с прилегающим стеклянным павильоном оригинальной формы, что придает композиции динамичность и выразительность.
                    </p>
                    <p className="text-slate-400 mb-4">
                      Панорамное остекление обеспечивает максимальное проникновение естественного света в рабочие пространства, а зеленая кровля и благоустроенная территория вокруг создают комфортную среду для сотрудников и посетителей.
                    </p>
                  </div>

                  {/* Project Features */}
                  <div className="pt-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-6 text-white font-benzin">
                      Особенности проекта
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {features.map((feature, index) => <div key={index} className="border border-slate-800/50 p-5 rounded-lg bg-[#1c1c1c] hover:border-primary/30 transition-all duration-300">
                          <h4 className="text-lg font-medium text-primary mb-2">{feature.title}</h4>
                          <p className="text-slate-400 text-sm">{feature.description}</p>
                        </div>)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Project Specifications */}
              <motion.div className="lg:col-span-5" variants={fadeInUp}>
                <div className="bg-[#1c1c1c] border border-slate-800/50 p-6 md:p-8 rounded-xl">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-white font-benzin">
                    Характеристики проекта
                  </h3>
                  
                  <div className="space-y-4">
                    {specificationItems.map((item, index) => <div key={index} className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-400 font-medium">{item.label}:</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>)}
                  </div>

                  {/* Location Badge */}
                  <div className="mt-8 flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Расположение</p>
                      <p className="text-white font-medium">Ташкент, Деловой квартал</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Статус проекта</p>
                      <p className="text-white font-medium">В процессе строительства</p>
                    </div>
                  </div>

                  {/* Completion Badge */}
                  <div className="mt-4 flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Срок завершения</p>
                      <p className="text-white font-medium">III квартал 2026</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 md:py-24 bg-[#161616] relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-benzin">Галерея проекта</h2>
              <p className="text-slate-400 text-sm md:text-base">
                Ознакомьтесь с визуализациями проекта бизнес-центра «Banking Technology», отражающими инновационные архитектурные решения и высокое качество исполнения.
              </p>
            </motion.div>
            
            <ProjectGallery images={galleryImages} />
          </div>
        </section>

        {/* Architecture Description Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={staggerChildren} className="max-w-4xl mx-auto">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-8 text-white text-center font-benzin">
                Архитектурная концепция
              </motion.h2>

              <motion.div variants={fadeInUp} className="prose prose-invert max-w-none">
                <p className="text-slate-400 mb-6">
                  Концепция проекта «Banking Technology» основана на сочетании инновационных технологий строительства и современных архитектурных тенденций. Здание представляет собой яркий образец интеграции дизайна и функциональности.
                </p>
                
                <p className="text-slate-400 mb-6">
                  Основная высотная башня имеет строгий геометрический силуэт с вертикальным членением фасада, что визуально увеличивает высоту здания и придает ему элегантность. Отличительной особенностью является ритмичное чередование стеклянных панелей и структурных элементов, создающее уникальный визуальный паттерн, меняющийся в зависимости от угла обзора и времени суток.
                </p>

                <p className="text-slate-400 mb-6">
                  Прилегающий стеклянный павильон с плавными, обтекаемыми формами создает интересный контраст с основным объемом и служит входной группой комплекса. Изогнутые линии стеклянных конструкций и акцентная подсветка по периметру делают его визуальной доминантой на уровне первых этажей.
                </p>

                <p className="text-slate-400 mb-6">
                  Ночная подсветка здания разработана таким образом, чтобы подчеркнуть архитектурные особенности комплекса и создать выразительный силуэт в ночном городском пейзаже. Умная система освещения меняет интенсивность и характер подсветки в зависимости от сезона и времени суток.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-12">
                <Separator className="my-8 bg-slate-800/50" />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Разработано</p>
                      <p className="text-white font-medium">TOWERUP</p>
                    </div>
                  </div>
                  
                  <a href="/projects" className="group flex items-center gap-2 bg-primary/10 hover:bg-primary text-white px-5 py-2.5 rounded-lg transition-all duration-300 border border-primary/20 hover:border-primary">
                    <span>Все проекты</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default BankingTechnology;