
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { FileText, Calendar, ArrowRight, Filter, Search } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data for tenders
const mockTenders = [
  {
    id: 1,
    title: 'Закупка строительных материалов для жилого комплекса',
    description: 'Требуются строительные материалы для возведения жилого комплекса в центре Ташкента. В список входят: цемент, арматура, кирпич, песок, щебень.',
    date: '2025-05-20',
    category: 'Строительные материалы',
    status: 'Активный'
  },
  {
    id: 2,
    title: 'Поставка электротехнического оборудования',
    description: 'Закупка высоковольтного оборудования для нового бизнес-центра. Требуются трансформаторы, распределительные щиты, кабельная продукция.',
    date: '2025-05-25',
    category: 'Электрооборудование',
    status: 'Активный'
  },
  {
    id: 3,
    title: 'Тендер на проведение отделочных работ',
    description: 'Ищем подрядчика для выполнения внутренних отделочных работ в офисном помещении площадью 1200 кв.м. в новом бизнес-центре.',
    date: '2025-06-01',
    category: 'Строительные работы',
    status: 'Активный'
  },
  {
    id: 4,
    title: 'Закупка сантехнического оборудования',
    description: 'Требуется поставка сантехнического оборудования для комплектации 50 квартир в новом жилом комплексе.',
    date: '2025-06-05',
    category: 'Сантехника',
    status: 'Активный'
  },
  {
    id: 5,
    title: 'Поставка кондиционеров и систем вентиляции',
    description: 'Закупка и монтаж систем кондиционирования и вентиляции для торгового центра площадью 5000 кв.м.',
    date: '2025-05-15',
    category: 'Климатическое оборудование',
    status: 'Закрыт'
  },
  {
    id: 6,
    title: 'Тендер на проектирование ландшафтного дизайна',
    description: 'Ищем компанию для разработки проекта ландшафтного дизайна территории жилого комплекса площадью 1,5 га.',
    date: '2025-05-10',
    category: 'Проектирование',
    status: 'Закрыт'
  }
];

// Available categories for filtering
const categories = [
  'Все категории',
  'Строительные материалы',
  'Электрооборудование',
  'Строительные работы',
  'Сантехника',
  'Климатическое оборудование',
  'Проектирование'
];

// Animation variants for elements
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }
};

const Tenders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [filteredTenders, setFilteredTenders] = useState(mockTenders);
  const [activeTab, setActiveTab] = useState('all');

  // Filter tenders based on search query, category and tab
  useEffect(() => {
    let filtered = [...mockTenders];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tender => 
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'Все категории') {
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }
    
    // Filter by tab (status)
    if (activeTab === 'active') {
      filtered = filtered.filter(tender => tender.status === 'Активный');
    } else if (activeTab === 'closed') {
      filtered = filtered.filter(tender => tender.status === 'Закрыт');
    }
    
    setFilteredTenders(filtered);
  }, [searchQuery, selectedCategory, activeTab]);

  // Format date to Russian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Тендеры | TOWERUP</title>
        <meta name="description" content="Актуальные тендеры и конкурсы на закупку оборудования и строительных материалов от компании TOWERUP." />
      </Helmet>
      
      <NavBar />
      
      <main>
        <PageHeader 
          title="Тендеры" 
          breadcrumb="Тендеры"
          backgroundImage="/lovable-uploads/973129d4-828a-4497-8930-8fda46645e5d.jpg"
        />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Текущие тендеры и закупки</h2>
              <p className="text-lg text-gray-600">
                Здесь публикуются актуальные тендеры на закупку оборудования, 
                строительных материалов и услуг для проектов компании TOWERUP.
              </p>
            </motion.div>
            
            <motion.div 
              className="mb-8 grid gap-4 md:flex md:items-center md:justify-between"
              variants={fadeIn}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск по тендерам..."
                  className="pl-9 pr-4 py-2 w-full md:w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500 h-4 w-4" />
                <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 md:w-max">
                  <TabsTrigger value="all">Все тендеры</TabsTrigger>
                  <TabsTrigger value="active">Активные</TabsTrigger>
                  <TabsTrigger value="closed">Завершенные</TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredTenders.length > 0 ? (
                filteredTenders.map((tender) => (
                  <motion.div 
                    key={tender.id}
                    variants={cardVariants}
                    whileHover="hover"
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300" 
                      style={{ borderLeftColor: tender.status === 'Активный' ? '#26AA56' : '#8E9196' }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-gray-900">{tender.title}</CardTitle>
                          <Badge variant={tender.status === 'Активный' ? 'default' : 'outline'}>
                            {tender.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(tender.date)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="mb-2">
                          <Badge variant="secondary" className="mr-2">
                            {tender.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{tender.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Подробнее</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="col-span-2 py-16 text-center"
                  variants={fadeIn}
                >
                  <p className="text-xl text-gray-500">Тендеры не найдены</p>
                  <p className="text-gray-400 mt-2">Попробуйте изменить параметры фильтрации</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Tenders;
