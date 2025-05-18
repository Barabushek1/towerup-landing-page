import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Calendar, ArrowLeft, Maximize2, X, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import YouTubePlayer from '@/components/YouTubePlayer';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
  summary: string;
  created_at: string;
  updated_at: string;
  additional_images?: string[];
  youtube_video_url?: string | null;
  featured: boolean;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();

  const { data, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        console.log('Fetching news item with id:', id);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching news item:', error);
          throw error;
        }
        
        console.log('News item fetched successfully:', data);
        return data as NewsItem;
      } catch (error) {
        console.error('Error in news item query:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: false
  });

  useEffect(() => {
    if (data) {
      setNewsItem(data);
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!newsItem?.additional_images) return;
    
    const imagesCount = newsItem.additional_images.length;
    if (direction === 'next') {
      setCurrentImageIndex((currentImageIndex + 1) % imagesCount);
    } else {
      setCurrentImageIndex((currentImageIndex - 1 + imagesCount) % imagesCount);
    }
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, currentImageIndex]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-lg p-6 sm:p-8 border border-primary/10">
            <h1 className="text-2xl font-bold mb-4 font-benzin text-white">Новость не найдена</h1>
            <p className="mb-6 font-benzin">Запрашиваемая новость не существует или была удалена.</p>
            <Link to="/news">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Вернуться к новостям
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
      <NavBar />
      
      <PageHeader 
        title={newsItem?.title || ''}
        breadcrumb="НОВОСТИ"
      />
      
      <div className="bg-[#1a1a1a] py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumb className="text-sm sm:text-base">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">ГЛАВНАЯ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/news">НОВОСТИ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-white line-clamp-1">{newsItem.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <main>
        <div className="bg-[#1a1a1a] py-10 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <Link to="/news">
                <Button variant="outline" className="mb-6 flex items-center gap-2">
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Все новости</span>
                  <span className="inline sm:hidden">Назад</span>
                </Button>
              </Link>
              
              {/* Featured badge */}
              {newsItem?.featured && (
                <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  Важное
                </div>
              )}
              
              {/* Video badge if available */}
              {newsItem?.youtube_video_url && (
                <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 ml-2 flex items-center">
                  <Youtube className="h-4 w-4 mr-2" />
                  Видео
                </div>
              )}
              
              {/* YouTube video if available */}
              {newsItem?.youtube_video_url && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <YouTubePlayer videoUrl={newsItem.youtube_video_url} className="w-full" />
                </div>
              )}
              
              {/* Main image displayed as a regular image, not background */}
              {newsItem?.image_url && !newsItem?.youtube_video_url && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={newsItem.image_url} 
                    alt={newsItem.title}
                    className="w-full h-auto object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Нет+изображения';
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-benzin">{formatDate(newsItem.published_at)}</span>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none font-benzin">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">{newsItem.title}</h1>
                <p className="text-base sm:text-lg font-medium mb-6 text-slate-300">{newsItem.summary}</p>
                
                {newsItem.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-slate-200">{paragraph}</p>
                ))}
              </div>
              
              {/* Photo Gallery with full-screen capability */}
              {newsItem.additional_images && newsItem.additional_images.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 font-benzin">Фотогалерея</h2>
                  <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2 md:grid-cols-3'} gap-4`}>
                    {newsItem.additional_images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=Ошибка';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Lightbox for fullscreen image view */}
      {lightboxOpen && newsItem.additional_images && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={closeLightbox}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigateImage('prev')}
                className="text-white hover:bg-white/20 h-12 w-12"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigateImage('next')}
                className="text-white hover:bg-white/20 h-12 w-12"
              >
                <ArrowLeft className="h-6 w-6 transform rotate-180" />
              </Button>
            </div>
            
            <img
              src={newsItem.additional_images[currentImageIndex]}
              alt={`Фото ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Ошибка+загрузки';
              }}
            />
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentImageIndex + 1} / {newsItem.additional_images.length}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default NewsDetail;
