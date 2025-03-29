
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

// Example news data with WebP images
const exampleNews = [
  {
    id: "example_1",
    title: "Начало строительства нового жилого комплекса в центре города",
    published_at: "2025-03-15T00:00:00Z",
    summary: "Мы рады сообщить о начале реализации масштабного проекта в центральном районе, который обеспечит город современным и комфортным жильем.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80&fm=webp",
    content: "Мы рады сообщить о начале реализации масштабного проекта в центральном районе города. Новый жилой комплекс будет включать современные апартаменты различной площади, от компактных студий до просторных пентхаусов.\n\nВ проекте предусмотрены подземный паркинг, благоустроенная придомовая территория с детскими и спортивными площадками, а также коммерческие помещения на первых этажах зданий.\n\nСтроительство планируется завершить к концу 2027 года, а первые жильцы смогут въехать в свои новые квартиры уже в начале 2028 года.",
    created_at: "2025-03-15T00:00:00Z",
    updated_at: "2025-03-15T00:00:00Z"
  },
  {
    id: "example_2",
    title: "Завершение проекта реконструкции исторического здания",
    published_at: "2025-02-28T00:00:00Z",
    summary: "Успешно завершены работы по реконструкции исторического здания XIX века с сохранением его архитектурной ценности и добавлением современных элементов.",
    image_url: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80&fm=webp",
    content: "Успешно завершены работы по реконструкции исторического здания XIX века с сохранением его архитектурной ценности и добавлением современных элементов.\n\nРеконструкция заняла более двух лет и включала в себя укрепление фундамента, восстановление исторического фасада, замену перекрытий и инженерных коммуникаций.\n\nОсобое внимание было уделено воссозданию исторических деталей интерьера, таких как лепнина, паркет и двери. При этом здание оснащено современными системами безопасности, отопления и вентиляции.",
    created_at: "2025-02-28T00:00:00Z",
    updated_at: "2025-02-28T00:00:00Z"
  },
  {
    id: "example_3",
    title: "Внедрение новых экологичных технологий строительства",
    published_at: "2025-01-20T00:00:00Z",
    summary: "Наша компания начала использование инновационных экологически чистых материалов и технологий в строительстве, что значительно снижает воздействие на окружающую среду.",
    image_url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80&fm=webp",
    content: "Наша компания начала использование инновационных экологически чистых материалов и технологий в строительстве, что значительно снижает воздействие на окружающую среду.\n\nНовые технологии включают в себя использование переработанных материалов, энергоэффективные решения и системы сбора и очистки дождевой воды.\n\nПервым проектом, в котором будут полностью применены эти технологии, станет жилой комплекс в экологическом районе города. Ожидается, что это позволит снизить потребление энергии на 30% и уменьшить выбросы CO2 на 25% по сравнению с традиционными методами строительства.",
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z"
  },
  {
    id: "example_4",
    title: "Получение международного сертификата качества",
    published_at: "2025-01-05T00:00:00Z",
    summary: "Наша компания получила международный сертификат качества ISO 9001, что подтверждает высокие стандарты нашей работы и приверженность к качеству.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80&fm=webp",
    content: "Наша компания получила международный сертификат качества ISO 9001, что подтверждает высокие стандарты нашей работы и приверженность к качеству.\n\nПроцесс сертификации включал в себя тщательную проверку всех аспектов нашей деятельности, от проектирования и строительства до взаимодействия с клиентами и поставщиками.\n\nПолученный сертификат является признанием нашего стремления к постоянному совершенствованию и поддержанию высокого уровня качества во всех проектах.",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z"
  }
];

const News: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Use example news data
  const displayNews = exampleNews;

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
                {displayNews.map((item) => (
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
