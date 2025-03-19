
import React, { useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';

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
    "Innovative approach to business",
    "Commitment to sustainability",
    "Industry-leading expertise",
    "Global reach with local understanding",
    "Customer-centric solutions",
    "Continuous improvement mindset"
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="scroll-animate-section">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="section-heading mb-6">We create innovative solutions for a better future</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Founded with a vision to transform how businesses operate, we've grown into a global leader in our industry. Our commitment to excellence and innovation drives everything we do.
            </p>
            
            <div className="space-y-4 mb-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <p>{advantage}</p>
                </div>
              ))}
            </div>
            
            <a 
              href="#services" 
              className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 transform transition hover:-translate-y-0.5 button-hover-effect"
            >
              Our Services
            </a>
          </div>
          
          {/* Image/Visual Element */}
          <div className="relative">
            <div className="scroll-animate-section w-full h-[400px] md:h-[600px] bg-gray-100 rounded-2xl overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-5/6 h-5/6 bg-primary/10 rounded-2xl"></div>
              <div className="absolute inset-0 glass-card m-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-medium mb-4">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To provide innovative solutions that empower businesses and individuals to achieve their full potential in a rapidly changing world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
