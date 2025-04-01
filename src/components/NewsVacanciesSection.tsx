
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseNewsToNewsItem } from '@/utils/supabase-helpers';

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

const NewsVacanciesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching news for home page:', error);
          throw error;
        }

        console.log('Fetched news for home page:', data);
        
        if (data) {
          const mappedNews = data.map(item => mapSupabaseNewsToNewsItem(item));
          setNews(mappedNews);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Exception fetching news for home page:', error);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

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
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <NewsItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  date={formatDate(item.date)}
                  excerpt={item.excerpt}
                  imageUrl={item.image_url || undefined}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Пока нет новостей</p>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link 
              to="/news" 
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-benzin"
            >
              Все новости
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsVacanciesSection;
