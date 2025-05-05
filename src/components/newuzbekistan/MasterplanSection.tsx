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
      className="py-16 md:py-24 bg-[#161616]" // Dark background
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Use px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"> {/* Primary accent background */}
            <Map className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.masterplan.title')}
          </h2>

          <p className="text-xl text-primary mb-6"> {/* Primary accent color */}
            {t('newUzbekistan.masterplan.subtitle')}
          </p>

          <p className="text-slate-300 max-w-3xl mx-auto"> {/* Adjusted text color */}
            {t('newUzbekistan.masterplan.desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }} // Keep animation
          transition={{ duration: 0.8, delay: 0.3 }} // Keep delay
          className="relative aspect-[16/9] max-w-5xl mx-auto overflow-hidden rounded-xl shadow-xl border border-slate-700/50" // Dark styles, primary shadow effect
          style={{ boxShadow: isInView ? "0 0 20px rgba(64, 220, 129, 0.3)" : "none" }} // Apply primary shadow on view
        >
          <img
            src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" // Keep image path
            alt="Yangi Uzbekistan Masterplan" // Added alt text
            className="w-full h-full object-cover"
          />

          {/* Interactive Overlay - Darker */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end"> {/* Darker overlay */}
            <div className="p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{t('newUzbekistan.title')}</h3> {/* Keep title */}
              <p className="text-white/90">{t('newUzbekistan.subtitle')}</p> {/* Keep subtitle */}
            </div>
          </div>

          {/* Hotspot indicators - Primary color */}
          <motion.div
            className="absolute left-[30%] top-[40%] w-6 h-6 rounded-full bg-primary/80 cursor-pointer" // Primary color
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} // Keep animation
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div> {/* Primary pulse color */}
          </motion.div>

          <motion.div
            className="absolute left-[60%] top-[50%] w-6 h-6 rounded-full bg-primary/80 cursor-pointer" // Primary color
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} // Keep animation
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} // Keep delay
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div> {/* Primary pulse color */}
          </motion.div>

          <motion.div
            className="absolute left-[45%] top-[70%] w-6 h-6 rounded-full bg-primary/80 cursor-pointer" // Primary color
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} // Keep animation
            transition={{ duration: 2, repeat: Infinity, delay: 1 }} // Keep delay
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div> {/* Primary pulse color */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterplanSection;