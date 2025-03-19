
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
    <h3 className="text-xl font-medium mb-3">{title}</h3>
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
      title: "Innovative Solutions",
      description: "We develop forward-thinking solutions that address current challenges while anticipating future needs."
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: "Global Reach",
      description: "Our services extend across borders, empowering businesses worldwide with local expertise and global insights."
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Reliable Security",
      description: "We implement robust security measures, ensuring data protection and operational resilience."
    },
    {
      icon: <BarChart className="h-7 w-7" />,
      title: "Data Analytics",
      description: "Transform your data into actionable insights with our advanced analytics capabilities."
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards of quality in every project, delivering exceptional results."
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Expert Consultation",
      description: "Our team of specialists provides personalized guidance tailored to your unique business needs."
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="section-heading mb-6">
            Comprehensive solutions for modern challenges
          </h2>
          <p className="section-subheading mx-auto">
            We offer a wide range of services designed to help businesses thrive in today's competitive landscape.
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
