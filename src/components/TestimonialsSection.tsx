
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
    <p className="text-lg mb-8">{quote}</p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
      <div>
        <p className="font-medium">{author}</p>
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
      quote: "Working with this company has transformed our operations. Their innovative solutions have helped us achieve remarkable efficiency gains while reducing costs.",
      author: "Sarah Johnson",
      position: "CTO, Global Innovations"
    },
    {
      quote: "Their attention to detail and commitment to quality is unmatched. We've seen a substantial return on investment since implementing their systems.",
      author: "Michael Chen",
      position: "CEO, Future Technologies"
    },
    {
      quote: "Not only did they deliver exceptional results, but their ongoing support and customer service has been outstanding. A true partnership.",
      author: "Alexandra Rodriguez",
      position: "Operations Director, Eco Solutions"
    }
  ];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className="py-24 md:py-32 overflow-hidden relative"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-50/60 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-blue-100 rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="section-heading mb-6">
            What our clients say
          </h2>
          <p className="section-subheading mx-auto">
            Don't just take our word for it. Hear from the businesses and organizations that have experienced the difference our solutions make.
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
