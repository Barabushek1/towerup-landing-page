
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Building, Users, Cpu, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AdvantageItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const AdvantageItem: React.FC<AdvantageItemProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div 
      className="scroll-animate-section bg-[#222222] p-6 rounded-lg border border-white/5 shadow-lg h-full"
      variants={fadeInUp}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        borderColor: "rgba(255, 255, 255, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex flex-col h-full">
        <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mb-5 transform transition-all duration-300 group-hover:scale-110">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300 flex-grow">{description}</p>
        
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
          <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Подробнее</span>
            <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elementsToObserve = sectionRef.current?.querySelectorAll('.scroll-animate-section');
    elementsToObserve?.forEach((el) => observer.observe(el));
    
    return () => {
      elementsToObserve?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const advantages = [
    {
      icon: <Building className="w-10 h-10" />,
      title: "ПРОФЕССИОНАЛИЗМ",
      description: "Основа нашего профессионализма - сохранение собственных традиций и использование мировых инноваций."
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "ОПЫТ КОМПАНИИ",
      description: "Нам не приходится доказывать качество нашей продукции. Ваше признание делает это за нас."
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: "ОБОРУДОВАНИЕ",
      description: "Технологическое превосходство используемого нами оборудования является элементом отличия компании TOWERUP."
    }
  ];

  const stats = [
    {
      number: "350 000",
      label: "м², производственная площадь",
      icon: <Building className="w-10 h-10" />
    },
    {
      number: "32",
      label: "Страны Экспорта",
      icon: <ShieldCheck className="w-10 h-10" />
    },
    {
      number: "20",
      label: "Производств",
      icon: <Award className="w-10 h-10" />
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-[#1a1a1a] text-white">
      {/* About Company Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Left side with image and big number */}
          <motion.div 
            className="relative scroll-animate-section"
            variants={fadeInUp}
          >
            <div className="bg-primary absolute top-0 left-0 w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] z-0 opacity-80 blur-sm"></div>
            <div className="relative z-10 ml-5 mt-5">
              <motion.div 
                className="overflow-hidden rounded-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1741540420762-91a78becdf92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Company building" 
                  className="w-full h-[300px] lg:h-[400px] object-cover transition-transform duration-700 hover:scale-105 shadow-xl"
                />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right side with company description */}
          <motion.div 
            className="scroll-animate-section"
            variants={fadeInUp}
          >
            <div className="mb-5 flex items-center">
              <span className="text-primary uppercase font-medium text-sm tracking-wider">О КОМПАНИИ</span>
              <div className="h-[1px] w-32 bg-primary/50 ml-4"></div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Инновационные<br />
              решения для современного<br />
              строительства
            </h2>
            
            <div className="h-1 w-16 bg-primary mb-8"></div>
            
            <p className="text-gray-300 leading-relaxed mb-10">
              Располагая крупнейшим в Средней Азии автоматизированным производственным комплексом, компания TOWERUP предлагает только современные решения, качество и надёжность которых проверены временем.
            </p>
            
            <Link to="/about">
              <Button className="bg-primary hover:bg-primary/80 text-white px-8 group">
                <span>УЗНАТЬ БОЛЬШЕ</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Advantages Section with dark background */}
      <div className="bg-[#212121] py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#1a1a1a] to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl -z-0"></div>
      
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-14">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-primary uppercase font-medium text-xl tracking-wider">НАШИ ПРЕИМУЩЕСТВА</h2>
              <div className="h-[1px] w-20 bg-primary/50 ml-6"></div>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {advantages.map((advantage, index) => (
              <AdvantageItem
                key={index}
                icon={advantage.icon}
                title={advantage.title}
                description={advantage.description}
                index={index}
              />
            ))}
          </motion.div>
          
          <motion.div 
            className="flex justify-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/about">
              <Button className="bg-transparent hover:bg-primary/10 text-white border border-white/20 px-8 group">
                <span>УЗНАТЬ БОЛЬШЕ</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
