
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Building, Users, Cpu, ShieldCheck, Clock, Award } from 'lucide-react';

interface AdvantageItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const AdvantageItem: React.FC<AdvantageItemProps> = ({ icon, title, description, index }) => {
  return (
    <div className="scroll-animate-section" style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 mb-4 text-white flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-center max-w-sm">{description}</p>
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
      number: "25",
      label: "Лет на Рынке",
      icon: <Clock className="w-10 h-10" />
    },
    {
      number: "20",
      label: "Производств",
      icon: <Award className="w-10 h-10" />
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-[#1f1f1f] text-white">
      {/* About Company Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side with image and big number */}
          <div className="relative scroll-animate-section">
            <div className="bg-primary absolute top-0 left-0 w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] z-0"></div>
            <div className="relative z-10 ml-5 mt-5">
              <div className="overflow-hidden">
                <img 
                  src="/public/placeholder.svg" 
                  alt="Company building" 
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="text-white text-8xl lg:text-9xl font-bold">25</div>
                <div className="text-white text-xl uppercase font-medium text-center">ЛЕТ</div>
                <div className="text-white text-sm uppercase text-center mt-2">НА РЫНКЕ УЗБЕКИСТАНА!</div>
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
            
            <Button className="bg-primary hover:bg-primary/80 text-white px-8">
              УЗНАТЬ БОЛЬШЕ
            </Button>
          </div>
        </div>
      </div>
      
      {/* Advantages Section with dark background */}
      <div className="bg-[#1a1a1a] py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-14">
            <div className="text-7xl text-[#2a2a2a] font-bold mb-8">01</div>
            
            <div className="flex items-center">
              <h2 className="text-primary uppercase font-medium text-xl tracking-wider">НАШИ ПРЕИМУЩЕСТВА</h2>
              <div className="h-[1px] w-20 bg-primary/50 ml-6"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
            <Button className="bg-transparent hover:bg-primary/10 text-white border border-white/20 px-8">
              УЗНАТЬ БОЛЬШЕ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
