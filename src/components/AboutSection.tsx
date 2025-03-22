
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Building, Clock, Car, Paintbrush, TrendingUp, Wrench } from 'lucide-react';

interface AdvantageCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc?: string;
  index: number;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({ title, description, icon, imageSrc, index }) => (
  <Card className="scroll-animate-section overflow-hidden transition-all duration-500 hover:shadow-xl border-none bg-white/80 backdrop-blur-sm"
       style={{ transitionDelay: `${index * 100}ms` }}>
    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
    <CardContent className="p-0">
      {imageSrc && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-md">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-brand-dark font-benzin">{title}</h3>
        <p className="text-muted-foreground font-benzin">{description}</p>
      </div>
    </CardContent>
  </Card>
);

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

  // Placeholder images - these should be replaced with actual images later
  const placeholderImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ];

  const advantages = [
    {
      title: "Всё нужное — рядом",
      description: "Школа, детский сад, зеленая зона, детские площадки и поликлиника в непосредственной близости от вашего дома",
      icon: <Building className="h-8 w-8" />,
      imageSrc: placeholderImages[0]
    },
    {
      title: "Рассрочка 0% до 2х лет",
      description: "Мы предлагаем самые выгодные условия рассрочки на рынке без скрытых комиссий",
      icon: <Clock className="h-8 w-8" />,
      imageSrc: placeholderImages[1]
    },
    {
      title: "Удобный паркинг",
      description: "Многоуровневый надземный паркинг с выделенными местами для каждой квартиры",
      icon: <Car className="h-8 w-8" />,
      imageSrc: placeholderImages[2]
    },
    {
      title: "Архитектура",
      description: "Авторская архитектурная концепция фасадов, разработанная ведущими дизайнерами",
      icon: <Paintbrush className="h-8 w-8" />,
      imageSrc: placeholderImages[3]
    },
    {
      title: "Инвестиционная привлекательность",
      description: "Ликвидный актив в востребованном районе с гарантированным ростом стоимости",
      icon: <TrendingUp className="h-8 w-8" />,
      imageSrc: placeholderImages[4]
    },
    {
      title: "Ремонт под ключ",
      description: "Мы предлагаем качественное выполнение ремонта квалифицированными специалистами от нашей компании",
      icon: <Wrench className="h-8 w-8" />,
      imageSrc: placeholderImages[5]
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Top Wave Separator */}
      <div className="absolute top-0 left-0 right-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Company Description */}
        <div className="text-center max-w-4xl mx-auto mb-20 scroll-animate-section bg-white/70 backdrop-blur-sm p-10 rounded-2xl shadow-lg">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 shadow-sm">
            О компании
          </span>
          <h2 className="section-heading mb-8 text-brand-dark font-benzin text-4xl md:text-5xl font-bold">
            TOWERUP
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 font-benzin leading-relaxed">
            Современная строительная компания, предлагающая полный спектр услуг: от проектирования до управления недвижимостью. 
            Мы создаём стильные и функциональные пространства, объединяя инновации и качество. 
            Наш приоритет — комфорт и удовлетворение потребностей клиентов.
          </p>
          <div className="flex justify-center gap-2">
            <span className="inline-block w-10 h-1 bg-primary rounded-full"></span>
            <span className="inline-block w-3 h-1 bg-primary/50 rounded-full"></span>
            <span className="inline-block w-1.5 h-1 bg-primary/30 rounded-full"></span>
          </div>
        </div>
        
        {/* Advantages Section */}
        <div className="mb-16">
          <div className="text-center mb-16 scroll-animate-section">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary uppercase font-benzin">
              НАШИ ПРЕИМУЩЕСТВА
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-16 bg-primary/30"></div>
              <h3 className="text-xl md:text-2xl font-semibold text-brand-dark font-benzin">
                TOWERUP
              </h3>
              <div className="h-[1px] w-16 bg-primary/30"></div>
            </div>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Мы стремимся создавать не просто здания, а пространства для жизни, работы и отдыха, которые превосходят ожидания
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <AdvantageCard
                key={index}
                title={advantage.title}
                description={advantage.description}
                icon={advantage.icon}
                imageSrc={advantage.imageSrc}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0 w-full transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#e2e8f0" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,149.3C672,160,768,160,864,138.7C960,117,1056,75,1152,64C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default AboutSection;
