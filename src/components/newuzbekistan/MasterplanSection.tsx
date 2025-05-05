
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Map } from 'lucide-react';

const MasterplanSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section 
      id="masterplan" 
      className="py-20 bg-[#252A39]"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#9b87f5]/20 rounded-full mb-6">
            <Map className="h-6 w-6 text-[#9b87f5]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.masterplan.title')}
          </h2>
          
          <p className="text-xl text-[#9b87f5] mb-6">
            {t('newUzbekistan.masterplan.subtitle')}
          </p>
          
          <p className="text-gray-300 max-w-3xl mx-auto">
            {t('newUzbekistan.masterplan.desc')}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative aspect-[16/9] max-w-5xl mx-auto overflow-hidden rounded-xl shadow-[0_0_20px_rgba(155,135,245,0.3)]"
        >
          <img 
            src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" 
            alt="Yangi Uzbekistan Masterplan" 
            className="w-full h-full object-cover"
          />
          
          {/* Interactive Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{t('newUzbekistan.title')}</h3>
              <p className="text-white/90">{t('newUzbekistan.subtitle')}</p>
            </div>
          </div>
          
          {/* Hotspot indicators */}
          <motion.div 
            className="absolute left-[30%] top-[40%] w-6 h-6 rounded-full bg-[#9b87f5]/80 cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full bg-[#9b87f5]/30 animate-ping"></div>
          </motion.div>
          
          <motion.div 
            className="absolute left-[60%] top-[50%] w-6 h-6 rounded-full bg-[#9b87f5]/80 cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="absolute inset-0 rounded-full bg-[#9b87f5]/30 animate-ping"></div>
          </motion.div>
          
          <motion.div 
            className="absolute left-[45%] top-[70%] w-6 h-6 rounded-full bg-[#9b87f5]/80 cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="absolute inset-0 rounded-full bg-[#9b87f5]/30 animate-ping"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterplanSection;
