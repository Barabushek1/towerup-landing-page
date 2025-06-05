
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, FileText, CheckCircle, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CollaborationOffers: React.FC = () => {
  const { t } = useLanguage();

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('suppliers.pageTitle')} | TOWERUP</title>
        <meta name="description" content={t('suppliers.metaDescription')} />
      </Helmet>
      
      <NavBar />
      
      <main>
        <PageHeader 
          title={t('suppliers.title')} 
          breadcrumb={t('suppliers.breadcrumb')}
          backgroundImage="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg"
        />
        
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('suppliers.hero.title')}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('suppliers.hero.description')}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 font-medium">
                  {t('suppliers.hero.alert')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('suppliers.services.title')}</h2>
                <p className="text-lg text-gray-600">{t('suppliers.services.description')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div variants={fadeIn}>
                  <Card className="h-full">
                    <CardHeader>
                      <Package className="h-12 w-12 text-brand-primary mb-4" />
                      <CardTitle>{t('suppliers.services.materials.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{t('suppliers.services.materials.description')}</CardDescription>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.materials.item1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.materials.item2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.materials.item3')}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="h-full">
                    <CardHeader>
                      <FileText className="h-12 w-12 text-brand-primary mb-4" />
                      <CardTitle>{t('suppliers.services.equipment.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{t('suppliers.services.equipment.description')}</CardDescription>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.equipment.item1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.equipment.item2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.equipment.item3')}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="h-full">
                    <CardHeader>
                      <CheckCircle className="h-12 w-12 text-brand-primary mb-4" />
                      <CardTitle>{t('suppliers.services.specialized.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{t('suppliers.services.specialized.description')}</CardDescription>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.specialized.item1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.specialized.item2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('suppliers.services.specialized.item3')}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('suppliers.requirements.title')}</h2>
                <p className="text-lg text-gray-600">{t('suppliers.requirements.description')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{t('suppliers.requirements.basic.title')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.basic.item1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.basic.item2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.basic.item3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.basic.item4')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{t('suppliers.requirements.preferred.title')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.preferred.item1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.preferred.item2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.preferred.item3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t('suppliers.requirements.preferred.item4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('suppliers.process.title')}</h2>
                <p className="text-lg text-gray-600">{t('suppliers.process.description')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((step) => (
                  <motion.div key={step} variants={fadeIn} className="text-center">
                    <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t(`suppliers.process.step${step}.title`)}</h3>
                    <p className="text-gray-600">{t(`suppliers.process.step${step}.description`)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-brand-primary">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">{t('suppliers.contact.title')}</h2>
              <p className="text-xl text-white/80 mb-8">{t('suppliers.contact.description')}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <Phone className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">{t('suppliers.contact.phone.label')}</h3>
                  <p className="text-white/80">+998 55 510 00 03</p>
                </div>
                <div className="flex flex-col items-center">
                  <Mail className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">{t('suppliers.contact.email.label')}</h3>
                  <p className="text-white/80">suppliers@towerup.uz</p>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">{t('suppliers.contact.hours.label')}</h3>
                  <p className="text-white/80">{t('suppliers.contact.hours.value')}</p>
                </div>
              </div>
              
              <Button variant="secondary" size="lg">
                {t('suppliers.contact.button')}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default CollaborationOffers;
