
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import HeroSection from '../components/massivuzbekistan/HeroSection';
import OverviewSection from '../components/massivuzbekistan/OverviewSection';
import MasterplanSection from '../components/massivuzbekistan/MasterplanSection';
import FeaturesSection from '../components/massivuzbekistan/FeaturesSection';
import ApartmentsSection from '../components/massivuzbekistan/ApartmentsSection';
import GallerySection from '../components/massivuzbekistan/GallerySection';
import FloorPlansSection from '../components/massivuzbekistan/FloorPlansSection';
import CostCalculatorSection from '../components/massivuzbekistan/CostCalculatorSection';
import ContactSection from '../components/ContactSection';
import ScrollToTopButton from '../components/ScrollToTopButton';

const MassivUzbekistan: React.FC = () => {
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
        <title>{t('massivUzbekistan.title')} | TOWER UP</title>
        <meta name="description" content={t('massivUzbekistan.subtitle')} />
        <meta property="og:title" content={`${t('massivUzbekistan.title')} | TOWER UP`} />
        <meta property="og:description" content={t('massivUzbekistan.subtitle')} />
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
            <FloorPlansSection />
            <CostCalculatorSection />
            <ContactSection />
          </motion.div>
        </main>

        <ScrollToTopButton />
        <Footer />
      </div>
    </>
  );
};

export default MassivUzbekistan;
