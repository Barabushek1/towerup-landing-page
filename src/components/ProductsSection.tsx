
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, imageUrl, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      className={cn(
        "scroll-animate-section relative group overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer",
        "bg-brand-dark border border-brand-dark/10 shadow-sm h-[400px]"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
      
      {/* Card image */}
      <div 
        className={cn(
          "absolute inset-0 bg-gray-200 transition-transform duration-700 ease-in-out",
          isHovered ? "scale-105" : "scale-100"
        )}
        style={{ 
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Card content */}
      <div className="relative h-full flex flex-col justify-end p-8 z-20">
        <h3 className={cn(
          "text-2xl font-medium text-white mb-2 transform transition-transform duration-300",
          isHovered ? "translate-y-0" : "translate-y-0"
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-white/80 mb-4 transform transition-all duration-300 ease-in-out max-h-0 overflow-hidden opacity-0",
          isHovered ? "max-h-[200px] opacity-100" : ""
        )}>
          {description}
        </p>
        
        <div className={cn(
          "flex items-center transform transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <span className="text-white/90 text-sm font-medium mr-2">Подробнее</span>
          <ChevronRight className="h-4 w-4 text-white/90" />
        </div>
      </div>
    </div>
  );
};

const ProductsSection: React.FC = () => {
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

  const products = [
    {
      title: "Умные решения для зданий",
      description: "Интегрированные системы для современного, эффективного и устойчивого управления зданиями.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Современное производство",
      description: "Современные производственные технологии для повышения эффективности и качества.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Решения устойчивой энергетики",
      description: "Системы возобновляемой энергии, разработанные для максимальной эффективности и минимального воздействия на окружающую среду.",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <section id="products" ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
          <div className="max-w-2xl mb-8 lg:mb-0 scroll-animate-section">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Наши Продукты
            </span>
            <h2 className="section-heading mb-6 text-brand-dark">
              Инновационные продукты, созданные для будущего
            </h2>
            <p className="section-subheading text-muted-foreground">
              Откройте для себя наш премиальный ассортимент продуктов, созданных с использованием передовых технологий и бескомпромиссных стандартов качества.
            </p>
          </div>
          
          <a 
            href="#contact" 
            className="flex items-center text-primary font-medium hover:underline scroll-animate-section"
          >
            <span>Все продукты</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              imageUrl={product.imageUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
