
import React, { useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Award, Users, Building, Star, Rocket, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const About: React.FC = () => {
  const isMobile = useIsMobile();
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);
    
    const timelineElements = timelineRef.current?.querySelectorAll('.timeline-item');
    timelineElements?.forEach(el => observer.observe(el));
    
    const valueElements = valuesRef.current?.querySelectorAll('.value-item');
    valueElements?.forEach(el => observer.observe(el));
    
    return () => {
      timelineElements?.forEach(el => observer.unobserve(el));
      valueElements?.forEach(el => observer.unobserve(el));
    };
  }, []);

  const timeline = [
    { year: '2010', title: 'Основание компании', description: 'Компания TOWER UP была основана с целью создания современных и инновационных решений в области строительства.' },
    { year: '2015', title: 'Первый крупный проект', description: 'Реализация первого масштабного проекта в центре Ташкента, который получил признание в архитектурном сообществе.' },
    { year: '2018', title: 'Международное признание', description: 'Компания получила международную награду за инновационные решения в области устойчивого строительства.' },
    { year: '2020', title: 'Расширение деятельности', description: 'Открытие новых офисов и выход на региональные рынки Центральной Азии.' },
    { year: '2023', title: 'Технологический прорыв', description: 'Внедрение передовых технологий умных домов и экологически чистых материалов в строительстве.' }
  ];

  const values = [
    { 
      title: 'Качество', 
      description: 'Мы стремимся к совершенству в каждой детали нашей работы, используя только лучшие материалы и технологии.',
      icon: <Star className="w-10 h-10 text-primary" />
    },
    { 
      title: 'Инновации', 
      description: 'Мы постоянно исследуем и внедряем передовые решения, чтобы обеспечить нашим клиентам самые современные объекты.',
      icon: <Rocket className="w-10 h-10 text-primary" />
    },
    { 
      title: 'Доверие', 
      description: 'Мы строим долгосрочные отношения с нашими клиентами, основанные на честности, прозрачности и надежности.',
      icon: <Heart className="w-10 h-10 text-primary" />
    },
    { 
      title: 'Экологичность', 
      description: 'Мы заботимся об окружающей среде и стремимся минимизировать воздействие наших проектов на экологию.',
      icon: <Building className="w-10 h-10 text-primary" />
    }
  ];

  const testimonials = [
    {
      name: "Алексей Петров",
      position: "CEO, Tech Industries",
      content: "Сотрудничество с TOWER UP превзошло все наши ожидания. Их внимание к деталям и качество работы действительно выделяют их среди конкурентов."
    },
    {
      name: "Мария Иванова",
      position: "Директор по развитию, Urban Solutions",
      content: "TOWER UP реализовали наш проект в срок и в рамках бюджета. Их профессиональный подход и инновационные решения помогли нам создать уникальное здание."
    },
    {
      name: "Дмитрий Сидоров",
      position: "Главный архитектор, Design Group",
      content: "Команда TOWER UP продемонстрировала исключительные знания и опыт в сфере строительства. Рекомендую их всем, кто ценит качество и надежность."
    }
  ];

  const stats = [
    { number: "120+", label: "ЗАВЕРШЕННЫХ ПРОЕКТОВ" },
    { number: "15", label: "ЛЕТ НА РЫНКЕ" },
    { number: "98%", label: "ДОВОЛЬНЫХ КЛИЕНТОВ" },
    { number: "350+", label: "ПРОФЕССИОНАЛОВ В КОМАНДЕ" }
  ];

  const faqItems = [
    {
      question: "Какие гарантии вы предоставляете на ваши объекты?",
      answer: "Все наши объекты имеют гарантию 10 лет. Мы также обеспечиваем послегарантийное обслуживание и поддержку на протяжении всего срока эксплуатации здания."
    },
    {
      question: "Какие инновационные технологии вы используете?",
      answer: "Мы внедряем передовые технологии умных домов, системы энергоэффективности и экологически чистые материалы. Наши здания оснащены современными системами безопасности и управления."
    },
    {
      question: "Как вы обеспечиваете качество строительства?",
      answer: "Мы используем только сертифицированные материалы, работаем с опытными специалистами и проводим многоуровневый контроль качества на всех этапах строительства."
    },
    {
      question: "Сколько времени занимает реализация проекта?",
      answer: "Сроки зависят от масштаба проекта. Типичный жилой комплекс мы строим за 18-36 месяцев. На первичной консультации мы предоставляем детальный график работ."
    }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <div className="relative">
          <PageHeader 
            title="О КОМПАНИИ" 
            breadcrumb="О КОМПАНИИ"
            bgImage="https://images.unsplash.com/photo-1560748952-1d2d768c2337?q=80&w=2070&auto=format&fit=crop"
          />
        </div>
        
        {/* Hero Section with animated background */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <AnimatedBackground className="opacity-40" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white">
                  Создаем будущее вместе с вами
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                  TOWER UP — это не просто строительная компания. Мы создаем пространства, которые вдохновляют, объекты, которые служат поколениям, и решения, которые опережают время.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Наши проекты
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                    Связаться с нами
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute -bottom-12 left-0 w-full h-24 bg-gradient-to-t from-[#161616] to-transparent z-10"></div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="md:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Наша миссия</h2>
                  <div className="h-1 w-20 bg-primary mb-8"></div>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    Мы стремимся изменить подход к строительству в Узбекистане, создавая объекты, которые сочетают в себе функциональность, эстетику и устойчивость. Наша цель — формировать гармоничную городскую среду для будущих поколений.
                  </p>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    TOWER UP объединяет опытных профессионалов, которые разделяют общее видение современного строительства, где качество и инновации идут рука об руку.
                  </p>
                </div>
                <div className="md:w-1/2 relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary opacity-20 rounded-lg"></div>
                  <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
                    <img 
                      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop" 
                      alt="Команда TOWER UP" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Stats Counter Section */}
        <section className="py-16 bg-[#161616]">
          <div className="container mx-auto px-6">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-[#1E1E1E] p-6 md:p-8 rounded-lg border border-white/5 text-center hover:border-primary/30 transition-all duration-300 transform hover:translate-y-[-5px]"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-sm md:text-base text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Company Values Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a]" ref={valuesRef}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Наши ценности</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Ценности нашей компании — это не просто слова, а принципы, которыми мы руководствуемся в каждом проекте и в каждом решении.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="value-item bg-[#212121] p-8 rounded-lg border border-white/5 transform opacity-0 translate-y-10 transition-all duration-700 ease-out hover:border-primary/20 hover:bg-[#191919]"
                >
                  <div className="mb-6 inline-block p-4 rounded-full bg-primary/10">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-[#161616]" ref={timelineRef}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Наш путь</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative">
              {/* Vertical line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>
              
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className={`timeline-item relative mb-12 md:mb-0 opacity-0 transition-all duration-700 delay-${index * 100} ${index % 2 === 0 ? 'md:translate-x-[-50px]' : 'md:translate-x-[50px]'}`}
                >
                  <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Year bubble */}
                    <div className="z-10 mb-4 md:mb-0">
                      <div className="bg-primary text-white py-2 px-6 rounded-full font-bold shadow-lg">
                        {item.year}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-5/12 bg-[#1E1E1E] p-6 rounded-lg shadow-lg border border-white/5 ${index % 2 === 0 ? 'md:ml-10' : 'md:mr-10'}`}>
                      <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a] overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Отзывы клиентов</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            </div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-[#212121] border-white/5 h-full">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="inline-block w-5 h-5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                        <div>
                          <p className="font-bold text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-400">{testimonial.position}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 md:py-24 bg-[#161616]">
          <div className="container mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Наша команда</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                За каждым успешным проектом стоит команда профессионалов, которые вкладывают свой опыт, знания и творческий потенциал.
              </p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[1, 2, 3, 4].map((member) => (
                <motion.div 
                  key={member}
                  variants={fadeInUp}
                  className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/300x300?portrait&sig=${member}`}
                      alt={`Team Member ${member}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-1">Имя Фамилия</h4>
                    <p className="text-primary mb-3">Должность</p>
                    <p className="text-gray-400 text-sm">Профессионал с более чем 10-летним опытом работы в строительной отрасли.</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-12">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Вся команда
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Часто задаваемые вопросы</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-6">Не нашли ответ на свой вопрос?</p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Свяжитесь с нами
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
