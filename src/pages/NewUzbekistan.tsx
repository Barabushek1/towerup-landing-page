
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Building, Calendar, Home, MapPin, Users } from 'lucide-react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import HeroSection from '../components/newuzbekistan/HeroSection';
import OverviewSection from '../components/newuzbekistan/OverviewSection';
import MasterplanSection from '../components/newuzbekistan/MasterplanSection';
import FeaturesSection from '../components/newuzbekistan/FeaturesSection';
import GallerySection from '../components/newuzbekistan/GallerySection';
import ContactSection from '../components/ContactSection';
import ScrollToTopButton from '../components/ScrollToTopButton';
import FloorPlansSection from '../components/FloorPlansSection';
import ApartmentCalculator from '../components/ApartmentCalculator';

const NewUzbekistan: React.FC = () => {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation purposes
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('newUzbekistan.title')} | TOWER UP</title>
        <meta name="description" content={t('newUzbekistan.subtitle')} />
        <meta property="og:title" content={`${t('newUzbekistan.title')} | TOWER UP`} />
        <meta property="og:description" content={t('newUzbekistan.subtitle')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-[#1A1F2C] text-white min-h-screen">
        <NavBar />
        
        <main className="overflow-x-hidden">
          <HeroSection />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <OverviewSection />
            <MasterplanSection />
            
            {/* Main Characteristics Section like in Pushkin */}
            <section className="py-16 md:py-24 bg-[#1a1a1a]">
              <div className="container mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-16">
                  <h3 className="text-2xl font-semibold text-white mb-5 text-center">Основные характеристики</h3>
                  <div className="flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4 max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Расположение</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />г. Ташкент, Янгихаётский район
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Год</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />2023-2025
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Площадь</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" />150 000 м²
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Статус</div>
                      <div className="text-base font-medium text-white">
                        <span className="bg-primary/20 px-2.5 py-0.5 rounded text-primary text-sm">
                          Строительство
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Этажность</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />9
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-0.5 uppercase tracking-wider">Помещений</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />1800+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <FeaturesSection />
            
            {/* Improved Gallery Section using the GallerySection component */}
            <GallerySection />
            
            {/* Floor Plans Section (like in Pushkin) */}
            <section id="floor-plans" className="py-20 md:py-24 bg-[#161616]">
              <FloorPlansSection projectId="new-uzbekistan" pricePerSqm={12000000} />
            </section>
            
            {/* Calculator Section (like in Pushkin) */}
            <section className="py-16 md:py-24 bg-[#1a1a1a]" id="calculator">
              <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-12 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wider flex items-center gap-2">
                    Расчет стоимости
                  </h2>
                  <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
                  <p className="text-slate-300 text-lg max-w-3xl mb-8">
                    Рассчитайте примерную стоимость квартиры в жилом комплексе {t('newUzbekistan.title')}, 
                    основываясь на текущей цене за квадратный метр.
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <ApartmentCalculator />
                </div>
              </div>
            </section>
            
            {/* Location Section (before Contact Section) */}
            <section id="location" className="py-20 md:py-24 bg-[#1a1a1a]">
              <div className="container mx-auto px-6">
                <motion.div 
                  className="flex flex-col items-center mb-12 md:mb-16 text-center" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wider">Расположение</h2>
                  <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
                  <p className="text-slate-300 text-lg max-w-3xl mb-8">
                    {t('newUzbekistan.title')} расположен в удобном месте с развитой инфраструктурой и хорошей транспортной доступностью.
                  </p>
                  <div className="inline-flex items-center justify-center text-lg bg-slate-800/40 px-6 py-3 rounded-lg border border-slate-700/50">
                    <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-200">г. Ташкент, Янгихаётский район</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/50" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="aspect-video w-full bg-slate-700">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d69.1731!3d41.2719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE2JzE4LjgiTiA2OcKwMTAnMjMuMiJF!5e0!3m2!1sen!2sus!4v1620132632164&q=Янгихаётский%20район%20Ташкент"
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade" 
                      title={`Карта расположения - ${t('newUzbekistan.title')}`}
                      className="w-full h-full block"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </section>
            
            <ContactSection />
          </motion.div>
        </main>

        <ScrollToTopButton />
        <Footer />
      </div>
    </>
  );
};

export default NewUzbekistan;
