
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { mapSupabaseNewsToNewsItem, safelyMapArray } from '@/utils/supabase-helpers';

interface NewsItemProps {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
  index: number;
}

const NewsItem: React.FC<NewsItemProps> = ({ id, title, date, excerpt, imageUrl, index }) => {
  return (
    <div
      className={cn(
        "scroll-animate-section relative overflow-hidden rounded-lg border border-primary/10 shadow-sm bg-background",
        "transition-all duration-500 hover:shadow-md group"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/640x360?text=Нет+изображения';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-benzin">{date}</span>
        </div>
        
        <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin">{title}</h3>
        <p className="text-muted-foreground mb-4 font-benzin line-clamp-3">{excerpt}</p>
        
        <Link 
          to={`/news/${id}`}
          className="inline-flex items-center text-primary font-medium hover:underline font-benzin group-hover:translate-x-1 transition-transform"
        >
          <span>Подробнее</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  summary: string;
  image_url?: string;
  featured?: boolean;
}

const NewsVacanciesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Example news data (will be shown if no data from Supabase)
  const exampleNews: NewsItem[] = [
    {
      id: "example_1",
      title: "Старт продаж новых квартир в ЖК Tower Up",
      published_at: "2025-03-15T00:00:00Z",
      summary: "Рады сообщить о старте продаж новой очереди квартир в жилом комплексе Tower Up. Доступны 1-, 2- и 3-комнатные квартиры с современной планировкой и высококачественной отделкой.",
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      featured: true
    },
    {
      id: "example_2",
      title: "Ход строительства ЖК Tower Up: март 2025",
      published_at: "2025-03-10T00:00:00Z",
      summary: "Представляем ежемесячный отчет о строительстве жилого комплекса Tower Up. Завершены основные монолитные работы, начата отделка фасадов. Строительство ведется строго по графику.",
      image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      featured: true
    },
    {
      id: "example_3",
      title: "Обновление инфраструктуры района Tower Up",
      published_at: "2025-02-28T00:00:00Z",
      summary: "В рамках развития территории вокруг ЖК Tower Up, компания TOWERUP инвестирует в создание современной инфраструктуры: парки, детские площадки, торговые центры и спортивные объекты.",
      image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      featured: true
    }
  ];
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching news from Supabase...');
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching news:', error);
          setError(error.message);
          throw error;
        }
        
        console.log('News data fetched:', data);
        if (data && data.length > 0) {
          const mappedNews = data.map(item => ({
            id: item.id,
            title: item.title,
            published_at: item.published_at,
            summary: item.summary,
            image_url: item.image_url,
            featured: item.featured
          }));
          setNews(mappedNews);
        } else {
          // Use example news if no data from Supabase
          setNews(exampleNews);
        }
      } catch (error) {
        console.error('Error:', error);
        // Use example news on error
        setNews(exampleNews);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Filter featured news or get the latest 3 if none are featured
  const displayNews = isLoading 
    ? [] 
    : (news.filter(item => item.featured).length > 0 
        ? news.filter(item => item.featured).slice(0, 3) 
        : news.slice(0, 3));

  return (
    <section 
      id="news" 
      ref={sectionRef} 
      className="py-24 md:py-32 overflow-hidden relative"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-slate-800/60 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-slate-700 rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 scroll-animate-section">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 font-benzin">
            Новости
          </span>
          <h2 className="section-heading mb-6 text-slate-200 font-benzin">
            Будьте в курсе наших последних событий
          </h2>
          <p className="section-subheading mx-auto text-muted-foreground font-benzin">
            Следите за новостями компании и оставайтесь в курсе последних проектов и достижений
          </p>
        </div>
        
        <div className="mb-10 scroll-animate-section">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
              <p className="text-red-400">Ошибка загрузки данных: {error}</p>
              <Button 
                onClick={() => {
                  setIsLoading(true);
                  setNews([]);
                  const fetchNews = async () => {
                    try {
                      const { data, error } = await supabase
                        .from('news')
                        .select('*')
                        .order('published_at', { ascending: false });
                      
                      if (error) throw error;
                      
                      if (data && data.length > 0) {
                        const mappedNews = data.map(item => ({
                          id: item.id,
                          title: item.title,
                          published_at: item.published_at,
                          summary: item.summary,
                          image_url: item.image_url,
                          featured: item.featured
                        }));
                        setNews(mappedNews);
                      } else {
                        // Use example news if no data from Supabase
                        setNews(exampleNews);
                      }
                      
                      setError(null);
                    } catch (err: any) {
                      console.error('Error refetching news:', err);
                      setError(err.message);
                      // Use example news on error
                      setNews(exampleNews);
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchNews();
                }}
                className="mt-4"
                variant="outline"
              >
                Попробовать снова
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayNews.map((item, index) => (
                  <NewsItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    date={formatDate(item.published_at)}
                    excerpt={item.summary}
                    imageUrl={item.image_url}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  to="/news" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-benzin"
                >
                  Все новости
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsVacanciesSection;
