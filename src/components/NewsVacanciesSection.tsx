
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Fetch news with no RLS restrictions (public access)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news for homepage...');
        
        // Remove any auth headers for anonymous access
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching news:', error);
          setError('Failed to load news');
          toast({
            title: "Ошибка загрузки новостей",
            description: error.message,
            variant: "destructive"
          });
          throw error;
        }
        
        console.log('Homepage news fetched, count:', data?.length);
        console.log('News data:', data);
        setNews(data || []);
      } catch (err) {
        console.error('Exception in news fetch:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section 
      id="news" 
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
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {news.map((item, index) => (
                <NewsItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  date={formatDate(item.published_at)}
                  excerpt={item.summary}
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
