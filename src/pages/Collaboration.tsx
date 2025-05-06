import React from 'react';
import { Helmet } from 'react-helmet-async';
// Assuming PageHeader, NavBar, Footer are styled for dark theme
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
// Assuming Alert, AlertDescription are styled for dark theme
import { Alert, AlertDescription } from '@/components/ui/alert';

// Assuming Breadcrumb components are styled for dark theme
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Import necessary icons
import { Calendar, Users, FileText, CheckCircle, MapPin, Clock, Building, Star, ArrowRight, Phone, Mail, BriefcaseBusiness, Handshake, ClipboardList, Lightbulb, DollarSign, Award, UserCheck } from 'lucide-react';

// Import useLanguage context
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Collaboration: React.FC = () => {
  // Access translation function
  const { t } = useLanguage();

  // --- Hardcoded Data (for demonstration, should ideally come from DB) ---
  // Using translation keys for titles/descriptions where applicable
  const tenders = [
    {
      id: '1',
      title: t('collaboration.tenders.items.tender1.title'),
      category: t('collaboration.tenders.categories.architecture'), // Use key for category
      status: t('collaboration.tenders.statuses.active'), // Use key for status
      deadline: '2025-08-15', // Keep date string format
      description: t('collaboration.tenders.items.tender1.description'),
      requirements: t('collaboration.tenders.items.tender1.requirements'),
      budget: '$250,000 - $350,000', // Keep budget string
      location: t('collaboration.tenders.items.tender1.location') // Use key for location
    },
    {
      id: '2',
      title: t('collaboration.tenders.items.tender2.title'),
      category: t('collaboration.tenders.categories.construction'), // Use key
      status: t('collaboration.tenders.statuses.active'), // Use key
      deadline: '2025-09-10',
      description: t('collaboration.tenders.items.tender2.description'),
      requirements: t('collaboration.tenders.items.tender2.requirements'),
      budget: '$5M - $7M',
      location: t('collaboration.tenders.items.tender2.location') // Use key
    },
    {
      id: '3',
      title: t('collaboration.tenders.items.tender3.title'),
      category: t('collaboration.tenders.categories.technology'), // Use key
      status: t('collaboration.tenders.statuses.completed'), // Use key
      deadline: '2025-06-01',
      description: t('collaboration.tenders.items.tender3.description'),
      requirements: t('collaboration.tenders.items.tender3.requirements'),
      budget: '$800,000 - $1.2M',
      location: t('collaboration.tenders.items.tender3.location') // Use key
    },
    {
      id: '4',
      title: t('collaboration.tenders.items.tender4.title'),
      category: t('collaboration.tenders.categories.landscaping'), // Use key
      status: t('collaboration.tenders.statuses.active'), // Use key
      deadline: '2025-07-20',
      description: t('collaboration.tenders.items.tender4.description'),
      requirements: t('collaboration.tenders.items.tender4.requirements'),
      budget: '$300,000 - $450,000',
      location: t('collaboration.tenders.items.tender4.location') // Use key
    }
  ];

  const partners = [
    {
      id: '1',
      name: t('collaboration.partners.items.partner1.name'),
      category: t('collaboration.partners.categories.construction'), // Use key
      description: t('collaboration.partners.items.partner1.description'),
      logo: '/placeholder.svg', // Use actual logo paths
      since: '2015',
      projects: 28,
      employees: '500+',
      achievements: [t('collaboration.partners.items.partner1.achievement1'), t('collaboration.partners.items.partner1.achievement2')] // Use keys
    },
    {
      id: '2',
      name: t('collaboration.partners.items.partner2.name'),
      category: t('collaboration.partners.categories.design'), // Use key
      description: t('collaboration.partners.items.partner2.description'),
      logo: '/placeholder.svg', // Use actual logo paths
      since: '2012',
      projects: 45,
      employees: '80+',
      achievements: [t('collaboration.partners.items.partner2.achievement1'), t('collaboration.partners.items.partner2.achievement2')] // Use keys
    },
    {
      id: '3',
      name: t('collaboration.partners.items.partner3.name'),
      category: t('collaboration.partners.categories.materials'), // Use key
      description: t('collaboration.partners.items.partner3.description'),
      logo: '/placeholder.svg', // Use actual logo paths
      since: '2018',
      projects: 120,
      employees: '200+',
      achievements: [t('collaboration.partners.items.partner3.achievement1'), t('collaboration.partners.items.partner3.achievement2')] // Use keys
    },
    {
      id: '4',
      name: t('collaboration.partners.items.partner4.name'),
      category: t('collaboration.partners.categories.engineering'), // Use key
      description: t('collaboration.partners.items.partner4.description'),
      logo: '/placeholder.svg', // Use actual logo paths
      since: '2016',
      projects: 67,
      employees: '150+',
      achievements: [t('collaboration.partners.items.partner4.achievement1'), t('collaboration.partners.items.partner4.achievement2')] // Use keys
    }
  ];

  const testimonials = [
    {
      id: '1',
      name: t('collaboration.testimonials.item1.name'),
      position: t('collaboration.testimonials.item1.position'), // Use key
      text: t('collaboration.testimonials.item1.text'), // Use key
      company: t('collaboration.testimonials.item1.company'), // Use key
      photo: '/placeholder.svg', // Use actual photo paths
      rating: 5
    },
    {
      id: '2',
      name: t('collaboration.testimonials.item2.name'),
      position: t('collaboration.testimonials.item2.position'), // Use key
      text: t('collaboration.testimonials.item2.text'), // Use key
      company: t('collaboration.testimonials.item2.company'), // Use key
      photo: '/placeholder.svg', // Use actual photo paths
      rating: 5
    },
    {
      id: '3',
      name: t('collaboration.testimonials.item3.name'),
      position: t('collaboration.testimonials.item3.position'), // Use key
      text: t('collaboration.testimonials.item3.text'), // Use key
      company: t('collaboration.testimonials.item3.company'), // Use key
      photo: '/placeholder.svg', // Use actual photo paths
      rating: 4
    }
  ];

  const partnershipTypes = [
    {
      title: t('collaboration.partnershipTypes.generalContractor.title'), // Use key
      icon: <Building className="h-10 w-10 text-primary" />, // Primary icon color
      description: t('collaboration.partnershipTypes.generalContractor.description'), // Use key
      benefits: [t('collaboration.partnershipTypes.generalContractor.benefit1'), t('collaboration.partnershipTypes.generalContractor.benefit2'), t('collaboration.partnershipTypes.generalContractor.benefit3')] // Use keys
    },
    {
      title: t('collaboration.partnershipTypes.subcontractor.title'), // Use key
      icon: <UserCheck className="h-10 w-10 text-blue-400" />, // Different icon/color
      description: t('collaboration.partnershipTypes.subcontractor.description'), // Use key
      benefits: [t('collaboration.partnershipTypes.subcontractor.benefit1'), t('collaboration.partnershipTypes.subcontractor.benefit2'), t('collaboration.partnershipTypes.subcontractor.benefit3')] // Use keys
    },
    {
      title: t('collaboration.partnershipTypes.supplier.title'), // Use key
      icon: <Award className="h-10 w-10 text-amber-400" />, // Different icon/color
      description: t('collaboration.partnershipTypes.supplier.description'), // Use key
      benefits: [t('collaboration.partnershipTypes.supplier.benefit1'), t('collaboration.partnershipTypes.supplier.benefit2'), t('collaboration.partnershipTypes.supplier.benefit3')] // Use keys
    }
  ];

  const getStatusColor = (status: string) => {
    // Use translation keys for comparison
    const activeStatus = t('collaboration.tenders.statuses.active');
    const completedStatus = t('collaboration.tenders.statuses.completed');

    switch (status) {
      case activeStatus: // Compare with translated status
        return 'bg-primary text-primary-foreground'; // Use primary badge style
      case completedStatus: // Compare with translated status
        return 'bg-slate-500 text-white'; // Use muted gray
      default:
        return 'bg-blue-500 text-white'; // Fallback (shouldn't happen with these statuses)
    }
  };

  // --- Handlers (Keep logic, add toast translations) ---
  const handleTenderClick = (tenderId: string) => {
    console.log(`Tender ${tenderId} clicked.`); // Log which tender was clicked
    // In a real app, you'd redirect or show detailed info/application form
    toast({
      title: t('collaboration.tenders.toast.detailsSentTitle'), // Use translation
      description: t('collaboration.tenders.toast.detailsSentDesc'), // Use translation
    });
  };

  const handlePartnershipRequest = () => {
    console.log('Partnership request initiated.');
    // In a real app, this would link to a form or open a modal form
    toast({
      title: t('collaboration.partnership.toast.requestAcceptedTitle'), // Use translation
      description: t('collaboration.partnership.toast.requestAcceptedDesc'), // Use translation
    });
     // Optionally scroll to a contact form section if you integrate one here
     // document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Render ---
  return (
    // Use consistent dark theme background
    <div className="min-h-screen antialiased bg-[#161616] text-white overflow-x-hidden">
      {/* Helmet for SEO */}
      <Helmet>
        <title>{t('collaboration.seo.title')} | {t('footer.companyName')}</title>
        <meta name="description" content={t('collaboration.seo.description')} />
        {/* Add other relevant meta tags like keywords, OG, Twitter */}
      </Helmet>

      <NavBar /> {/* Include the standard NavBar */}

      <main>
        {/* Page Header */}
        <PageHeader
          // Use translation for title
          title={t('collaboration.title')}
          // Use translation for breadcrumb
          breadcrumb={`${t('nav.home').toUpperCase()} / ${t('collaboration.title').toUpperCase()}`}
          // Use an image appropriate for Collaboration, potentially site-wide if not project specific
          backgroundImage="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" // Use an appropriate image path
          // Removed autoplay/interval as they seem specific to sliding headers, not standard PageHeader
          // autoplay={true}
          // interval={5000}
        />

        <div className="container mx-auto px-6 py-12 md:py-16"> {/* Use px-6, consistent padding */}
          {/* Breadcrumbs - Restyled for dark theme */}
          <Breadcrumb className="mb-8 text-slate-400">
            <BreadcrumbList>
              <BreadcrumbItem>
                {/* Use translation for Home link */}
                <BreadcrumbLink href="/" className="hover:text-primary">{t('nav.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-600" /> {/* Restyle separator */}
              <BreadcrumbItem>
                {/* Use translation for current page */}
                <span className="text-white">{t('collaboration.title')}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Intro Section */}
          <div className="text-center mb-12 md:mb-16">
            {/* Use translation for title and subtitle */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('collaboration.intro.title')}</h2> {/* Primary heading color */}
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"> {/* Adjusted text color */}
              {t('collaboration.intro.description')}
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="tenders" className="mb-12 md:mb-16"> {/* Consistent spacing */}
            {/* Tabs List - Restyled for dark theme */}
            <TabsList className="grid w-full grid-cols-2 gap-1 p-1 mb-8 bg-slate-800 rounded-lg border border-slate-700/50 h-auto">
              {/* Tabs Trigger - Restyled for dark theme */}
              <TabsTrigger
                value="tenders"
                // Keep onClick if you have specific side effects, otherwise useState is enough
                // onClick={() => setActiveTab('tenders')}
                className="py-3 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base"
              >
                {/* Use translation for tab label */}
                <ClipboardList className="mr-2 h-5 w-5" /> {/* Changed icon */}
                {t('collaboration.tabs.tenders')}
              </TabsTrigger>
              <TabsTrigger
                value="partners"
                // Keep onClick if you have specific side effects
                // onClick={() => setActiveTab('partners')}
                 className="py-3 px-2 data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white text-white/70 hover:text-white transition-all font-medium rounded-md text-sm md:text-base"
              >
                {/* Use translation for tab label */}
                <Handshake className="mr-2 h-5 w-5" /> {/* Changed icon */}
                {t('collaboration.tabs.partners')}
              </TabsTrigger>
            </TabsList>

            {/* Tenders Tab Content */}
            <TabsContent value="tenders" className="space-y-8 animate-fade-in">
              {/* Tenders Intro Block - Restyled for dark theme */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 p-6 md:p-8 mb-10"> {/* Dark card style, adjusted padding */}
                <div className="relative z-10">
                  {/* Use translation for heading and paragraph */}
                  <h3 className="text-2xl font-bold mb-3 text-white">{t('collaboration.tenders.intro.title')}</h3> {/* Heading color */}
                  <p className="text-slate-300 mb-4 max-w-3xl leading-relaxed"> {/* Text color */}
                    {t('collaboration.tenders.intro.description')}
                  </p>
                  {/* Alert - Restyled for dark theme */}
                  <Alert className="bg-slate-700/50 border-primary/30 text-slate-300">
                    <AlertDescription className="flex items-center text-primary"> {/* Icon color */}
                      <Calendar className="mr-2 h-5 w-5 flex-shrink-0 text-primary" /> {/* Icon color */}
                      {/* Use translation for alert text */}
                      <span>{t('collaboration.tenders.intro.alert')}</span>
                    </AlertDescription>
                  </Alert>
                </div>
                {/* Removed the gradient div */}
              </div>

              {/* Tenders List Grid - Restyled for dark theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenders.map((tender) => (
                  // Card - Restyled for dark theme
                  <Card key={tender.id} className={cn(
                     "overflow-hidden group border-slate-700/50 hover:border-primary/30 transition-all duration-300",
                     "bg-slate-800/40 text-white", // Card dark styles
                     tender.status === t('collaboration.tenders.statuses.completed') ? "opacity-75" : "" // Keep opacity for completed
                  )}>
                    {/* Status Bar - Restyled colors */}
                    <div className={cn("h-2 w-full", getStatusColor(tender.status))} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        {/* Status Badge - Restyled colors */}
                        <Badge className={cn("text-white", getStatusColor(tender.status))}>
                          {tender.status}
                        </Badge>
                        {/* Category Badge - Restyled colors */}
                        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">{tender.category}</Badge>
                      </div>
                      {/* Card Title - Restyled color and hover effect */}
                      <CardTitle className="text-xl mt-3 text-white group-hover:text-primary transition-colors">
                        {tender.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 space-y-4 text-slate-300"> {/* Restyled text color */}
                      {/* Description */}
                      <p className="text-sm">{tender.description}</p>

                      {/* Details List - Restyled icon colors */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-primary" /> {/* Primary icon color */}
                          {/* Use translation for "Срок подачи:" */}
                          <span>{t('collaboration.tenders.items.deadlineLabel')}: {format(new Date(tender.deadline), 'dd.MM.yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-rose-400" /> {/* Distinct color for location */}
                          <span>{tender.location}</span>
                        </div>
                        {tender.budget && (
                          <div className="flex items-start">
                             <DollarSign className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" /> {/* Distinct color for budget */}
                            {/* Use translation for "Бюджет:" */}
                            <p className="font-medium">{t('collaboration.tenders.items.budgetLabel')}: {tender.budget}</p>
                          </div>
                        )}
                         {tender.requirements && (
                            <div className="flex items-start">
                                <ClipboardList className="mr-2 h-4 w-4 text-indigo-400 flex-shrink-0" /> {/* Distinct color for requirements */}
                                <p className="text-sm">{t('collaboration.tenders.items.requirementsLabel')}: {tender.requirements}</p> {/* Use translation */}
                            </div>
                         )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {/* Button - Restyled, added translation keys */}
                      <Button
                        variant="outline"
                        disabled={tender.status === t('collaboration.tenders.statuses.completed')} // Compare with translated status
                        className={cn(
                           "w-full",
                           "border-slate-600 text-white/90 hover:bg-slate-700/50 hover:border-primary group-hover:border-primary/80 transition-colors", // Dark outline button style
                           tender.status === t('collaboration.tenders.statuses.completed') && "opacity-50 cursor-not-allowed" // Style for disabled state
                        )}
                        onClick={() => handleTenderClick(tender.id)}
                      >
                        {/* Use translation for button text */}
                        {tender.status === t('collaboration.tenders.statuses.completed') ? t('collaboration.tenders.items.buttonCompleted') : t('collaboration.tenders.items.buttonDetails')}
                        {tender.status !== t('collaboration.tenders.statuses.completed') && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Buttons below Tenders list - Restyled, added translation keys */}
              <div className="text-center mt-10 md:mt-12 space-x-4">
                <Button variant="outline" className="bg-transparent shadow-none hover:bg-slate-700/50 text-white border-slate-600 hover:border-primary px-6 py-2"> {/* Dark outline button */}
                   {t('collaboration.tenders.buttonAll')} {/* Use translation */}
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 py-2 group" // Primary button style
                  onClick={() => handlePartnershipRequest()} // Keep handler
                >
                  {t('collaboration.tenders.buttonApply')} {/* Use translation */}
                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </TabsContent>

            {/* Partners Tab Content */}
            <TabsContent value="partners" className="space-y-8 animate-fade-in">
               {/* Partners Intro Block - Restyled for dark theme */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 p-6 md:p-8 mb-10"> {/* Dark card style, adjusted padding */}
                <div className="relative z-10">
                  {/* Use translation for heading and paragraph */}
                  <h3 className="text-2xl font-bold mb-3 text-white">{t('collaboration.partnership.intro.title')}</h3> {/* Heading color */}
                  <p className="text-slate-300 mb-4 max-w-3xl leading-relaxed"> {/* Text color */}
                    {t('collaboration.partnership.intro.description')}
                  </p>
                  {/* Alert - Restyled for dark theme */}
                   <Alert className="bg-slate-700/50 border-primary/30 text-slate-300">
                    <AlertDescription className="flex items-center text-primary"> {/* Icon color */}
                      <Handshake className="mr-2 h-5 w-5 flex-shrink-0 text-primary" /> {/* Icon color */}
                       {/* Use translation for alert text */}
                      <span>{t('collaboration.partnership.intro.alert')}</span>
                    </AlertDescription>
                  </Alert>
                </div>
                 {/* Removed the gradient div */}
              </div>

              {/* Partnership Types Grid - Restyled for dark theme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {partnershipTypes.map((type, index) => (
                  // Partnership Type Card - Restyled for dark theme
                  <div key={index} className="bg-slate-800/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700/50 hover:border-primary/30"> {/* Dark card style */}
                    {/* Icon - Color handled in data mapping */}
                    <div className="mb-4 text-primary">{type.icon}</div> {/* Ensure icon color is applied via data */}
                    {/* Title - Restyled color */}
                    <h4 className="text-xl font-semibold mb-2 text-white">{type.title}</h4>
                    {/* Description - Restyled color */}
                    <p className="text-slate-300 mb-4 leading-relaxed">{type.description}</p>
                    {/* Benefits List - Restyled */}
                    <ul className="space-y-2">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-300"> {/* Text color */}
                           {/* Checkmark icon - Restyled */}
                          <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0" /> {/* Primary icon color */}
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Partners List Grid - Restyled for dark theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {partners.map((partner) => (
                   // Partner Card - Restyled for dark theme
                  <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-all border-slate-700/50 hover:border-primary/30 bg-slate-800/40 text-white group"> {/* Dark card style */}
                    {/* Logo Container - Restyled */}
                    <div className="h-36 relative bg-slate-700/50"> {/* Darker background, slightly taller */}
                      <AspectRatio ratio={16/9}>
                        <div className="w-full h-full flex items-center justify-center">
                          {/* Logo Image */}
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="max-h-24 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </AspectRatio>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        {/* Category Badge - Restyled */}
                        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">{partner.category}</Badge>
                        {/* "Since" text - Restyled */}
                        <div className="flex items-center text-sm text-slate-400"> {/* Text color */}
                          <Clock className="mr-1 h-4 w-4 text-slate-400" /> {/* Icon color */}
                          {/* Use translation for "С" */}
                          <span>{t('collaboration.partners.items.sinceLabel')} {partner.since}</span>
                        </div>
                      </div>
                      {/* Partner Name - Restyled color and hover */}
                      <CardTitle className="text-xl mt-2 text-white group-hover:text-primary transition-colors">{partner.name}</CardTitle>
                    </CardHeader>
                    {/* Description and Stats - Restyled */}
                    <CardContent className="space-y-3 text-slate-300"> {/* Text color */}
                      <p className="text-sm leading-relaxed">{partner.description}</p>
                      {/* Stats Grid - Restyled backgrounds and text */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-700/50 p-2 rounded-md">
                          <p className="text-xs text-slate-400">{t('collaboration.partners.items.projectsLabel')}</p> {/* Use translation */}
                          <p className="font-semibold text-white">{partner.projects}</p> {/* Text color */}
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded-md">
                          <p className="text-xs text-slate-400">{t('collaboration.partners.items.employeesLabel')}</p> {/* Use translation */}
                          <p className="font-semibold text-white">{partner.employees}</p> {/* Text color */}
                        </div>
                      </div>
                       {/* Achievements List (Optional display) */}
                        {/* {partner.achievements && partner.achievements.length > 0 && (
                            <ul className="space-y-1 mt-3 text-xs text-slate-400">
                                {partner.achievements.map((ach, idx) => <li key={idx} className="flex items-center"><Award className="h-3 w-3 mr-1 text-amber-400" /> {ach}</li>)}
                            </ul>
                        )} */}
                    </CardContent>
                    <CardFooter>
                       {/* Partner Details Button - Restyled, added translation */}
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-white/90 hover:bg-slate-700/50 hover:border-primary group-hover:border-primary/80 transition-colors" // Dark outline button style
                      >
                        {t('collaboration.partners.items.buttonDetails')} {/* Use translation */}
                         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Final 'Become a partner' block - Restyled */}
              <div className="relative">
                {/* Removed the gradient overlay div */}
                 <div className="relative bg-slate-800/60 border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-lg"> {/* Dark background/border */}
                  <div className="text-center mb-6 md:mb-8">
                     {/* Heading - Restyled color */}
                    <h3 className="text-2xl font-bold mb-3 text-white">{t('collaboration.partnership.ctaBlock.title')}</h3>
                    {/* Paragraph - Restyled color */}
                    <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                      {t('collaboration.partnership.ctaBlock.description')}
                    </p>
                  </div>
                  <div className="text-center">
                     {/* Button - Restyled for dark theme, added translation */}
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 py-3 group" // Primary button style
                      onClick={() => handlePartnershipRequest()} // Keep handler
                    >
                      {t('collaboration.partnership.ctaBlock.button')} {/* Use translation */}
                       <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Separator - Restyled */}
          <Separator className="my-12 md:my-16 bg-slate-700/50" /> {/* Darker separator */}

          {/* Testimonials Section - Restyled for dark theme */}
          <section className="mb-12 md:mb-16"> {/* Consistent spacing */}
            <div className="text-center mb-10 md:mb-12">
              {/* Heading - Restyled color */}
              <h2 className="text-3xl font-bold mb-4 text-white">{t('collaboration.testimonials.title')}</h2>
              {/* Paragraph - Restyled color */}
              <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t('collaboration.testimonials.description')}
              </p>
            </div>

            {/* Testimonials Grid - Restyled cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                // Testimonial Card - Restyled for dark theme
                <div
                  key={testimonial.id}
                  className="bg-slate-800/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700/50 hover:border-primary/30" // Dark card style
                >
                  {/* Header (Photo and Name/Position) - Restyled text colors */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-slate-700"> {/* Dark background for placeholder */}
                      {/* Photo - Use actual paths */}
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name} // Alt text
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4> {/* Name color */}
                      <p className="text-sm text-slate-400">{testimonial.position}</p> {/* Position color */}
                    </div>
                  </div>
                  {/* Rating Stars - Keep logic and colors */}
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} // Ensure gray is visible
                      />
                    ))}
                  </div>
                  {/* Testimonial Text - Restyled color */}
                  <p className="text-slate-300 italic leading-relaxed">"{testimonial.text}"</p> {/* Text color */}
                  {/* Optional: Add company name below text */}
                  {testimonial.company && (
                      <p className="text-sm text-slate-400 mt-3 font-medium">- {testimonial.company}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Benefits and Contact Block - Restyled for dark theme */}
          <div className="mt-12 md:mt-16"> {/* Consistent spacing */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12"> {/* Adjusted gap */}
              {/* Benefits List - Restyled */}
              <div className="md:w-1/2 mb-8 md:mb-0">
                {/* Heading - Restyled color */}
                <h3 className="text-2xl font-bold mb-6 text-white">{t('collaboration.benefitsBlock.title')}</h3>
                <ul className="space-y-4">
                  {[ // Use translation keys for list items
                    t('collaboration.benefitsBlock.item1'),
                    t('collaboration.benefitsBlock.item2'),
                    t('collaboration.benefitsBlock.item3'),
                    t('collaboration.benefitsBlock.item4'),
                    t('collaboration.benefitsBlock.item5')
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-slate-300"> {/* Text color */}
                      {/* Checkmark icon - Restyled */}
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 flex-shrink-0"> {/* Primary styling */}
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="leading-relaxed">{item}</span> {/* Item text */}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Contact Card - Restyled */}
              <div className="md:w-5/12">
                <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl transition-all"> {/* Dark card style */}
                  {/* Heading - Restyled color */}
                  <h4 className="text-xl font-semibold mb-4 text-white">{t('collaboration.contactBlock.title')}</h4>
                  {/* Paragraph - Restyled color */}
                  <p className="mb-4 text-slate-300 leading-relaxed">
                    {t('collaboration.contactBlock.description')}
                  </p>
                  {/* Contact Info List - Restyled icons and text colors */}
                  <div className="space-y-4">
                    <div className="flex items-start"> {/* Added items-start for multi-line text */}
                      <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" /> {/* Primary icon color */}
                      <div>
                        <p className="font-medium text-white mb-0.5">{t('collaboration.contactBlock.tendersEmailLabel')}:</p> {/* Use translation */}
                        {/* Email link - Restyled color */}
                        <a href="mailto:tenders@towerup.uz" className="text-primary hover:text-primary/80 transition-colors">tenders@towerup.uz</a>
                      </div>
                    </div>
                    <div className="flex items-start"> {/* Added items-start */}
                      <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" /> {/* Primary icon color */}
                      <div>
                        <p className="font-medium text-white mb-0.5">{t('collaboration.contactBlock.partnershipEmailLabel')}:</p> {/* Use translation */}
                        {/* Email link - Restyled color */}
                        <a href="mailto:partners@towerup.uz" className="text-primary hover:text-primary/80 transition-colors">partners@towerup.uz</a>
                      </div>
                    </div>
                    <div className="flex items-start"> {/* Added items-start */}
                      <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" /> {/* Primary icon color */}
                      <div>
                        <p className="font-medium text-white mb-0.5">{t('collaboration.contactBlock.phoneLabel')}:</p> {/* Use translation */}
                        {/* Phone number - Restyled color */}
                        <a href="tel:+998711234567" className="text-primary hover:text-primary/80 transition-colors">+998 71 123-45-67</a>
                      </div>
                    </div>
                  </div>
                  {/* Button - Restyled for dark theme, added translation */}
                  <div className="mt-6">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 py-2" // Primary button style
                      onClick={() => handlePartnershipRequest()} // Keep handler
                    >
                      {t('collaboration.contactBlock.button')} {/* Use translation */}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* Include the standard Footer */}
    </div>
  );
};

export default Collaboration;
