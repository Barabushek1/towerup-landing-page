
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Calendar, ArrowLeft, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminData, NewsItem } from '@/contexts/AdminDataContext';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news } = useAdminData();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (news && id) {
      const item = news.find(item => item.id === id);
      if (item) {
        setNewsItem(item);
      }
      setLoading(false);
    }
  }, [news, id]);

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
    if (!newsItem?.additionalImages) return;
    
    const imagesCount = newsItem.additionalImages.length;
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

  if (loading) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-6">
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
        <main className="py-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-lg p-8 border border-primary/10">
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
        title={newsItem.title}
        breadcrumb="НОВОСТИ"
      />
      
      <div className="bg-[#1a1a1a] py-8">
        <div className="container mx-auto px-6">
          <Breadcrumb>
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
                <span className="text-white">{newsItem.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <main>
        <div className="bg-[#1a1a1a] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Link to="/news">
                <Button variant="outline" className="mb-6 flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Все новости
                </Button>
              </Link>
              
              {/* Main image displayed as a regular image, not background */}
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={newsItem.imageUrl} 
                  alt={newsItem.title}
                  className="w-full h-auto object-cover" 
                />
              </div>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-benzin">{newsItem.date}</span>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none font-benzin">
                <p className="text-lg font-medium mb-6">{newsItem.excerpt}</p>
                
                {newsItem.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Photo Gallery with full-screen capability */}
              {newsItem.additionalImages && newsItem.additionalImages.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 font-benzin">Фотогалерея</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {newsItem.additionalImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      {lightboxOpen && newsItem.additionalImages && (
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
              src={newsItem.additionalImages[currentImageIndex]}
              alt={`Фото ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentImageIndex + 1} / {newsItem.additionalImages.length}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default NewsDetail;
