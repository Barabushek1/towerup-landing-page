
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

interface Tender {
  id: string;
  title: string;
  description: string;
  category?: string;
  deadline?: string;
  status: string;
  created_at: string;
}

const Tenders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch active tenders
  const {
    data: tenders,
    isLoading
  } = useQuery({
    queryKey: ['tenders-public'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('tenders').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data as Tender[];
    }
  });

  // Filter tenders based on search query
  const filteredTenders = tenders?.filter(tender => tender.title.toLowerCase().includes(searchQuery.toLowerCase()) || tender.description.toLowerCase().includes(searchQuery.toLowerCase()) || tender.category && tender.category.toLowerCase().includes(searchQuery.toLowerCase()));

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указан';
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      return 'Неверная дата';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активный</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Завершен</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Закрыт</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Render tender card
  const renderTenderCard = (tender: Tender) => (
    <div key={tender.id} className="rounded-lg shadow-md p-6 transition-all hover:shadow-lg bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">{tender.title}</h3>
        {getStatusBadge(tender.status)}
      </div>
      
      {tender.category && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Категория: {tender.category}
        </div>
      )}
      
      <p className="mb-4 line-clamp-3 text-gray-50">
        {tender.description}
      </p>
      
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Срок подачи: {formatDate(tender.deadline)}</span>
      </div>
      
      <Link to={`/tenders/${tender.id}`}>
        <Button variant="outline" className="w-full text-brand-primary">
          Подробнее
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );

  // Render tenders grid
  const renderTendersGrid = (tenders?: Tender[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!tenders || tenders.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Тендеры не найдены</h3>
          <p className="text-gray-500 dark:text-gray-400">
            В данный момент нет доступных тендеров в этой категории
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenders.map(renderTenderCard)}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Тендеры | Сотрудничество</title>
      </Helmet>
      
      <NavBar />
      <PageHeader 
        title="Тендеры" 
        subtitle="Актуальные предложения для сотрудничества" 
        breadcrumb="Тендеры"
      />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Поиск тендеров..." 
              className="pl-10" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-6 overflow-x-auto">
              <TabsList className="bg-[#161616] p-1 rounded-lg border border-gray-800 shadow-lg">
                <TabsTrigger 
                  value="all" 
                  className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all duration-200"
                >
                  Все тендеры
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all duration-200"
                >
                  Активные
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all duration-200"
                >
                  Завершенные
                </TabsTrigger>
                <TabsTrigger 
                  value="closed" 
                  className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all duration-200"
                >
                  Закрытые
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-6">
              {renderTendersGrid(filteredTenders)}
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              {renderTendersGrid(filteredTenders?.filter(t => t.status === 'active'))}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {renderTendersGrid(filteredTenders?.filter(t => t.status === 'completed'))}
            </TabsContent>
            
            <TabsContent value="closed" className="mt-6">
              {renderTendersGrid(filteredTenders?.filter(t => t.status === 'closed'))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Tenders;
