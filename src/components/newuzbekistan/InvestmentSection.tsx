
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Check } from 'lucide-react';
import { Button } from '../ui/button';

const InvestmentSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null); // Ref for chart animation
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isChartInView = useInView(chartRef, { once: true, amount: 0.5 }); // Check if chart is in view

  return (
    <section
      id="investment"
      className="py-16 md:py-24 bg-[#161616]"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.investment.title') || 'Investment Opportunities'}
          </h2>

          <p className="text-xl text-primary">
            {t('newUzbekistan.investment.subtitle') || 'Secure your future with premium real estate'}
          </p>
        </motion.div>

        {/* Investment content can be expanded here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50"
          >
            <h3 className="text-xl font-bold mb-4 text-white">{t('newUzbekistan.investment.option1.title') || 'Premium Apartments'}</h3>
            <p className="text-slate-300 mb-4">{t('newUzbekistan.investment.option1.desc') || 'Luxury living spaces designed for comfort and style.'}</p>
            <div className="flex items-center text-primary">
              <Check className="h-5 w-5 mr-2" />
              <span>{t('newUzbekistan.investment.option1.return') || 'High ROI potential'}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50"
          >
            <h3 className="text-xl font-bold mb-4 text-white">{t('newUzbekistan.investment.option2.title') || 'Commercial Spaces'}</h3>
            <p className="text-slate-300 mb-4">{t('newUzbekistan.investment.option2.desc') || 'Strategic locations for businesses with high foot traffic.'}</p>
            <div className="flex items-center text-primary">
              <Check className="h-5 w-5 mr-2" />
              <span>{t('newUzbekistan.investment.option2.return') || 'Steady rental income'}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50"
          >
            <h3 className="text-xl font-bold mb-4 text-white">{t('newUzbekistan.investment.option3.title') || 'Development Plots'}</h3>
            <p className="text-slate-300 mb-4">{t('newUzbekistan.investment.option3.desc') || 'Prime land for custom development projects.'}</p>
            <div className="flex items-center text-primary">
              <Check className="h-5 w-5 mr-2" />
              <span>{t('newUzbekistan.investment.option3.return') || 'Long-term appreciation'}</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            {t('newUzbekistan.investment.cta') || 'Contact Investment Team'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
