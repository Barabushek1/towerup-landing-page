
import React from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
}

const News: React.FC = () => {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as NewsItem[];
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Fallback news data
  const displayNews = news.length > 0 ? news : [
    {
      id: "default_1",
      title: "Начало строительства нового жилого комплекса в центре города",
      date: "15 июня 2023",
      excerpt: "Мы рады сообщить о начале реализации масштабного проекта в центральном районе, который обеспечит город современным и комфортным жильем.",
      image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: ""
    },
    {
      id: "default_2",
      title: "Завершение проекта реконструкции исторического здания",
      date: "28 мая 2023",
      excerpt: "Успешно завершены работы по реконструкции исторического здания XIX века с сохранением его архитектурной ценности и добавлением современных элементов.",
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: ""
    },
    {
      id: "default_3",
      title: "Внедрение новых экологичных технологий строительства",
      date: "10 мая 2023",
      excerpt: "Наша компания начала использование инновационных экологически чистых материалов и технологий в строительстве, что значительно снижает воздействие на окружающую среду.",
      image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: ""
    },
    {
      id: "default_4",
      title: "Получение международного сертификата качества",
      date: "5 мая 2023",
      excerpt: "Наша компания получила международный сертификат качества ISO 9001, что подтверждает высокие стандарты нашей работы и приверженность к качеству.",
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: ""
    }
  ];

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
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                  <div className="col-span-2 text-center py-20">
                    <div className="animate-spin h-10 w-10 border-t-2 border-primary rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-400">Загрузка новостей...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-2 text-center py-20">
                    <p className="text-red-400">Произошла ошибка при загрузке новостей. Пожалуйста, попробуйте позже.</p>
                  </div>
                ) : displayNews.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative overflow-hidden rounded-xl border border-primary/10 bg-slate-800/40 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/640x360?text=Нет+изображения';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-slate-400 text-sm mb-3">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{news.length > 0 ? formatDate(item.date) : item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-3 font-benzin">{item.title}</h3>
                      <p className="text-slate-400 mb-4 line-clamp-3">{item.excerpt}</p>
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
              
              {displayNews.length > 6 && (
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
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
