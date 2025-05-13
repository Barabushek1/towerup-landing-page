
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  rating: number;
  delay: number;
}

interface TestimonialData {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  is_active: boolean;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, position, rating, delay }) => (
  <div 
    className="scroll-animate-section glass-card p-8 relative h-full"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <Quote className="h-10 w-10 text-primary/20 mb-6" />
    <p className="text-lg mb-8 text-brand-dark">{quote}</p>
    <div className="flex items-start flex-col mt-auto">
      <div className="flex mb-4">
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className="h-5 w-5 text-primary fill-primary mr-1" />
        ))}
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
        <div>
          <p className="font-medium text-brand-dark">{author}</p>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }
        
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error in testimonials fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
    
    // Observer for scroll animations
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

  // Fallback data if no testimonials found in database
  const fallbackTestimonials = [
    {
      id: '1',
      author: "Сара Иванова",
      position: "CTO, Global Innovations",
      content: "Работа с этой компанией преобразила наши операции. Их инновационные решения помогли нам достичь удивительных показателей эффективности при одновременном снижении затрат.",
      rating: 5,
      is_active: true
    },
    {
      id: '2',
      author: "Михаил Петров",
      position: "CEO, Future Technologies",
      content: "Их внимание к деталям и приверженность качеству не имеют себе равных. Мы увидели существенную отдачу от инвестиций с момента внедрения их систем.",
      rating: 5,
      is_active: true
    },
    {
      id: '3',
      author: "Александра Смирнова",
      position: "Директор по операциям, Eco Solutions",
      content: "Они не только обеспечили исключительные результаты, но и их постоянная поддержка и обслуживание клиентов были выдающимися. Настоящее партнерство.",
      rating: 5,
      is_active: true
    }
  ];

  const displayedTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

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
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {displayedTestimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <TestimonialCard
                  quote={testimonial.content}
                  author={testimonial.author}
                  position={testimonial.position}
                  rating={testimonial.rating}
                  delay={index * 100}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
