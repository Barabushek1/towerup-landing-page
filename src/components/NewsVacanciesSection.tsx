import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, ChevronRight, Star, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCachedData } from '@/utils/cache-utils';
import { useLanguage } from '@/contexts/LanguageContext';
import YouTubePlayer from './YouTubePlayer';
interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  summary: string;
  image_url: string | null;
  featured: boolean;
  youtube_video_url?: string | null;
}
const NewsItemComponent: React.FC<{
  item: NewsItem;
  index: number;
}> = ({
  item,
  index
}) => {
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();
  const {
    t
  } = useLanguage();

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  return <Card className={cn("relative overflow-hidden border border-primary/20 shadow-md", "transition-all duration-500 hover:shadow-lg group h-full", "bg-slate-800 text-white")} style={{
    transitionDelay: `${index * 100}ms`
  }}>
      <div className="aspect-video w-full overflow-hidden">
        {item.youtube_video_url ? <YouTubePlayer videoUrl={item.youtube_video_url} /> : !imageError ? <img src={item.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImageError(true)} loading="lazy" /> : <div className="flex items-center justify-center w-full h-full bg-slate-700">
            <p className="text-white">{t('news.noImage')}</p>
          </div>}
      </div>
      
      {item.featured && <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full font-medium text-xs flex items-center shadow-lg">
          <Star className="h-3 w-3 mr-1 fill-white" />
          {t('news.featured')}
        </div>}

      {item.youtube_video_url && <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full font-medium text-xs flex items-center shadow-lg">
          <Youtube className="h-3 w-3 mr-1" />
          {t('news.video')}
        </div>}
      
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-benzin text-gray-300">{formatDate(item.published_at)}</span>
        </div>
        
        <h3 className="text-xl font-medium text-white mb-2 font-benzin line-clamp-2">
          {item.title}
        </h3>
      </CardHeader>
      
      <CardContent className="px-6 py-2">
        <p className="text-gray-300 mb-4 font-benzin line-clamp-3">{item.summary}</p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Link to={`/news/${item.id}`} className="inline-flex items-center text-primary font-medium hover:underline font-benzin group-hover:translate-x-1 transition-transform">
          <span>{t('news.readMore')}</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>;
};
const NewsLoadingSkeleton = () => {
  const {
    t
  } = useLanguage();
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
    {[1, 2, 3].map(i => <Card key={i} className="overflow-hidden border border-primary/10 shadow-sm bg-slate-800">
        <Skeleton className="h-48 w-full bg-slate-700" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
            <Skeleton className="h-4 w-24 bg-slate-700" />
          </div>
          <Skeleton className="h-7 w-3/4 mb-3 bg-slate-700" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-5/6 bg-slate-700" />
            <Skeleton className="h-4 w-4/6 bg-slate-700" />
          </div>
          <Skeleton className="h-6 w-24 mt-4 bg-slate-700" />
        </div>
      </Card>)}
  </div>;
};
const NewsVacanciesSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const {
    t
  } = useLanguage();

  // Fetch news from Supabase with caching for better performance
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news for homepage...');

        // Get news with caching
        const combinedNews = await getCachedData<NewsItem[]>('homepage_news', async () => {
          // First, try to get featured news
          const featuredQuery = await supabase.from('news').select('id, title, published_at, summary, image_url, featured').eq('featured', true).order('published_at', {
            ascending: false
          });
          if (featuredQuery.error) {
            console.error('Error fetching featured news:', featuredQuery.error);
            throw featuredQuery.error;
          }

          // Get featured news and ensure we have an array
          const featuredNews = featuredQuery.data || [];
          console.log(`Found ${featuredNews.length} featured news items`);

          // If we don't have enough featured news, get the most recent ones to fill
          let combinedResults = [...featuredNews];
          if (featuredNews.length < 3) {
            const remainingCount = 3 - featuredNews.length;
            console.log(`Fetching ${remainingCount} additional recent news items`);

            // Get the IDs of featured news to exclude them from the regular query
            const featuredIds = featuredNews.map(item => item.id);
            const regularQuery = await supabase.from('news').select('id, title, published_at, summary, image_url, featured').not('id', 'in', featuredIds.length > 0 ? `(${featuredIds.join(',')})` : '(null)').order('published_at', {
              ascending: false
            }).limit(remainingCount);
            if (regularQuery.error) {
              console.error('Error fetching regular news:', regularQuery.error);
              throw regularQuery.error;
            }

            // Combine featured and regular news
            combinedResults = [...featuredNews, ...(regularQuery.data || [])];
          }

          // Limit to 3 items in case we have more than 3 featured items
          return combinedResults.slice(0, 3);
        }, 60); // Cache for 1 hour

        setNews(combinedNews);
        console.log('Homepage news fetched, count:', combinedNews.length);
      } catch (err) {
        console.error('Exception in news fetch:', err);
        setError('An unexpected error occurred');
        toast({
          title: "Ошибка загрузки новостей",
          description: err instanceof Error ? err.message : "Неизвестная ошибка",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
  return <section id="news" className="py-24 md:py-32 overflow-hidden relative bg-neutral-950">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-slate-900/90 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-slate-700 rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium mb-6 font-benzin text-3xl">
            {t('home.news.title')}
          </span>
          
          <p className="text-lg text-slate-300 mx-auto font-benzin">
            {t('home.news.description')}
          </p>
        </div>
        
        <div className="mb-10">
          {loading ? <NewsLoadingSkeleton /> : error ? <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                {t('common.tryAgain')}
              </button>
            </div> : news.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {news.map((item, index) => <NewsItemComponent key={item.id} item={item} index={index} />)}
            </div> : <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-slate-400 mb-4">{t('news.notFound')}</p>
            </div>}
          
          <div className="mt-10 text-center">
            <Link to="/news" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-benzin">
              {t('home.news.all')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default NewsVacanciesSection;