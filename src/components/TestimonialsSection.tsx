
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  delay: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, position, delay }) => (
  <div 
    className="scroll-animate-section glass-card p-8 relative"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <Quote className="h-10 w-10 text-primary/20 mb-6" />
    <p className="text-lg mb-8 text-brand-dark">{quote}</p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
      <div>
        <p className="font-medium text-brand-dark">{author}</p>
        <p className="text-sm text-muted-foreground">{position}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
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

  const testimonials = [
    {
      quote: "Работа с этой компанией преобразила наши операции. Их инновационные решения помогли нам достичь удивительных показателей эффективности при одновременном снижении затрат.",
      author: "Сара Иванова",
      position: "CTO, Global Innovations"
    },
    {
      quote: "Их внимание к деталям и приверженность качеству не имеют себе равных. Мы увидели существенную отдачу от инвестиций с момента внедрения их систем.",
      author: "Михаил Петров",
      position: "CEO, Future Technologies"
    },
    {
      quote: "Они не только обеспечили исключительные результаты, но и их постоянная поддержка и обслуживание клиентов были выдающимися. Настоящее партнерство.",
      author: "Александра Смирнова",
      position: "Директор по операциям, Eco Solutions"
    }
  ];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className="py-24 md:py-32 overflow-hidden relative"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-secondary/60 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-brand-secondary rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Отзывы
          </span>
          <h2 className="section-heading mb-6 text-brand-dark">
            Что говорят наши клиенты
          </h2>
          <p className="section-subheading mx-auto text-muted-foreground">
            Не верьте нам на слово. Послушайте компании и организации, которые на своем опыте убедились в том, какие изменения приносят наши решения.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
