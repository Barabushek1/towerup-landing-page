
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      className="py-20 bg-gradient-to-b from-blue-50 to-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
          >
            {t('newUzbekistan.overview.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-blue-600 mb-10"
          >
            {t('newUzbekistan.overview.subtitle')}
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png" 
                alt="Yangi Uzbekistan Aerial View" 
                className="w-full h-64 object-cover"
              />
            </motion.div>
            
            <motion.div variants={containerVariants} className="flex flex-col justify-center">
              <motion.p 
                variants={itemVariants}
                className="text-gray-700 mb-4"
              >
                {t('newUzbekistan.overview.desc1')}
              </motion.p>
              
              <motion.p 
                variants={itemVariants}
                className="text-gray-700 mb-4"
              >
                {t('newUzbekistan.overview.desc2')}
              </motion.p>
              
              <motion.p 
                variants={itemVariants}
                className="text-gray-700"
              >
                {t('newUzbekistan.overview.desc3')}
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex justify-center"
          >
            <a 
              href="#masterplan" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            >
              <span className="mr-2 text-lg font-medium">{t('home.about.button')}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OverviewSection;
