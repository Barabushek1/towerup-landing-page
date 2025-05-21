
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  is_active: boolean;
}

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          throw error;
        }
        
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // If no active testimonials, don't render the section
  if (!loading && testimonials.length === 0) {
    return null;
  }

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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.content}
                author={testimonial.author}
                position={testimonial.position}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
