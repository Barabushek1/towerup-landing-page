
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  summary: string;
  image_url: string | null;
}

const NewsItemComponent: React.FC<{ item: NewsItem; index: number }> = ({ item, index }) => {
  const [imageError, setImageError] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Card 
      className={cn(
        "scroll-animate-section relative overflow-hidden border border-primary/10 shadow-sm bg-background",
        "transition-all duration-500 hover:shadow-md group h-full"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="aspect-video w-full overflow-hidden">
        {!imageError ? (
          <img
            src={item.image_url || 'https://placehold.co/640x360?text=Нет+изображения'}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-800/50">
            <p className="text-sm text-slate-400">Нет изображения</p>
          </div>
        )}
      </div>
      
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-benzin">{formatDate(item.published_at)}</span>
        </div>
        
        <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin line-clamp-2">{item.title}</h3>
      </CardHeader>
      
      <CardContent className="px-6 py-2">
        <p className="text-muted-foreground mb-4 font-benzin line-clamp-3">{item.summary}</p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Link 
          to={`/news/${item.id}`}
          className="inline-flex items-center text-primary font-medium hover:underline font-benzin group-hover:translate-x-1 transition-transform"
        >
          <span>Подробнее</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

const NewsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden border border-primary/10 shadow-sm bg-background">
        <Skeleton className="h-48 w-full" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-7 w-3/4 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-6 w-24 mt-4" />
        </div>
      </Card>
    ))}
  </div>
);

const NewsVacanciesSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news directly from Supabase
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news for homepage...');
        
        const { data, error } = await supabase
          .from('news')
          .select('id, title, published_at, summary, image_url')
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
          return;
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
            <NewsLoadingSkeleton />
          ) : error ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
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
                <NewsItemComponent
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
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
