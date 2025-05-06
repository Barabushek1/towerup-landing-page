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
import { useLanguage } from '@/contexts/useLanguage'; // Assuming context exists and path is correct
import { cn } from '@/lib/utils'; // Assuming utility exists


// --- Mock Data for Tenders (Should ideally come from DB) ---
// Using translation keys for categories and status, and NOW also for titles and descriptions
const mockTenders = [
  {
    id: 1,
    titleKey: 'tenders.items.tender1.title', // Use a key for title
    descriptionKey: 'tenders.items.tender1.description', // Use a key for description
    date: '2025-05-20', // Keep date string format
    category: 'constructionMaterials', // Use a category key
    status: 'active', // Use a status key
    // location: 'Ташкент, Мирзо-Улугбекский район', // Add location if needed per tender
    // budget: '$250,000 - $350,000', // Add budget if needed per tender
    // requirements: '...', // Add requirements if needed per tender
  },
  {
    id: 2,
    titleKey: 'tenders.items.tender2.title', // Use a key for title
    descriptionKey: 'tenders.items.tender2.description', // Use a key for description
    date: '2025-05-25',
    category: 'electricalEquipment', // Use a category key
    status: 'active', // Use a status key
  },
  {
    id: 3,
    titleKey: 'tenders.items.tender3.title', // Use a key for title
    descriptionKey: 'tenders.items.tender3.description', // Use a key for description
    date: '2025-06-01',
    category: 'constructionWork', // Use a category key
    status: 'closed', // Use a status key
  },
  {
    id: 4,
    titleKey: 'tenders.items.tender4.title', // Use a key for title
    descriptionKey: 'tenders.items.tender4.description', // Use a key for description
    date: '2025-06-05',
    category: 'plumbing', // Use a category key
    status: 'active', // Use a status key
  },
  {
    id: 5,
    titleKey: 'tenders.items.tender5.title', // Use a key for title
    descriptionKey: 'tenders.items.tender5.description', // Use a key for description
    date: '2025-05-15',
    category: 'climateEquipment', // Use a category key
    status: 'closed', // Use a status key
  },
  {
    id: 6,
    titleKey: 'tenders.items.tender6.title', // Use a key for title
    descriptionKey: 'tenders.items.tender6.description', // Use a key for description
    date: '2025-05-10',
    category: 'design', // Use a category key
    status: 'closed', // Use a status key
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
  const [selectedCategory, setSelectedCategory] = useState('allCategories');
  const [filteredTenders, setFilteredTenders] = useState(mockTenders);
  const [activeTab, setActiveTab] = useState('all'); // Tab keys: 'all', 'active', 'closed'


  // Map category keys to translated text for Select options
  const translatedCategories = useMemo(() => {
    return categoryKeys.map(key => ({
      value: key,
      label: t(`tenders.categories.${key}`) // Use translation function
    }));
  }, [t]);

  // Filter tenders based on search query, category, and tab
  useEffect(() => {
    let filtered = [...mockTenders];

    // Filter by search query (search against TRANSLATED title and description)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(tender =>
        t(tender.titleKey).toLowerCase().includes(lowerCaseQuery) || // Translate title before searching
        t(tender.descriptionKey).toLowerCase().includes(lowerCaseQuery) // Translate description before searching
      );
    }

    // Filter by category (compare category key)
    if (selectedCategory !== 'allCategories') {
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
  }, [searchQuery, selectedCategory, activeTab, t]); // Add t to dependency array

  // Function to get translated status text for badge
  const getTranslatedStatus = (statusKey: string) => {
    switch (statusKey) {
      case 'active':
        return t('tenders.statuses.active');
      case 'closed':
        return t('tenders.statuses.closed');
      default:
        return statusKey; // Fallback
    }
  };

   // Function to get badge color based on status key
   const getStatusColorClass = (statusKey: string) => {
     switch (statusKey) {
       case 'active':
         return 'bg-primary text-primary-foreground';
       case 'closed':
         return 'bg-slate-500 text-white';
       default:
         return 'bg-slate-600 text-white';
     }
   };


  // Format date using the locale from translation context
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = t('dateFormat') || 'en-US';
    try {
       return new Intl.DateTimeFormat(locale, {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
       }).format(date);
    } catch (e) {
        console.error(`Error formatting date for locale "${locale}":`, e);
        return dateString;
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-white overflow-x-hidden">
      {/* Helmet for SEO */}
      <Helmet>
        <title>{t('tenders.seo.title')} | {t('footer.companyName')}</title>
        <meta name="description" content={t('tenders.seo.description')} />
        {/* Add other relevant meta tags */}
      </Helmet>

      <NavBar />

      <main>
        {/* Page Header */}
        <PageHeader
          title={t('tenders.title')}
          breadcrumb={`${t('nav.home').toUpperCase()} / ${t('tenders.title').toUpperCase()}`}
          backgroundImage="/lovable-uploads/973129d4-828a-4497-8930-8fda46645e5d.jpg"
        />

        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            {/* Breadcrumbs */}
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
              className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('tenders.intro.title')}</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                {t('tenders.intro.description')}
              </p>
            </motion.div>

            {/* Filters and Tabs */}
            <motion.div
              className="mb-8 grid gap-4 md:flex md:items-center md:justify-between"
              variants={fadeIn}
            >
              {/* Search Input */}
              <div className="relative flex-grow md:flex-grow-0 md:w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t('tenders.filters.searchPlaceholder')}
                  className="pl-9 pr-4 py-2 w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Select */}
              <div className="flex items-center gap-2 md:flex-shrink-0">
                <Filter className="text-slate-400 h-4 w-4" />
                <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary">
                    <SelectValue placeholder={t('tenders.filters.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700">
                    {translatedCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               {/* Tabs List */}
                <Tabs defaultValue="all" className="w-full md:w-max md:ml-auto" onValueChange={setActiveTab}>
                   <TabsList className="grid w-full grid-cols-3 gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700/50 h-auto">
                     <TabsTrigger value="all" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.all')}</TabsTrigger>
                     <TabsTrigger value="active" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.active')}</TabsTrigger>
                     <TabsTrigger value="closed" className="py-2 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base">{t('tenders.tabs.closed')}</TabsTrigger>
                   </TabsList>
                 </Tabs>
            </motion.div>

            {/* Tenders List Grid */}
             <motion.div variants={fadeIn}> {/* Added animation wrapper */}
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
                          whileHover="hover"
                          transition={{ duration: 0.3 }}
                        >
                          {/* Card - Restyled for dark theme */}
                          <Card className={cn(
                             "h-full flex flex-col overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300",
                             "bg-slate-800/40 text-white border-slate-700/50 hover:border-primary/30",
                             tender.status === 'closed' ? "opacity-75" : ""
                          )}
                            style={{ borderLeftColor: tender.status === 'active' ? '#4ade80' : '#8E9196' }}
                          >
                            <CardHeader>
                              <div className="flex justify-between items-start gap-2">
                                {/* Title - Restyled color */}
                                <CardTitle className="text-xl font-bold text-white flex-grow">{t(tender.titleKey)}</CardTitle> {/* Use t() with titleKey */}
                                {/* Status Badge - Restyled color */}
                                <Badge className={cn("text-white", getStatusColorClass(tender.status))}>
                                  {getTranslatedStatus(tender.status)}
                                </Badge>
                              </div>
                              {/* Date - Restyled icon/text color */}
                              <div className="flex items-center text-sm text-slate-400 mt-2">
                                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                <span>{formatDate(tender.date)}</span>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow text-slate-300 leading-relaxed">
                              {/* Category Badge - Restyled */}
                              <div className="mb-3">
                                <Badge variant="secondary" className="mr-2 bg-slate-700/50 text-slate-300 border-slate-600">
                                  {t(`tenders.categories.${tender.category}`)}
                                </Badge>
                              </div>
                              {/* Description */}
                              <p>{t(tender.descriptionKey)}</p> {/* Use t() with descriptionKey */}
                              {/* Optionally add other tender details like location, budget, requirements here */}
                              {/* {tender.location && (
                                <div className="flex items-center text-sm text-slate-400 mt-2">
                                   <MapPin className="mr-2 h-4 w-4 text-rose-400" />
                                   <span>{t('collaboration.tenders.items.locationLabel')}: {t(tender.location)}</span>
                                </div>
                              )} */}
                              {/* ... add budget, requirements if available in mock data and translated ... */}
                            </CardContent>
                            <CardFooter>
                              {/* Button - Restyled for dark theme, added translation */}
                              <Button
                                variant="outline"
                                disabled={tender.status === 'closed'}
                                className={cn(
                                   "w-full flex items-center justify-center gap-2",
                                   "border-slate-600 text-white/90 hover:bg-slate-700/50 hover:border-primary group-hover:border-primary/80 transition-colors",
                                   tender.status === 'closed' && "opacity-50 cursor-not-allowed"
                                )}
                                // Optional: Add an onClick handler if you want a modal or navigation
                                // onClick={() => handleTenderClick(tender.id)}
                              >
                                <FileText className="h-4 w-4" />
                                <span>{t('tenders.items.buttonDetails')}</span>
                                {/* Arrow icon - keep position consistent */}
                                <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      // No Tenders Found Message
                      <motion.div
                        className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-slate-800/40 rounded-xl border border-slate-700/50"
                        variants={fadeIn}
                      >
                        <p className="text-xl text-slate-400">{t('tenders.notFound.title')}</p>
                        <p className="text-slate-500 mt-2">{t('tenders.notFound.description')}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>
                 {/* Add empty TabsContent for 'active' and 'closed' if needed for structure, but the filtering handles display */}
                 {/* Note: This is less efficient as React renders all TabContent. Filtering before map is better. */}
                 {/* The current approach with filtering `filteredTenders` based on `activeTab` before the map is correct. */}
                 {/* Keeping these empty TabsContent is usually only needed if you manage display purely via CSS/Radix states */}
                 {/* <TabsContent value="active" className="mt-0"></TabsContent>
                 <TabsContent value="closed" className="mt-0"></TabsContent> */}
              </Tabs>
             </motion.div> {/* End motion.div around TabsContent */}


            {/* Button below the list (All Tenders) */}
            <div className="text-center mt-10 md:mt-12"> {/* Adjusted spacing */}
                 <Button asChild variant="outline" className="bg-transparent shadow-none hover:bg-slate-700/50 text-white border-slate-600 hover:border-primary px-6 py-2 text-lg"> {/* Dark outline button, adjusted size */}
                   {/* Link to the page showing ALL tenders if this page is filtered by default */}
                   {/* If this page already shows all tenders, this button might link to a dedicated archive or be removed */}
                   <a href="/tenders">{t('tenders.buttonAll')}</a> {/* Use translation and appropriate href */}
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