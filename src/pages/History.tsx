
import React, { useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flag, Building, Award, Target, Rocket, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
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

const History: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
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
    
    return () => {
      timelineElements?.forEach(el => observer.unobserve(el));
    };
  }, []);

  const timeline = [
    { 
      year: '2010', 
      title: 'Основание компании', 
      description: 'Компания TOWER UP была основана с целью создания современных и инновационных решений в области строительства. Основатели компании поставили перед собой амбициозную задачу - изменить подход к строительству на рынке Узбекистана.',
      icon: <Flag className="w-8 h-8 text-primary" />,
      details: 'В первый год работы компания заключила свои первые контракты, сформировала начальную команду из 25 специалистов и открыла первый офис в Ташкенте.'
    },
    { 
      year: '2012', 
      title: 'Первые достижения', 
      description: 'Успешное завершение первых небольших проектов позволило компании TOWER UP получить признание на местном рынке и привлечь первые крупные инвестиции.',
      icon: <Award className="w-8 h-8 text-primary" />,
      details: 'К концу 2012 года штат компании вырос до 60 человек, было открыто проектное бюро и начато освоение новых технологий строительства.'
    },
    { 
      year: '2015', 
      title: 'Первый крупный проект', 
      description: 'Реализация первого масштабного проекта в центре Ташкента, который получил признание в архитектурном сообществе и стал визитной карточкой компании.',
      icon: <Building className="w-8 h-8 text-primary" />,
      details: 'Проект включал в себя строительство многофункционального комплекса общей площадью 35 000 м², который сочетал в себе жилые и коммерческие помещения.'
    },
    { 
      year: '2018', 
      title: 'Международное признание', 
      description: 'Компания получила международную награду за инновационные решения в области устойчивого строительства и приняла участие в международной выставке в Дубае.',
      icon: <Award className="w-8 h-8 text-primary" />,
      details: 'TOWER UP вошла в число финалистов престижной международной премии в области архитектуры и устойчивого развития, представив свой флагманский проект экологичного здания.'
    },
    { 
      year: '2020', 
      title: 'Расширение деятельности', 
      description: 'Открытие новых офисов и выход на региональные рынки Центральной Азии. Запуск программы социальной ответственности и поддержки молодых архитекторов.',
      icon: <Target className="w-8 h-8 text-primary" />,
      details: 'Компания открыла представительства в Казахстане и Кыргызстане, запустила образовательную программу для студентов архитектурных вузов и учредила грантовую программу для молодых специалистов.'
    },
    { 
      year: '2023', 
      title: 'Технологический прорыв', 
      description: 'Внедрение передовых технологий умных домов и экологически чистых материалов в строительстве. Запуск инновационного исследовательского центра.',
      icon: <Rocket className="w-8 h-8 text-primary" />,
      details: 'В этом году начал работу научно-исследовательский центр TOWER UP, занимающийся разработкой собственных строительных технологий и материалов. Реализован первый в регионе полностью автономный энергоэффективный жилой комплекс.'
    }
  ];

  const achievements = [
    { number: "120+", label: "ЗАВЕРШЕННЫХ ПРОЕКТОВ" },
    { number: "15", label: "ЛЕТ НА РЫНКЕ" },
    { number: "98%", label: "ДОВОЛЬНЫХ КЛИЕНТОВ" },
    { number: "350+", label: "ПРОФЕССИОНАЛОВ В КОМАНДЕ" }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ИСТОРИЯ КОМПАНИИ" 
          breadcrumb="ИСТОРИЯ"
          bgImage="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2070&auto=format&fit=crop"
        />
        
        {/* Intro Section */}
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#161616] to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute top-1/3 left-10 w-52 h-52 bg-blue-500/5 rounded-full blur-2xl -z-0"></div>
          
          <div className="container mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Путь к совершенству</h2>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                История компании TOWER UP началась в 2010 году, когда группа энтузиастов и профессионалов строительной отрасли объединилась с общей целью — создавать не просто здания, а пространства, которые вдохновляют и служат поколениям.
              </p>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                За прошедшие годы мы превратились из небольшого стартапа в одну из ведущих строительных компаний региона, реализовав множество знаковых проектов и внедрив инновационные технологии, которые изменили облик современного Ташкента.
              </p>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-primary mr-3" />
                <span className="text-gray-300 italic">Более 15 лет создаем будущее</span>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-[#161616] overflow-hidden" ref={timelineRef}>
          <div className="container mx-auto px-6 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] bg-primary/5 rounded-full blur-3xl"></div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16 relative z-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ключевые этапы развития</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Познакомьтесь с важнейшими моментами нашей истории, которые определили развитие компании TOWER UP и позволили нам стать лидером рынка.
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto relative">
              {/* Vertical line for desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20"></div>
              
              {/* Animated dot on the timeline */}
              <motion.div 
                className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-4 w-4 bg-primary rounded-full shadow-lg shadow-primary/50 z-20"
                animate={{ 
                  y: ['0%', '100%'], 
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  times: [0, 0.95, 1]
                }}
              />
              
              {/* Timeline items */}
              {timeline.map((item, index) => (
                <motion.div 
                  key={index} 
                  className={`timeline-item relative mb-20 md:mb-32 opacity-0`}
                  initial="hidden"
                  whileInView={index % 2 === 0 ? "visible" : "visible"}
                  viewport={{ once: true, margin: "-100px" }}
                  variants={index % 2 === 0 ? fadeInRight : fadeInLeft}
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Year bubble */}
                    <div className="z-10 mb-4 md:mb-0 relative">
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
                        <div className="bg-primary text-white py-3 px-6 rounded-full font-bold shadow-lg flex items-center gap-3 relative">
                          <span>{item.year}</span>
                          <div className="bg-white/10 p-1.5 rounded-full">
                            {item.icon}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Content card */}
                    <motion.div 
                      className={`md:w-[calc(100%-120px)] bg-[#1E1E1E] p-6 rounded-lg shadow-lg border border-white/5 ${index % 2 === 0 ? 'md:ml-10' : 'md:mr-10'}`}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                      <p className="text-gray-400 mb-4">{item.description}</p>
                      
                      <div className="mt-4 bg-[#191919] rounded-md p-4 border-t border-white/10">
                        <h5 className="text-sm font-medium text-primary mb-2">Интересный факт:</h5>
                        <p className="text-sm text-gray-400">{item.details}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/projects">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 group">
                  <span>СМОТРЕТЬ НАШИ ПРОЕКТЫ</span>
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Achievements Section */}
        <section className="py-16 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Наши достижения</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {achievements.map((stat, index) => (
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
        
        {/* CTA Section */}
        <section className="py-16 bg-[#161616] relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto bg-[#1E1E1E] p-8 md:p-12 rounded-xl border border-white/10 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Станьте частью нашей истории</h3>
                  <p className="text-gray-300">
                    Присоединяйтесь к нашим инновационным проектам и создавайте будущее вместе с TOWER UP
                  </p>
                </div>
                
                <Link to="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                    Связаться с нами
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default History;
