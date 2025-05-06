
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import TendersSection from '@/components/collaboration/TendersSection';
import CommercialProposalsSection from '@/components/collaboration/CommercialProposalsSection';

const Collaboration: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("tenders");

  useEffect(() => {
    // Get the tab from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'tenders' || tab === 'proposals') {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <div className="min-h-screen antialiased bg-background text-foreground flex flex-col">
      <Helmet>
        <title>{t('collaboration.seo.title')} | TOWER UP</title>
        <meta name="description" content={t('collaboration.seo.description')} />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow">
        <PageHeader 
          title={t('collaboration.title')} 
          breadcrumb={t('collaboration.title')}
          backgroundImage="/lovable-uploads/de7201e1-d410-4ab8-ac45-996e9ae4333f.jpg"
        />
        
        <section className="bg-gradient-to-b from-[#161616] to-[#1a1a1a] py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 max-w-3xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('collaboration.intro.title')}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                {t('collaboration.intro.description')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Tabs 
                defaultValue="tenders" 
                value={activeTab} 
                onValueChange={(value) => {
                  setActiveTab(value);
                  // Update URL without page reload
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', value);
                  window.history.pushState({}, '', url);
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full max-w-md mb-12">
                  <TabsTrigger value="tenders">
                    {t('collaboration.tabs.tenders')}
                  </TabsTrigger>
                  <TabsTrigger value="proposals">
                    {t('collaboration.tabs.partners')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tenders">
                  <TendersSection />
                </TabsContent>
                
                <TabsContent value="proposals">
                  <CommercialProposalsSection />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Collaboration;
