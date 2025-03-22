
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Building, Clock, Car, Paintbrush, TrendingUp, Wrench } from 'lucide-react';

interface AdvantageCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({ title, description, icon, index }) => (
  <Card className={`scroll-animate-section overflow-hidden transition-all duration-500 hover:shadow-lg border-none`}
       style={{ transitionDelay: `${index * 100}ms` }}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
    <CardContent className="p-6">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-medium mb-2 text-brand-dark font-benzin">{title}</h3>
      <p className="text-muted-foreground text-sm font-benzin">{description}</p>
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

  const advantages = [
    {
      title: "Всё нужное — рядом",
      description: "Школа, детский сад, зеленая зона, детские площадки и поликлиника",
      icon: <Building className="h-7 w-7" />
    },
    {
      title: "Рассрочка 0% до 2х лет",
      description: "Самые выгодные условия!",
      icon: <Clock className="h-7 w-7" />
    },
    {
      title: "Удобный паркинг",
      description: "Многоуровневый надземный паркинг",
      icon: <Car className="h-7 w-7" />
    },
    {
      title: "Архитектура",
      description: "Авторская архитектурная концепция фасадов",
      icon: <Paintbrush className="h-7 w-7" />
    },
    {
      title: "Инвестиционная привлекательность",
      description: "Ликвидный актив в востребованном районе",
      icon: <TrendingUp className="h-7 w-7" />
    },
    {
      title: "Ремонт под ключ",
      description: "Мы предлагаем качественное выполнение ремонта квалифицированными специалистами от нашей компании",
      icon: <Wrench className="h-7 w-7" />
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Company Description */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            О компании
          </span>
          <h2 className="section-heading mb-6 text-brand-dark font-benzin text-3xl md:text-4xl font-bold">
            TOWERUP
          </h2>
          <p className="text-muted-foreground text-lg mb-8 font-benzin">
            Современная строительная компания, предлагающая полный спектр услуг: от проектирования до управления недвижимостью. 
            Мы создаём стильные и функциональные пространства, объединяя инновации и качество. 
            Наш приоритет — комфорт и удовлетворение потребностей клиентов.
          </p>
        </div>
        
        {/* Advantages Section */}
        <div className="mb-16">
          <div className="text-center mb-12 scroll-animate-section">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary uppercase font-benzin">
              НАШИ ПРЕИМУЩЕСТВА
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-brand-dark font-benzin">
              TOWERUP
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <AdvantageCard
                key={index}
                title={advantage.title}
                description={advantage.description}
                icon={advantage.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Waves */}
      <div className="relative mt-16">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L48 8.875C96 17.75 192 35.5 288 53.25C384 71 480 88.75 576 80.5C672 71 768 35.5 864 26.625C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="rgba(248, 250, 252, 0.8)"/>
          <path d="M0 40L48 44.375C96 48.75 192 57.5 288 62.125C384 66.5 480 66.5 576 57.5C672 48.75 768 30.875 864 26.5C960 22.125 1056 30.875 1152 35.5C1248 40 1344 40 1392 40H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V40Z" fill="rgba(241, 245, 249, 0.9)"/>
          <path d="M0 80L48 75.625C96 71.25 192 62.5 288 57.875C384 53.5 480 53.5 576 62.5C672 71.25 768 89.125 864 93.5C960 97.875 1056 89.125 1152 84.5C1248 80 1344 80 1392 80H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V80Z" fill="rgba(226, 232, 240, 1)"/>
        </svg>
      </div>
    </section>
  );
};

export default AboutSection;
