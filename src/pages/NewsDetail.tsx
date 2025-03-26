
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminData, NewsItem } from '@/contexts/AdminDataContext';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news } = useAdminData();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (news && id) {
      const item = news.find(item => item.id === id);
      if (item) {
        setNewsItem(item);
      }
      setLoading(false);
    }
  }, [news, id]);

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
        bgImage={newsItem.imageUrl}
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
              
              {newsItem.additionalImages && newsItem.additionalImages.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 font-benzin">Фотогалерея</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {newsItem.additionalImages.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsDetail;
