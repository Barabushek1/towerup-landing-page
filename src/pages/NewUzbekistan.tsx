
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import HeroSection from '../components/newuzbekistan/HeroSection';
import OverviewSection from '../components/newuzbekistan/OverviewSection';
import MasterplanSection from '../components/newuzbekistan/MasterplanSection';
import FeaturesSection from '../components/newuzbekistan/FeaturesSection';
import ApartmentsSection from '../components/newuzbekistan/ApartmentsSection';
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
            <FeaturesSection />
            <ApartmentsSection />
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
