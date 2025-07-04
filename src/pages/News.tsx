import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCachedData } from '@/utils/cache-utils';

interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  summary: string;
  image_url: string | null;
  content: string;
  featured: boolean;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Use sessionStorage to cache the count so we don't keep fetching it
        let totalCount = 0;
        const cachedCountStr = sessionStorage.getItem('news_total_count');
        
        if (!cachedCountStr) {
          // First get the count for pagination
          const { count, error: countError } = await supabase
            .from('news')
            .select('*', { count: 'exact', head: true });
          
          if (countError) {
            console.error('Error getting news count:', countError);
            throw countError;
          }
          
          totalCount = count || 0;
          // Cache the count for future use
          sessionStorage.setItem('news_total_count', totalCount.toString());
        } else {
          totalCount = parseInt(cachedCountStr, 10);
        }
        
        const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        // Then fetch the actual data for the current page
        // Cache key includes page number to cache each page separately
        const key = `news_page_${currentPage}`;
        const pageData = await getCachedData<NewsItem[]>(key, async () => {
          const { data, error } = await supabase
            .from('news')
            .select('id, title, published_at, summary, image_url, content, featured')
            .order('published_at', { ascending: false })
            .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
          
          if (error) {
            console.error('Error fetching news:', error);
            throw error;
          }
          
          return data || [];
        }, 60); // Cache for 1 hour
        
        setNews(pageData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in news fetching:', error);
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [currentPage]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to calculate how many columns to use based on screen size
  const getGridColumns = () => {
    if (isMobile) {
      return "grid-cols-1";
    } else {
      return "md:grid-cols-2";
    }
  };

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="НОВОСТИ" 
          breadcrumb="НОВОСТИ"
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : news.length > 0 ? (
                <div className={`grid ${getGridColumns()} gap-6 sm:gap-8`}>
                  {news.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative overflow-hidden rounded-xl border border-primary/10 bg-slate-800/40 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image_url || 'https://placehold.co/640x360?text=Нет+изображения'} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/640x360?text=Нет+изображения';
                          }}
                        />
                      </div>
                      {item.featured && (
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                          Важное
                        </div>
                      )}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center text-slate-400 text-sm mb-3">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{formatDate(item.published_at)}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-200 mb-3 font-benzin line-clamp-2">{item.title}</h3>
                        <p className="text-slate-400 mb-4 line-clamp-3 text-sm sm:text-base">{item.summary}</p>
                        <Link
                          to={`/news/${item.id}`}
                          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          <span>Читать далее</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-2">Новости не найдены</h3>
                  <p className="text-slate-400">В данный момент новости отсутствуют. Пожалуйста, проверьте позже.</p>
                </div>
              )}
              
              {totalPages > 1 && (
                <Pagination className="mt-10">
                  <PaginationContent className="flex-wrap justify-center">
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          className="cursor-pointer" 
                          onClick={() => handlePageChange(currentPage - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }).map((_, index) => {
                      // On mobile, show limited pagination numbers
                      if (isMobile) {
                        // Always show first, current, and last page
                        if (
                          index === 0 || 
                          index === currentPage - 1 || 
                          index === totalPages - 1 || 
                          index === currentPage - 2 || 
                          index === currentPage
                        ) {
                          return (
                            <PaginationItem key={index}>
                              <PaginationLink 
                                className="cursor-pointer"
                                onClick={() => handlePageChange(index + 1)}
                                isActive={currentPage === index + 1}
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (index === 1 && currentPage > 3) || 
                          (index === totalPages - 2 && currentPage < totalPages - 2)
                        ) {
                          // Show ellipsis
                          return <PaginationItem key={index}>...</PaginationItem>;
                        } else {
                          return null;
                        }
                      } else {
                        // On desktop, show all pagination numbers
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink 
                              className="cursor-pointer"
                              onClick={() => handlePageChange(index + 1)}
                              isActive={currentPage === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    })}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          className="cursor-pointer"
                          onClick={() => handlePageChange(currentPage + 1)} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
          
          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
