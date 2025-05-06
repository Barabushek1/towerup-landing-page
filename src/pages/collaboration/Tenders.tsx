import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// Assuming NavBar, PageHeader, Footer, ScrollToTopButton are dark-themed
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

// Assuming Shadcn UI components are dark-themed
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

// Assuming Breadcrumb components are dark-themed
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

// Import icons
import { FileText, Calendar, ArrowRight, Filter, Search, Clock, MapPin, DollarSign, FolderOpen, CheckCircle } from 'lucide-react'; // Added more icons

// Import useToast and useLanguage
import { useToast } from '@/hooks/use-toast'; // Assuming hook exists
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming context exists
import { cn } from '@/lib/utils'; // Assuming utility exists


// --- Mock Data for Tenders (Should ideally come from DB) ---
// Using translation keys for categories and status
const mockTenders = [
  {
    id: 1,
    title: 'Закупка строительных материалов для жилого комплекса',
    description: 'Требуются строительные материалы для возведения жилого комплекса в центре Ташкента. В список входят: цемент, арматура, кирпич, песок, щебень.',
    date: '2025-05-20', // Keep date string format
    category: 'constructionMaterials', // Use a category key
    status: 'active' // Use a status key
  },
  {
    id: 2,
    title: 'Поставка электротехнического оборудования',
    description: 'Закупка высоковольтного оборудования для нового бизнес-центра. Требуются трансформаторы, распределительные щиты, кабельная продукция.',
    date: '2025-05-25',
    category: 'electricalEquipment', // Use a category key
    status: 'active' // Use a status key
  },
  {
    id: 3,
    title: 'Тендер на проведение отделочных работ',
    description: 'Ищем подрядчика для выполнения внутренних отделочных работ в офисном помещении площадью 1200 кв.м. в новом бизнес-центре.',
    date: '2025-06-01',
    category: 'constructionWork', // Use a category key
    status: 'closed' // Use a status key
  },
  {
    id: 4,
    title: 'Закупка сантехнического оборудования',
    description: 'Требуется поставка сантехнического оборудования для комплектации 50 квартир в новом жилом комплексе.',
    date: '2025-06-05',
    category: 'plumbing', // Use a category key
    status: 'active' // Use a status key
  },
  {
    id: 5,
    title: 'Поставка кондиционеров и систем вентиляции',
    description: 'Закупка и монтаж систем кондиционирования и вентиляции для торгового центра площадью 5000 кв.м.',
    date: '2025-05-15',
    category: 'climateEquipment', // Use a category key
    status: 'closed' // Use a status key
  },
  {
    id: 6,
    title: 'Тендер на проектирование ландшафтного дизайна',
    description: 'Ищем компанию для разработки проекта ландшафтного дизайна территории жилого комплекса площадью 1,5 га.',
    date: '2025-05-10',
    category: 'design', // Use a category key
    status: 'closed' // Use a status key
  }
];

