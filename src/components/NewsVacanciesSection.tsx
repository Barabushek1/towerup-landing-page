
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, Briefcase, ChevronRight, Newspaper } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NewsItemProps {
  title: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
  index: number;
}

const NewsItem: React.FC<NewsItemProps> = ({ title, date, excerpt, imageUrl, index }) => {
  return (
    <div
      className={cn(
        "scroll-animate-section relative overflow-hidden rounded-lg border border-primary/10 shadow-sm bg-background",
        "transition-all duration-500 hover:shadow-md"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-benzin">{date}</span>
        </div>
        
        <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">{title}</h3>
        <p className="text-muted-foreground mb-4 font-benzin">{excerpt}</p>
        
        <a 
          href="#" 
          className="inline-flex items-center text-primary font-medium hover:underline font-benzin"
        >
          <span>Подробнее</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

interface VacancyItemProps {
  title: string;
  location: string;
  salary: string;
  type: string;
  index: number;
}

const VacancyItem: React.FC<VacancyItemProps> = ({ title, location, salary, type, index }) => {
  return (
    <div
      className={cn(
        "scroll-animate-section relative overflow-hidden rounded-lg border border-primary/10 p-6 shadow-sm bg-background",
        "transition-all duration-300 hover:shadow-md"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">{title}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-benzin">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-benzin">{type}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="font-medium text-brand-primary font-benzin">{salary}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-muted">
        <a 
          href="#contact" 
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-benzin"
        >
          <span>Откликнуться</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const NewsVacanciesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("news");
  
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

  const news = [
    {
      title: "Начало строительства нового жилого комплекса в центре города",
      date: "15 июня 2023",
      excerpt: "Мы рады сообщить о начале реализации масштабного проекта в центральном районе, который обеспечит город современным и комфортным жильем.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Завершение проекта реконструкции исторического здания",
      date: "28 мая 2023",
      excerpt: "Успешно завершены работы по реконструкции исторического здания XIX века с сохранением его архитектурной ценности и добавлением современных элементов.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Внедрение новых экологичных технологий строительства",
      date: "10 мая 2023",
      excerpt: "Наша компания начала использование инновационных экологически чистых материалов и технологий в строительстве, что значительно снижает воздействие на окружающую среду.",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const vacancies = [
    {
      title: "Главный инженер проекта",
      location: "Москва",
      salary: "от 150 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Архитектор",
      location: "Санкт-Петербург",
      salary: "от 120 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Прораб",
      location: "Москва",
      salary: "от 100 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Инженер-конструктор",
      location: "Дистанционно",
      salary: "от 90 000 ₽",
      type: "Полная занятость"
    }
  ];

  return (
    <section 
      id="news" 
      ref={sectionRef} 
      className="py-24 md:py-32 overflow-hidden relative"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-secondary/60 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-brand-secondary rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 font-benzin">
            Новости и Вакансии
          </span>
          <h2 className="section-heading mb-6 text-brand-dark font-benzin">
            Будьте в курсе наших последних событий
          </h2>
          <p className="section-subheading mx-auto text-muted-foreground font-benzin">
            Следите за новостями компании и открытыми вакансиями для присоединения к нашей команде профессионалов.
          </p>
        </div>
        
        <div className="mb-10 flex justify-center scroll-animate-section">
          <Tabs defaultValue="news" className="w-full max-w-3xl" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="news" className="flex items-center gap-2 font-benzin">
                <Newspaper className="h-4 w-4" />
                Новости
              </TabsTrigger>
              <TabsTrigger value="vacancies" className="flex items-center gap-2 font-benzin">
                <Briefcase className="h-4 w-4" />
                Вакансии
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="news" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.map((item, index) => (
                  <NewsItem
                    key={index}
                    title={item.title}
                    date={item.date}
                    excerpt={item.excerpt}
                    imageUrl={item.imageUrl}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <a 
                  href="#" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-benzin"
                >
                  Все новости
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="vacancies" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vacancies.map((item, index) => (
                  <VacancyItem
                    key={index}
                    title={item.title}
                    location={item.location}
                    salary={item.salary}
                    type={item.type}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <a 
                  href="#" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-benzin"
                >
                  Все вакансии
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default NewsVacanciesSection;
