
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building, 
  Map, 
  Users, 
  TreeDeciduous, 
  MapPin, 
  Shield, 
  Lightbulb,
  Home,
  HeartPulse,
  ShoppingBag,
  Utensils,
  Dumbbell,
  PartyPopper,
  Calendar,
  Car,
  ParkingCircle
} from 'lucide-react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import HeroSection from '../components/newuzbekistan/HeroSection';
import OverviewSection from '../components/newuzbekistan/OverviewSection';
import MasterplanSection from '../components/newuzbekistan/MasterplanSection';
import FeaturesSection from '../components/newuzbekistan/FeaturesSection';
import ApartmentsSection from '../components/newuzbekistan/ApartmentsSection';
import InfrastructureSection from '../components/newuzbekistan/InfrastructureSection';
import GallerySection from '../components/newuzbekistan/GallerySection';
import ProgressSection from '../components/newuzbekistan/ProgressSection';
import LocationSection from '../components/newuzbekistan/LocationSection';
import InvestmentSection from '../components/newuzbekistan/InvestmentSection';
import ContactSection from '../components/newuzbekistan/ContactSection';
import ScrollToTopButton from '../components/ScrollToTopButton';

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
          <InfrastructureSection />
          <GallerySection />
          <ProgressSection />
          <LocationSection />
          <InvestmentSection />
          <ContactSection />
        </motion.div>
      </main>

      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default NewUzbekistan;
