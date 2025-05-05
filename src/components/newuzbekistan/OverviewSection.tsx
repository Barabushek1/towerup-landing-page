
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const OverviewSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section
      id="overview"
      className="py-16 md:py-24 bg-[#1a1a1a] text-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-3 text-white"
          >
            {t('newUzbekistan.overview.title')}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-primary mb-10"
          >
            {t('newUzbekistan.overview.subtitle')}
          </motion.p>
        </motion.div>

        {/* Reworked Grid Layout for Image Arrangement */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left" // Added items-center for vertical alignment
        >
          {/* Text Column (Order 1 on md+) */}
          <motion.div variants={containerVariants} className="flex flex-col justify-center md:order-1">
            <motion.p
              variants={itemVariants}
              className="text-slate-300 mb-4"
            >
              {t('newUzbekistan.overview.desc1')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-slate-300 mb-4"
            >
              {t('newUzbekistan.overview.desc2')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-slate-300"
            >
              {t('newUzbekistan.overview.desc3')}
            </motion.p>
          </motion.div>

          {/* Image Column (Order 2 on md+, was Order 1) */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl overflow-hidden shadow-xl border border-slate-700/50 md:order-2" // Swapped order for md+
             style={{ boxShadow: isInView ? "0 0 15px rgba(64, 220, 129, 0.3)" : "none" }}
          >
            {/* Applied aspect-video to the container and w-full h-full to the image */}
            {/* This ensures the image container maintains a 16:9 aspect ratio */}
            <div className="aspect-video w-full">
               <img
                 src="/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png" // Keep image path
                 alt={t('newUzbekistan.overview.imageAlt') || "Project Overview Image"}
                 className="w-full h-full object-cover" // Image fills the aspect-ratio container
               />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center"
        >
          <a
            href="#masterplan"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="mr-2 text-lg font-medium">{t('home.hero.button')}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default OverviewSection;
