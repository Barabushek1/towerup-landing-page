import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { FileText, Calendar, ArrowRight, Filter, Search, Clock, MapPin, DollarSign, FolderOpen, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/utils';


// --- Mock Data for Tenders (Hardcoded Russian text) ---
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
    status: 'Завершен'
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
    status: 'Завершен'
  },
  {
    id: 6,
    title: 'Тендер на проектирование ландшафтного дизайна',
    description: 'Ищем компанию для разработки проекта ландшафтного дизайна территории жилого комплекса площадью 1,5 га.',
    date: '2025-05-10',
    category: 'Проектирование',
    status: 'Завершен'
  }
];

// Available categories (hardcoded Russian text)
const categories = [
  'Все категории',
  'Строительные материалы',
  'Электрооборудование',
  'Строительные работы',
  'Сантехника',
  'Климатическое оборудование',
  'Проектирование'
];

// Animation variants
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
  // Removed useLanguage hook usage
  // Removed useToast hook usage if not used elsewhere

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [filteredTenders, setFilteredTenders] = useState(mockTenders);
  const [activeTab, setActiveTab] = useState('all'); // Tab keys: 'all', 'active', 'closed'

  // Categories for Select options (use hardcoded array directly)

  // Filter tenders based on search query, category, and tab
  useEffect(() => {
    let filtered = [...mockTenders];

    // Filter by search query (search against hardcoded title and description)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(lowerCaseQuery) ||
        tender.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by category (compare hardcoded category string)
    if (selectedCategory !== 'Все категории') {
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }

    // Filter by tab (compare hardcoded status string)
    const activeStatus = 'Активный'; // Hardcoded status string
    const completedStatus = 'Завершен'; // Hardcoded status string

    if (activeTab === 'active') {
      filtered = filtered.filter(tender => tender.status === activeStatus);
    } else if (activeTab === 'closed') {
      filtered = filtered.filter(tender => tender.status === completedStatus);
    } else if (activeTab === 'all') {
       // 'all' tab shows all statuses, no additional filtering needed
    }

    setFilteredTenders(filtered);
  }, [searchQuery, selectedCategory, activeTab]); // Keep dependencies


  // Function to get badge color based on hardcoded status string
   const getStatusColorClass = (status: string) => {
     switch (status) {
       case 'Активный':
         return 'bg-primary text-primary-foreground';
       case 'Завершен':
         return 'bg-slate-500 text-white';
       default:
         return 'bg-slate-600 text-white';
     }
   };


  // Format date using Russian locale (hardcoded)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    try {
       return new Intl.DateTimeFormat('ru-RU', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
       }).format(date);
    } catch (e) {
        console.error(`Error formatting date for locale "ru-RU":`, e);
        return dateString;
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-white overflow-x-hidden">
      {/* Helmet for SEO - Hardcoded Russian text */}
      <Helmet>
        <title>Тендеры | TOWERUP</title>
        <meta name="description" content="Актуальные тендеры и конкурсы на закупку оборудования и строительных материалов от компании TOWERUP." />
        {/* Add other relevant meta tags */}
      </Helmet>

      <NavBar />

      <main>
        {/* Page Header - Hardcoded Russian text */}
        <PageHeader
          title="Тендеры"
          breadcrumb="ГЛАВНАЯ / ТЕНДЕРЫ"
          backgroundImage="/lovable-uploads/973129d4-828a-4497-8930-8fda46645e5d.jpg"
        />

        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            {/* Breadcrumbs - Hardcoded Russian text, styled for dark theme */}
             <Breadcrumb className="mb-8 text-slate-400">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary">Главная</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-600" />
                <BreadcrumbItem>
                  <span className="text-white">Тендеры</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>


            {/* Intro Section - Hardcoded Russian text */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Текущие тендеры и закупки</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Здесь публикуются актуальные тендеры на закупку оборудования,
                строительных материалов и услуг для проектов компании TOWERUP.
              </p>
            </motion.div>

            {/* Filters and Tabs - Hardcoded Russian text */}
            <motion.div
              className="mb-8 grid gap-4 md:flex md:items-center md:justify-between"
              variants={fadeIn}
            >
              {/* Search Input - Hardcoded placeholder text */}
              <div className="relative flex-grow md:flex-grow-0 md:w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск по тендерам..."
                  className="pl-9 pr-4 py-2 w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Select - Hardcoded Russian text for options */}
              <div className="flex items-center gap-2 md:flex-shrink-0">
                <Filter className="text-slate-400 h-4 w-4" />
                <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary">
                    {/* Hardcoded placeholder */}
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700">
                    {/* Map over hardcoded categories array */}
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               {/* Tabs List - Hardcoded Russian text for labels and values */}
                <Tabs defaultValue="all" className="w-full md:w-max md:ml-auto" onValueChange={setActiveTab}>
                   <TabsList className="grid w-full grid-cols-3 gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700/50 h-auto">
                     {/* Hardcoded labels */}
                     <TabsTrigger value="all" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">Все тендеры</TabsTrigger>
                     <TabsTrigger value="active" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">Активные</TabsTrigger>
                     <TabsTrigger value="closed" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">Завершенные</TabsTrigger>
                   </TabsList>
                 </Tabs>
            </motion.div>

            {/* Tenders List Grid within Tabs Content */}
             {/* Keep Tabs component here to control content display */}
              <Tabs value={activeTab}> {/* Use controlled tabs */}
                <TabsContent value="all" className="mt-0"> {/* Content for 'all' tab */}
                   {/* Only render the grid here */}
                   <motion.div
                     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                     variants={staggerContainer}
                     initial="initial"
                     animate="animate"
                   >
                     {/* Map through filtered tenders */}
                     {filteredTenders.length > 0 ? (
                       filteredTenders.map((tender) => (
                         <motion.div
                           key={tender.id}
                           variants={cardVariants}
                           whileHover="hover"
                           transition={{ duration: 0.3 }}
                         >
                           {/* Card - Styled for dark theme */}
                           <Card className={cn(
                              "h-full flex flex-col overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300",
                              "bg-slate-800/40 text-white border-slate-700/50 hover:border-primary/30",
                              tender.status === 'Завершен' ? "opacity-75" : ""
                           )}
                             style={{ borderLeftColor: tender.status === 'Активный' ? '#4ade80' : '#8E9196' }}
                           >
                             <CardHeader>
                               <div className="flex justify-between items-start gap-2">
                                 {/* Title - Restyled color */}
                                 <CardTitle className="text-xl font-bold text-white flex-grow">{tender.title}</CardTitle>
                                 {/* Status Badge - Restyled color */}
                                 <Badge className={cn("text-white", getStatusColorClass(tender.status))}>
                                   {tender.status}
                                 </Badge>
                               </div>
                               {/* Date - Restyled icon/text color */}
                               <div className="flex items-center text-sm text-slate-400 mt-2">
                                 <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                 <span>Срок подачи: {formatDate(tender.date)}</span>
                               </div>
                             </CardHeader>
                             <CardContent className="flex-grow text-slate-300 leading-relaxed">
                               {/* Category Badge - Restyled */}
                               <div className="mb-3">
                                 <Badge variant="secondary" className="mr-2 bg-slate-700/50 text-slate-300 border-slate-600">
                                   {tender.category}
                                 </Badge>
                               </div>
                               {/* Description */}
                               <p>{tender.description}</p>
                             </CardContent>
                             <CardFooter>
                               {/* Button - Restyled for dark theme, hardcoded text */}
                               <Button
                                 variant="outline"
                                 disabled={tender.status === 'Завершен'}
                                 className={cn(
                                    "w-full flex items-center justify-center gap-2",
                                    "border-slate-600 text-white/90 hover:bg-slate-700/50 hover:border-primary group-hover:border-primary/80 transition-colors",
                                    tender.status === 'Завершен' && "opacity-50 cursor-not-allowed"
                                 )}
                               >
                                 <FileText className="h-4 w-4" />
                                 <span>Подробнее</span>
                                 <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                               </Button>
                             </CardFooter>
                           </Card>
                         </motion.div>
                       ))
                     ) : (
                       {/* No Tenders Found Message - Hardcoded Russian text */}
                       <motion.div
                         className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-slate-800/40 rounded-xl border border-slate-700/50"
                         variants={fadeIn}
                       >
                         <p className="text-xl text-slate-400">Тендеры не найдены</p>
                         <p className="text-slate-500 mt-2">Попробуйте изменить параметры фильтрации</p>
                       </motion.div>
                     )}
                   </motion.div>
                 </TabsContent>
                 {/* Add empty TabsContent for 'active' and 'closed' */}
                  {/* These are needed for the Tabs component structure, even if they don't render filtered lists directly */}
                 <TabsContent value="active" className="mt-0"></TabsContent>
                 <TabsContent value="closed" className="mt-0"></TabsContent>
              </Tabs>
             </motion.div> {/* End motion.div around the Tabs component */}


            {/* Button below the list (All Tenders) - Hardcoded Russian text */}
            <div className="text-center mt-10 md:mt-12">
                 <Button asChild variant="outline" className="bg-transparent shadow-none hover:bg-slate-700/50 text-white border-slate-600 hover:border-primary px-6 py-2 text-lg">
                   <a href="/tenders">Все тендеры</a>
                </Button>
            </div>


          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Tenders;