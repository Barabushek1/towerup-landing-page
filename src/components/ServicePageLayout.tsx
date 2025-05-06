
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Helmet } from 'react-helmet-async';

export interface ServicePageProps {
  title: string;
  description: string;
  breadcrumb: string;
  headerImage: string;
  children: React.ReactNode;
}

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ServicePageLayout: React.FC<ServicePageProps> = ({ 
  title, 
  description, 
  breadcrumb,
  headerImage,
  children 
}) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (inView) {
        controls.start('animate');
      }
    }, [controls, inView]);
    
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate={controls}
        variants={staggerContainer}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>{title} | TOWERUP</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <NavBar />

      <main>
        <PageHeader 
          title={title}
          breadcrumb={breadcrumb}
          backgroundImage={headerImage}
        />
        
        {children}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export { ServicePageLayout, AnimatedSection, fadeIn, staggerContainer };
