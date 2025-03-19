
import React, { useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  Globe, 
  Shield, 
  BarChart, 
  Award, 
  Users 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="scroll-animate-section rounded-2xl bg-white border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
      <div className="text-primary">{icon}</div>
    </div>
    <h3 className="text-xl font-medium mb-3 text-brand-dark">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
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

  const features = [
    {
      icon: <Lightbulb className="h-7 w-7" />,
      title: "Инновационные решения",
      description: "Мы разрабатываем передовые решения, которые решают текущие задачи, предвидя будущие потребности."
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: "Глобальный охват",
      description: "Наши услуги распространяются через границы, расширяя возможности бизнеса по всему миру с местным опытом и глобальным пониманием."
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Надежная безопасность",
      description: "Мы внедряем надежные меры безопасности, обеспечивая защиту данных и операционную устойчивость."
    },
    {
      icon: <BarChart className="h-7 w-7" />,
      title: "Аналитика данных",
      description: "Превращайте свои данные в практические выводы с помощью наших расширенных аналитических возможностей."
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: "Качество и совершенство",
      description: "Мы поддерживаем самые высокие стандарты качества в каждом проекте, обеспечивая исключительные результаты."
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Экспертные консультации",
      description: "Наша команда специалистов предоставляет персонализированное руководство, адаптированное к уникальным потребностям вашего бизнеса."
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Наши Услуги
          </span>
          <h2 className="section-heading mb-6 text-brand-dark">
            Комплексные решения для современных задач
          </h2>
          <p className="section-subheading mx-auto text-muted-foreground">
            Мы предлагаем широкий спектр услуг, разработанных для того, чтобы помочь бизнесу процветать в сегодняшнем конкурентном ландшафте.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
