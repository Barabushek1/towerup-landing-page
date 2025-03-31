
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Building, Users, Cpu, ShieldCheck, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdvantageItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const AdvantageItem: React.FC<AdvantageItemProps> = ({ icon, title, description, index }) => {
  return (
    <div 
      className="scroll-animate-section bg-[#222222] p-6 rounded-lg border border-white/5 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" 
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-5">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300 flex-grow">{description}</p>
      </div>
    </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side with image and big number */}
          <div className="relative scroll-animate-section">
            <div className="bg-primary absolute top-0 left-0 w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] z-0"></div>
            <div className="relative z-10 ml-5 mt-5">
              <div className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1741540420762-91a78becdf92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Company building" 
                  className="w-full h-[300px] lg:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
          
          {/* Right side with company description */}
          <div className="scroll-animate-section">
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
              <Button className="bg-primary hover:bg-primary/80 text-white px-8">
                УЗНАТЬ БОЛЬШЕ
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Advantages Section with dark background */}
      <div className="bg-[#212121] py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-14">
            <div className="flex items-center">
              <h2 className="text-primary uppercase font-medium text-xl tracking-wider">НАШИ ПРЕИМУЩЕСТВА</h2>
              <div className="h-[1px] w-20 bg-primary/50 ml-6"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((advantage, index) => (
              <AdvantageItem
                key={index}
                icon={advantage.icon}
                title={advantage.title}
                description={advantage.description}
                index={index}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-14">
            <Link to="/about">
              <Button className="bg-transparent hover:bg-primary/10 text-white border border-white/20 px-8">
                УЗНАТЬ БОЛЬШЕ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
