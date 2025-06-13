
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { FileText, Package, ArrowRight, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

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

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }
};

const Collaboration: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('collaboration.pageTitle')}</title>
        <meta name="description" content={t('collaboration.metaDescription')} />
      </Helmet>
      
      <NavBar />
      
      <main>
        <PageHeader 
          title={t('collaboration.title')} 
          breadcrumb={t('collaboration.breadcrumb')}
          backgroundImage="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg"
        />
        
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('collaboration.hero.title')}</h2>
              <p className="text-lg text-gray-600">
                {t('collaboration.hero.description')}
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Tenders Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="h-48 bg-brand-primary/10 flex items-center justify-center">
                  <FileText className="h-24 w-24 text-brand-primary opacity-30" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t('collaboration.tenders.title')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('collaboration.tenders.description')}
                  </p>
                  <Link to="/collaboration/tenders">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <span>{t('collaboration.tenders.button')}</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Commercial Offers Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="h-48 bg-brand-primary/10 flex items-center justify-center">
                  <Package className="h-24 w-24 text-brand-primary opacity-30" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t('collaboration.offers.title')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('collaboration.offers.description')}
                  </p>
                  <Link to="/collaboration/offers">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <span>{t('collaboration.offers.button')}</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('collaboration.benefits.title')}</h2>
              <p className="text-lg text-gray-600">
                {t('collaboration.benefits.description')}
              </p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                {
                  title: t('collaboration.benefits.longTerm.title'),
                  description: t('collaboration.benefits.longTerm.description')
                },
                {
                  title: t('collaboration.benefits.transparent.title'),
                  description: t('collaboration.benefits.transparent.description')
                },
                {
                  title: t('collaboration.benefits.largescale.title'),
                  description: t('collaboration.benefits.largescale.description')
                },
                {
                  title: t('collaboration.benefits.payments.title'),
                  description: t('collaboration.benefits.payments.description')
                },
                {
                  title: t('collaboration.benefits.professional.title'),
                  description: t('collaboration.benefits.professional.description')
                },
                {
                  title: t('collaboration.benefits.development.title'),
                  description: t('collaboration.benefits.development.description')
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                    <Handshake className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-brand-primary">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">{t('collaboration.cta.title')}</h2>
              <p className="text-xl text-white/80 mb-8">
                {t('collaboration.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/collaboration/tenders">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {t('collaboration.cta.tendersButton')}
                  </Button>
                </Link>
                <Link to="/collaboration/offers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-brand-primary">
                    {t('collaboration.cta.offersButton')}
                  </Button>
                </Link>
              </div>
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
