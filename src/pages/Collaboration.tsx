
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
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Сотрудничество | TOWERUP</title>
        <meta name="description" content="Информация о возможностях сотрудничества с компанией TOWERUP - тендеры и коммерческие предложения." />
      </Helmet>
      
      <NavBar />
      
      <main>
        <PageHeader 
          title="Сотрудничество" 
          breadcrumb="Сотрудничество"
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
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Станьте нашим партнером</h2>
              <p className="text-lg text-gray-600">
                TOWERUP строит долгосрочные партнерские отношения с поставщиками 
                строительных материалов, оборудования и услуг. Мы ценим надежность, 
                качество и инновации.
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
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Тендеры</h3>
                  <p className="text-gray-600 mb-4">
                    Актуальные тендеры на закупку строительных материалов, оборудования и услуг 
                    для текущих проектов TOWERUP.
                  </p>
                  <Link to="/collaboration/tenders">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <span>Перейти к тендерам</span>
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
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Коммерческие предложения</h3>
                  <p className="text-gray-600 mb-4">
                    Отправьте ваше коммерческое предложение о сотрудничестве. 
                    Мы открыты к взаимовыгодному партнерству.
                  </p>
                  <Link to="/collaboration/offers">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <span>Отправить предложение</span>
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
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Преимущества сотрудничества</h2>
              <p className="text-lg text-gray-600">
                Работая с TOWERUP, вы получаете надежного партнера и доступ к масштабным проектам
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
                  title: "Долгосрочные контракты",
                  description: "Мы заинтересованы в построении стабильных деловых отношений с нашими партнерами"
                },
                {
                  title: "Прозрачные условия",
                  description: "Четкие требования и справедливые условия оплаты для всех поставщиков"
                },
                {
                  title: "Масштабные проекты",
                  description: "Участие в реализации крупных строительных и инфраструктурных проектов"
                },
                {
                  title: "Своевременные платежи",
                  description: "Гарантируем своевременную оплату согласно договорным обязательствам"
                },
                {
                  title: "Профессиональный подход",
                  description: "Работа с опытными специалистами по закупкам и техническими экспертами"
                },
                {
                  title: "Развитие бизнеса",
                  description: "Возможность расширения вашего бизнеса через партнерство с TOWERUP"
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
              <h2 className="text-3xl font-bold mb-4 text-white">Готовы начать сотрудничество?</h2>
              <p className="text-xl text-white/80 mb-8">
                Выберите подходящий для вас формат взаимодействия и присоединяйтесь к команде наших партнеров
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/collaboration/tenders">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Посмотреть тендеры
                  </Button>
                </Link>
                <Link to="/collaboration/offers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-brand-primary">
                    Отправить предложение
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
