
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Building, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const InvestmentSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });

  const projectFeatures = [
    {
      title: t('newUzbekistan.projectFeatures.feature1.title'),
      description: t('newUzbekistan.projectFeatures.feature1.desc')
    },
    {
      title: t('newUzbekistan.projectFeatures.feature2.title'),
      description: t('newUzbekistan.projectFeatures.feature2.desc')
    },
    {
      title: t('newUzbekistan.projectFeatures.feature3.title'),
      description: t('newUzbekistan.projectFeatures.feature3.desc')
    },
  ];

  return (
    <section id="project-features" className="py-16 md:py-24 bg-[#1a1a1a] text-white" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Building className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.projectFeatures.title')}
          </h2>

          <p className="text-xl text-primary">
            {t('newUzbekistan.projectFeatures.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[400px] overflow-hidden rounded-xl"
          >
            <img 
              src="/lovable-uploads/de7201e1-d410-4ab8-ac45-996e1929f911.jpg"
              alt="New Uzbekistan Building"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">New Uzbekistan</h3>
                <p className="text-white/80">A new standard of living in Tashkent</p>
              </div>
            </div>
          </motion.div>

          {/* Project features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6 text-white">
              {t('newUzbekistan.projectFeatures.whyChoose')}
            </h3>

            <div className="space-y-6">
              {projectFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="p-2 rounded-full bg-primary/20 flex-shrink-0 h-8 w-8 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-4"
            >
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('newUzbekistan.projectFeatures.contactUs')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional project highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: t('newUzbekistan.projectFeatures.comfort.title'),
              description: t('newUzbekistan.projectFeatures.comfort.desc'),
              icon: "🏠"
            },
            {
              title: t('newUzbekistan.projectFeatures.security.title'),
              description: t('newUzbekistan.projectFeatures.security.desc'),
              icon: "🔐",
              highlighted: true
            },
            {
              title: t('newUzbekistan.projectFeatures.amenities.title'),
              description: t('newUzbekistan.projectFeatures.amenities.desc'),
              icon: "✨"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className={cn(
                "bg-slate-800/80 rounded-xl p-6 border transition-all duration-300 text-center",
                feature.highlighted 
                  ? "border-primary shadow-lg shadow-primary/10" 
                  : "border-slate-700/50 hover:border-slate-600/70"
              )}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentSection;
