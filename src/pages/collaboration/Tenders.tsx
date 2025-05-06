
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import PageHeader from '@/components/PageHeader';
import { Search, Calendar, ChevronRight, FileText } from 'lucide-react';

interface TenderItem {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  category?: string;
  deadline?: string;
  documents?: string[];
  status: string;
  created_at: string;
}

const Tenders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Animation variants
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Fetch tenders data
  const { data: tenders, isLoading } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as TenderItem[];
    }
  });

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указан';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неверная дата';
    }
  };

  // Extract unique categories
  const uniqueCategories = React.useMemo(() => {
    if (!tenders) return [];
    const categories = tenders
      .map(tender => tender.category)
      .filter((category): category is string => !!category);
    return Array.from(new Set(categories));
  }, [tenders]);

  // Filter tenders based on search term and category
  const filteredTenders = React.useMemo(() => {
    if (!tenders) return [];
    
    return tenders.filter(tender => {
      const matchesSearch = 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter ? tender.category === categoryFilter : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [tenders, searchTerm, categoryFilter]);

  // Group tenders by status
  const activeTenders = filteredTenders.filter(tender => tender.status === 'active');
  const completedTenders = filteredTenders.filter(tender => tender.status === 'completed');
  const closedTenders = filteredTenders.filter(tender => tender.status === 'closed');
  
  // Check if tender deadline has passed
  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    try {
      return new Date(deadline) < new Date();
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Текущие тендеры | TOWERUP</title>
        <meta name="description" content="Список актуальных тендеров компании TOWERUP" />
      </Helmet>

      <NavBar />
      <PageHeader 
        title="Тендеры" 
        breadcrumb="Сотрудничество / Тендеры" 
        backgroundImage="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg" 
      />

      <main className="container mx-auto py-12 px-4">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Актуальные тендеры</h2>
          <p className="text-lg text-gray-600">
            Примите участие в тендерах на поставку материалов, товаров и услуг для наших проектов. 
            Компания TOWERUP гарантирует прозрачность процесса отбора и равные условия для всех участников.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Поиск тендеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все категории</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Активные ({activeTenders.length})</TabsTrigger>
              <TabsTrigger value="completed">Завершенные ({completedTenders.length})</TabsTrigger>
              <TabsTrigger value="all">Все ({filteredTenders.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <TendersList tenders={activeTenders} isLoading={isLoading} formatDate={formatDate} isDeadlinePassed={isDeadlinePassed} />
            </TabsContent>
            
            <TabsContent value="completed">
              <TendersList tenders={completedTenders} isLoading={isLoading} formatDate={formatDate} isDeadlinePassed={isDeadlinePassed} />
            </TabsContent>
            
            <TabsContent value="all">
              <TendersList tenders={filteredTenders} isLoading={isLoading} formatDate={formatDate} isDeadlinePassed={isDeadlinePassed} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

interface TendersListProps {
  tenders: TenderItem[];
  isLoading: boolean;
  formatDate: (dateString?: string) => string;
  isDeadlinePassed: (deadline?: string) => boolean;
}

const TendersList: React.FC<TendersListProps> = ({ tenders, isLoading, formatDate, isDeadlinePassed }) => {
  // Animation variants
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Загрузка тендеров...</p>
      </div>
    );
  }

  if (tenders.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <p className="text-lg text-gray-500">Нет тендеров для отображения</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {tenders.map(tender => (
        <motion.div
          key={tender.id}
          variants={itemFade}
          className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div className="space-y-2 mb-4 md:mb-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/tenders/${tender.id}`} className="text-xl font-semibold hover:text-blue-600">
                  {tender.title}
                </Link>
                
                <div className="flex gap-2 items-center">
                  {tender.status === 'active' ? (
                    <Badge className="bg-green-500">Активный</Badge>
                  ) : tender.status === 'completed' ? (
                    <Badge className="bg-blue-500">Завершен</Badge>
                  ) : (
                    <Badge className="bg-gray-500">Закрыт</Badge>
                  )}
                  
                  {tender.status === 'active' && isDeadlinePassed(tender.deadline) && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      Срок подачи истек
                    </Badge>
                  )}
                </div>
              </div>
              
              {tender.category && (
                <div className="text-sm text-gray-600">
                  Категория: {tender.category}
                </div>
              )}
              
              <p className="text-gray-600 line-clamp-2">
                {tender.description}
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Срок подачи: {formatDate(tender.deadline)}</span>
                </div>
                
                {tender.documents && tender.documents.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{tender.documents.length} документов</span>
                  </div>
                )}
                
                <div>
                  Опубликован: {formatDate(tender.created_at)}
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <Link to={`/tenders/${tender.id}`}>
                <Button variant="outline" className="flex gap-2 items-center">
                  <span>Подробнее</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Tenders;
