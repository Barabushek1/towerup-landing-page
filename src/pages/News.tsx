
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
  content: string;
  image_url: string;
  published_at: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

const News: React.FC = () => {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
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
  
  // Fallback news data with abstract images
  const defaultNews: NewsItem[] = [
    {
      id: "default_1",
      title: "Старт продаж новых квартир в ЖК Tower Up",
      published_at: "2025-03-15T00:00:00Z",
      summary: "Рады сообщить о старте продаж новой очереди квартир в жилом комплексе Tower Up. Доступны 1-, 2- и 3-комнатные квартиры с современной планировкой и высококачественной отделкой.",
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: "Компания TOWERUP объявляет о начале продаж квартир в новой секции жилого комплекса Tower Up. В продаже представлены квартиры с различными планировками: от уютных однокомнатных студий до просторных трехкомнатных квартир. Все квартиры сдаются с качественной предчистовой отделкой.\n\nЖилой комплекс Tower Up отличается современной архитектурой, продуманными планировками и высоким качеством строительства. На территории комплекса предусмотрены детские и спортивные площадки, зоны отдыха, подземный паркинг.\n\nДля первых покупателей действуют специальные условия приобретения и гибкие программы оплаты. Подробную информацию можно получить в отделе продаж или по телефону +998 55 510 00 03.",
      created_at: "2025-03-15T00:00:00Z",
      updated_at: "2025-03-15T00:00:00Z"
    },
    {
      id: "default_2",
      title: "Ход строительства ЖК Tower Up: март 2025",
      published_at: "2025-03-10T00:00:00Z",
      summary: "Представляем ежемесячный отчет о строительстве жилого комплекса Tower Up. Завершены основные монолитные работы, начата отделка фасадов. Строительство ведется строго по графику.",
      image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: "Компания TOWERUP представляет ежемесячный отчет о ходе строительства жилого комплекса Tower Up.\n\nНа текущий момент завершены все основные монолитные работы во всех секциях комплекса. Строители приступили к отделке фасадов и внутренним отделочным работам. Проложены основные инженерные коммуникации, ведется установка окон.\n\nНа прилегающей территории начаты работы по благоустройству: планировка ландшафта, подготовка площадок для будущих зон отдыха и детских площадок.\n\nСтроительство ведется в соответствии с графиком, сдача объекта планируется в установленные сроки. Мы регулярно публикуем фотоотчеты о ходе строительства на нашем сайте и в социальных сетях.",
      created_at: "2025-03-10T00:00:00Z",
      updated_at: "2025-03-10T00:00:00Z"
    },
    {
      id: "default_3",
      title: "Обновление инфраструктуры района Tower Up",
      published_at: "2025-02-28T00:00:00Z",
      summary: "В рамках развития территории вокруг ЖК Tower Up, компания TOWERUP инвестирует в создание современной инфраструктуры: парки, детские площадки, торговые центры и спортивные объекты.",
      image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: "Компания TOWERUP активно участвует в развитии городской среды и инфраструктуры района, где расположен жилой комплекс Tower Up.\n\nВ рамках этой инициативы компания инвестирует значительные средства в создание комфортной и современной инфраструктуры: озелененные парковые зоны, детские и спортивные площадки, пешеходные аллеи и велодорожки.\n\nВ сотрудничестве с городскими властями планируется строительство нового торгового центра с кинотеатром, фитнес-клубом и ресторанами. Также в планах – открытие медицинского центра и детского сада.\n\nРазвитие инфраструктуры не только повысит комфорт проживания для жителей Tower Up, но и значительно увеличит привлекательность и стоимость недвижимости в этом районе.",
      created_at: "2025-02-28T00:00:00Z",
      updated_at: "2025-02-28T00:00:00Z"
    },
    {
      id: "default_4",
      title: "Новые технологии строительства в проектах TOWERUP",
      published_at: "2025-02-15T00:00:00Z",
      summary: "Компания TOWERUP внедряет инновационные технологии строительства, которые повышают качество, экологичность и энергоэффективность жилых комплексов.",
      image_url: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      content: "Компания TOWERUP всегда стремится быть на переднем крае инноваций в строительной отрасли. В наших новых проектах активно применяются передовые технологии, которые делают жилье более качественным, экологичным и энергоэффективным.\n\nСреди внедряемых инноваций:\n\n- Современные материалы с улучшенными теплоизоляционными свойствами, которые снижают затраты на отопление и кондиционирование\n- Системы рекуперации тепла, позволяющие использовать тепло вентиляционных выбросов\n- Интеллектуальные системы учета и регулирования потребления энергоресурсов\n- Применение экологически чистых материалов для внутренней отделки\n\nЭти технологии не только снижают эксплуатационные расходы для будущих жильцов, но и уменьшают негативное воздействие на окружающую среду. Компания TOWERUP подтверждает свое стремление строить жилье, соответствующее самым высоким стандартам качества и комфорта.",
      created_at: "2025-02-15T00:00:00Z",
      updated_at: "2025-02-15T00:00:00Z"
    }
  ];

  // Use default news if no data from API
  const displayNews = news.length > 0 ? news : defaultNews;

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
                        <span>{formatDate(item.published_at)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-3 font-benzin">{item.title}</h3>
                      <p className="text-slate-400 mb-4 line-clamp-3">{item.summary}</p>
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
