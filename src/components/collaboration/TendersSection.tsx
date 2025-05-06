
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CalendarDays, Building, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

// Sample tender data
const tenders = [
  {
    id: 1,
    title: 'tender1',
    category: 'architecture',
    description: 'tender1',
    requirements: 'tender1',
    location: 'tender1',
    deadline: '2025-07-20',
    budget: '200,000 - 350,000 USD',
    status: 'active'
  },
  {
    id: 2,
    title: 'tender2',
    category: 'construction',
    description: 'tender2',
    requirements: 'tender2',
    location: 'tender2',
    deadline: '2025-08-15',
    budget: '1,500,000 - 2,000,000 USD',
    status: 'active'
  },
  {
    id: 3,
    title: 'tender3',
    category: 'technology',
    description: 'tender3',
    requirements: 'tender3',
    location: 'tender3',
    deadline: '2025-07-30',
    budget: '120,000 - 180,000 USD',
    status: 'active'
  },
  {
    id: 4,
    title: 'tender4',
    category: 'landscaping',
    description: 'tender4',
    requirements: 'tender4',
    location: 'tender4',
    deadline: '2025-09-10',
    budget: '80,000 - 120,000 USD',
    status: 'active'
  }
];

const TendersSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredTenders = selectedCategory === 'all' 
    ? tenders
    : tenders.filter(tender => tender.category === selectedCategory);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRequestDetails = (id: number) => {
    toast({
      title: t('collaboration.tenders.toast.detailsSentTitle'),
      description: t('collaboration.tenders.toast.detailsSentDesc'),
    });
  };

  return (
    <div>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('collaboration.tenders.intro.title')}</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">{t('collaboration.tenders.intro.description')}</p>
          
          <Alert className="bg-blue-900/20 border-blue-800 text-blue-100">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription>
              {t('collaboration.tenders.intro.alert')}
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            variant={selectedCategory === 'all' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryChange('all')}
          >
            All
          </Badge>
          <Badge 
            variant={selectedCategory === 'architecture' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryChange('architecture')}
          >
            {t('collaboration.tenders.categories.architecture')}
          </Badge>
          <Badge 
            variant={selectedCategory === 'construction' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryChange('construction')}
          >
            {t('collaboration.tenders.categories.construction')}
          </Badge>
          <Badge 
            variant={selectedCategory === 'technology' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryChange('technology')}
          >
            {t('collaboration.tenders.categories.technology')}
          </Badge>
          <Badge 
            variant={selectedCategory === 'landscaping' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryChange('landscaping')}
          >
            {t('collaboration.tenders.categories.landscaping')}
          </Badge>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTenders.length > 0 ? (
          filteredTenders.map((tender) => (
            <motion.div
              key={tender.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * tender.id }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/40 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {t(`collaboration.tenders.items.${tender.title}.title`)}
                    </h3>
                    <Badge variant={tender.status === 'active' ? "success" : "secondary"}>
                      {tender.status === 'active' ? 
                        t('collaboration.tenders.statuses.active') : 
                        t('collaboration.tenders.statuses.completed')}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 mb-4">
                    {t(`collaboration.tenders.items.${tender.title}.description`)}
                  </p>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        {t(`collaboration.tenders.items.${tender.title}.location`)}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400 block">
                          {t('collaboration.tenders.items.deadlineLabel')}
                        </span>
                        <span className="text-sm text-slate-300">{tender.deadline}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400 block">
                          {t('collaboration.tenders.items.budgetLabel')}
                        </span>
                        <span className="text-sm text-slate-300">{tender.budget}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400 block">
                          {t('collaboration.tenders.items.requirementsLabel')}
                        </span>
                        <span className="text-sm text-slate-300">
                          {t(`collaboration.tenders.items.${tender.title}.requirements`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {tender.status === 'active' ? (
                      <>
                        <Button size="sm" variant="default" onClick={() => handleRequestDetails(tender.id)}>
                          {t('collaboration.tenders.items.buttonDetails')}
                        </Button>
                        <Button size="sm" variant="outline">
                          {t('collaboration.tenders.buttonApply')}
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        {t('collaboration.tenders.items.buttonCompleted')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-slate-400">{t('collaboration.tenders.noTenders')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TendersSection;