// Available categories (using keys now)
const categoryKeys = [
  'allCategories', // Key for "Все категории"
  'constructionMaterials',
  'electricalEquipment',
  'constructionWork',
  'plumbing',
  'climateEquipment',
  'design'
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
  hover: { y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' } // Keep dark shadow effect
};

const Tenders: React.FC = () => {
  const { t } = useLanguage(); // Access translation function
  const [searchQuery, setSearchQuery] = useState('');
  // Use category key for selected category state
  const [selectedCategory, setSelectedCategory] = useState('allCategories'); // Default to 'allCategories' key
  const [filteredTenders, setFilteredTenders] = useState(mockTenders);
  const [activeTab, setActiveTab] = useState('all'); // Tab keys: 'all', 'active', 'closed'

  // Map category keys to translated text for Select options
  const translatedCategories = useMemo(() => {
    return categoryKeys.map(key => ({
      value: key,
      label: t(`tenders.categories.${key}`) // Use translation function
    }));
  }, [t]); // Re-run memoization when language changes

  // Filter tenders based on search query, category, and tab
  useEffect(() => {
    let filtered = [...mockTenders];

    // Filter by search query (search against title and description)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(lowerCaseQuery) ||
        tender.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by category (compare category key)
    if (selectedCategory !== 'allCategories') { // Compare with 'allCategories' key
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }

    // Filter by tab (status key)
    const activeStatus = 'active'; // Internal status key
    const closedStatus = 'closed'; // Internal status key

    if (activeTab === activeStatus) {
      filtered = filtered.filter(tender => tender.status === activeStatus);
    } else if (activeTab === closedStatus) {
      filtered = filtered.filter(tender => tender.status === closedStatus);
    }

    setFilteredTenders(filtered);
  }, [searchQuery, selectedCategory, activeTab, mockTenders]); // Add mockTenders to dependency array if it could change (though static here)


  // Function to get translated status text for badge
  const getTranslatedStatus = (statusKey: string) => {
    switch (statusKey) {
      case 'active':
        return t('tenders.statuses.active');
      case 'closed':
        return t('tenders.statuses.closed');
      default:
        return statusKey; // Fallback if status key is unexpected
    }
  };

   // Function to get badge color based on status key
   const getStatusColorClass = (statusKey: string) => {
     switch (statusKey) {
       case 'active':
         return 'bg-primary text-primary-foreground'; // Use primary badge style
       case 'closed':
         return 'bg-slate-500 text-white'; // Use muted gray
       default:
         return 'bg-slate-600 text-white'; // Default muted
     }
   };


  // Format date using the locale from translation context
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use the locale string from translation context (e.g., 'ru-RU', 'en-US', 'uz-UZ')
    const locale = t('dateFormat') || 'en-US'; // Fallback to 'en-US' if dateFormat key is missing or invalid
    try {
       return new Intl.DateTimeFormat(locale, {
         day: 'numeric',
         month: 'long', // Use 'long' for full month name
         year: 'numeric'
       }).format(date);
    } catch (e) {
        console.error(`Error formatting date for locale "${locale}":`, e);
        return dateString; // Fallback to original string on error
    }
  };

  // --- Render ---
  return (
    // Use consistent dark theme background
    <div className="min-h-screen antialiased bg-[#161616] text-white overflow-x-hidden">
      {/* Helmet for SEO */}
      <Helmet>
        <title>{t('tenders.seo.title')} | {t('footer.companyName')}</title>
        <meta name="description" content={t('tenders.seo.description')} />
        {/* Add other relevant meta tags */}
      </Helmet>

      <NavBar /> {/* Include the standard NavBar */}

      <main>
        {/* Page Header */}
        <PageHeader
          // Use translation for title
          title={t('tenders.title')}
          // Use translation for breadcrumb
          breadcrumb={`${t('nav.home').toUpperCase()} / ${t('tenders.title').toUpperCase()}`} // Use home translation
          // Use an image appropriate for Tenders, styled for dark theme header
          backgroundImage="/lovable-uploads/973129d4-828a-4497-8930-8fda46645e5d.jpg" // Use an appropriate image path
        />

        <section className="py-16 md:py-24 bg-[#1a1a1a]"> {/* Dark background */}
          <div className="container mx-auto px-6"> {/* Consistent padding */}
            {/* Breadcrumbs - Restyled for dark theme */}
             <Breadcrumb className="mb-8 text-slate-400">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary">{t('nav.home')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-600" />
                <BreadcrumbItem>
                  <span className="text-white">{t('tenders.title')}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>


            {/* Intro Section */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12 md:mb-16" // Consistent spacing
            >
              {/* Use translation for heading and paragraph */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('tenders.intro.title')}</h2>
              <p className="text-lg text-slate-300 leading-relaxed"> {/* Adjusted text color */}
                {t('tenders.intro.description')}
              </p>
            </motion.div>

            {/* Filters and Tabs */}
            <motion.div
              className="mb-8 grid gap-4 md:flex md:items-center md:justify-between"
              variants={fadeIn} // Keep fadeIn animation for filter/tab block
            >
              {/* Search Input - Restyled for dark theme */}
              <div className="relative flex-grow md:flex-grow-0 md:w-[350px]"> {/* Make search input flexible on mobile */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" /> {/* Dark icon color */}
                <Input
                  type="text"
                  placeholder={t('tenders.filters.searchPlaceholder')} // Use translation
                  className="pl-9 pr-4 py-2 w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary" // Dark input styles
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Select - Restyled for dark theme */}
              <div className="flex items-center gap-2 md:flex-shrink-0"> {/* Prevent select from shrinking on desktop */}
                <Filter className="text-slate-400 h-4 w-4" /> {/* Dark icon color */}
                <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                   {/* SelectTrigger - Restyled for dark theme */}
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary">
                    {/* Use translation for placeholder */}
                    <SelectValue placeholder={t('tenders.filters.categoryPlaceholder')} />
                  </SelectTrigger>
                  {/* SelectContent & SelectItem - Ensure these are also styled for dark theme globally or here */}
                  <SelectContent className="bg-slate-800 text-white border-slate-700">
                    {/* Map over translated categories */}
                    {translatedCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               {/* Tabs List - Placed below filters or on a new line on small screens */}
                {/* Reworked layout for tabs list */}
                <Tabs defaultValue="all" className="w-full md:w-max md:ml-auto" onValueChange={setActiveTab}> {/* Adjust width and margin */}
                   <TabsList className="grid w-full grid-cols-3 gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700/50 h-auto"> {/* Dark styles, added gap/padding */}
                     {/* Tabs Trigger - Restyled for dark theme */}
                     <TabsTrigger value="all" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.all')}</TabsTrigger> {/* Use translation */}
                     <TabsTrigger value="active" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.active')}</TabsTrigger> {/* Use translation */}
                     <TabsTrigger value="closed" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.closed')}</TabsTrigger> {/* Use translation */}
                   </TabsList>
                 </Tabs>
            </motion.div>


            {/* Tenders List Grid */}
            {/* Use motion.div around TabsContent to animate the appearance of the list */}
             <motion.div variants={fadeIn}>
              <Tabs value={activeTab} className="mb-8"> {/* Use controlled tabs */}
                <TabsContent value="all" className="mt-0"> {/* Remove default margin */}
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
                          whileHover="hover" // Apply hover animation
                          transition={{ duration: 0.3 }}
                        >
                          {/* Card - Restyled for dark theme */}
                          <Card className={cn(
                             "h-full flex flex-col overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300",
                             "bg-slate-800/40 text-white border-slate-700/50 hover:border-primary/30", // Dark card styles
                             tender.status === 'closed' ? "opacity-75" : "" // Keep opacity for closed status (using internal key)
                          )}
                             // Apply border-left color based on status key
                            style={{ borderLeftColor: tender.status === 'active' ? '#4ade80' : '#8E9196' }} // Use primary hex for active, gray for closed
                          >
                            <CardHeader>
                              <div className="flex justify-between items-start gap-2"> {/* Added gap */}
                                {/* Title - Restyled color */}
                                <CardTitle className="text-xl font-bold text-white flex-grow">{tender.title}</CardTitle> {/* Title fills space */}
                                {/* Status Badge - Restyled color */}
                                <Badge className={cn("text-white", getStatusColorClass(tender.status))}>
                                  {getTranslatedStatus(tender.status)} {/* Use translated status */}
                                </Badge>
                              </div>
                              {/* Date - Restyled icon/text color */}
                              <div className="flex items-center text-sm text-slate-400 mt-2"> {/* Text color */}
                                <Calendar className="h-4 w-4 mr-2 text-slate-400" /> {/* Icon color */}
                                <span>{formatDate(tender.date)}</span> {/* Use formatted date */}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow text-slate-300 leading-relaxed"> {/* Restyled text color, added flex-grow */}
                              {/* Category Badge - Restyled */}
                              <div className="mb-3"> {/* Increased margin bottom */}
                                <Badge variant="secondary" className="mr-2 bg-slate-700/50 text-slate-300 border-slate-600"> {/* Dark badge style */}
                                  {t(`tenders.categories.${tender.category}`)} {/* Use translated category */}
                                </Badge>
                              </div>
                              {/* Description */}
                              <p>{tender.description}</p>
                            </CardContent>
                            <CardFooter>
                              {/* Button - Restyled for dark theme, added translation */}
                              <Button
                                variant="outline"
                                disabled={tender.status === 'closed'} // Disable if internal status is closed
                                className={cn(
                                   "w-full flex items-center justify-center gap-2",
                                   "border-slate-600 text-white/90 hover:bg-slate-700/50 hover:border-primary group-hover:border-primary/80 transition-colors", // Dark outline button style
                                   tender.status === 'closed' && "opacity-50 cursor-not-allowed" // Style for disabled state
                                )}
                                // onClick handler for details (if needed)
                                // onClick={() => handleTenderClick(tender.id)} // Keep if you want a handler
                              >
                                <FileText className="h-4 w-4" /> {/* Icon */}
                                {/* Use translation for button text */}
                                <span>{t('tenders.items.buttonDetails')}</span>
                                <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" /> {/* Arrow icon */}
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      // No Tenders Found Message - Restyled for dark theme
                      <motion.div
                        className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-slate-800/40 rounded-xl border border-slate-700/50" // Dark card style
                        variants={fadeIn}
                      >
                        {/* Use translation for message */}
                        <p className="text-xl text-slate-400">{t('tenders.notFound.title')}</p>
                        <p className="text-slate-500 mt-2">{t('tenders.notFound.description')}</p> {/* Slightly darker text */}
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>
                 {/* Add empty TabsContent for 'active' and 'closed' if needed for structure, but the filtering handles display */}
                 {/* Example: <TabsContent value="active"></TabsContent> */}
                 {/* Example: <TabsContent value="closed"></TabsContent> */}
              </Tabs>
             </motion.div> {/* End motion.div around TabsContent */}

            {/* Buttons below the list - Restyled for dark theme, added translation keys */}
            {/* Removed this button block as the previous one (below filters) seems sufficient */}
            {/* <div className="text-center mt-12 space-x-4">
               <Button variant="outline">...</Button>
               <Button>...</Button>
            </div> */}

          </div>
        </section>
      </main>

      <Footer /> {/* Include the standard Footer */}
      <ScrollToTopButton /> {/* Include scroll button */}
    </div>
  );
};

export default Tenders;