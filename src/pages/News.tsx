
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Clock, ChevronRight } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const News: React.FC = () => {
  const news = [
    {
      title: "Начало строительства нового жилого комплекса в центре города",
      date: "15 июня 2023",
      excerpt: "Мы рады сообщить о начале реализации масштабного проекта в центральном районе, который обеспечит город современным и комфортным жильем.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Завершение проекта реконструкции исторического здания",
      date: "28 мая 2023",
      excerpt: "Успешно завершены работы по реконструкции исторического здания XIX века с сохранением его архитектурной ценности и добавлением современных элементов.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Внедрение новых экологичных технологий строительства",
      date: "10 мая 2023",
      excerpt: "Наша компания начала использование инновационных экологически чистых материалов и технологий в строительстве, что значительно снижает воздействие на окружающую среду.",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Получение международного сертификата качества",
      date: "5 мая 2023",
      excerpt: "Наша компания получила международный сертификат качества ISO 9001, что подтверждает высокие стандарты нашей работы и приверженность к качеству.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Участие в международной строительной выставке",
      date: "20 апреля 2023",
      excerpt: "Представители нашей компании приняли участие в международной строительной выставке, где представили новые проекты и технологии.",
      imageUrl: "https://images.unsplash.com/photo-1565633246879-cad3e143e75e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Заключение нового контракта на строительство торгового центра",
      date: "15 апреля 2023",
      excerpt: "Мы подписали новый контракт на строительство крупного торгового центра, который станет одним из самых современных объектов в регионе.",
      imageUrl: "https://images.unsplash.com/photo-1556156653-e5a7c69cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Новости компании</h1>
                <p className="text-lg text-muted-foreground mb-12 font-benzin">
                  Следите за последними событиями и новостями нашей компании
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative overflow-hidden rounded-lg border border-primary/10 shadow-sm bg-background
                      transition-all duration-500 hover:shadow-md group"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-benzin">{item.date}</span>
                        </div>
                        
                        <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">{item.title}</h3>
                        <p className="text-muted-foreground mb-4 font-benzin line-clamp-3">{item.excerpt}</p>
                        
                        <a 
                          href="#" 
                          className="inline-flex items-center text-primary font-medium hover:underline font-benzin group-hover:translate-x-1 transition-transform"
                        >
                          <span>Подробнее</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <Pagination>
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
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
