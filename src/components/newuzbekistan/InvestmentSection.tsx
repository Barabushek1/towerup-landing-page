import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const InvestmentSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });
  const isChartInView = useInView(chartRef, {
    once: true,
    amount: 0.5
  });

  const investmentBenefits = [
    {
      title: t('newUzbekistan.investment.benefit1.title') || "Strong ROI Potential",
      description: t('newUzbekistan.investment.benefit1.desc') || "With rapidly developing infrastructure and growing demand, expect substantial returns on your investment over time."
    },
    {
      title: t('newUzbekistan.investment.benefit2.title') || "Ready-to-Rent Units",
      description: t('newUzbekistan.investment.benefit2.desc') || "Fully finished apartments ready for immediate rental, allowing you to start generating income right away."
    },
    {
      title: t('newUzbekistan.investment.benefit3.title') || "Growing Property Values",
      description: t('newUzbekistan.investment.benefit3.desc') || "The New Uzbekistan area has shown consistent appreciation in property values over the past few years."
    },
    {
      title: t('newUzbekistan.investment.benefit4.title') || "Developer Buy-Back Option",
      description: t('newUzbekistan.investment.benefit4.desc') || "Unique guarantee program allowing investors to sell back to the developer at a predetermined price."
    },
  ];

  // Sample price growth data for visualization 
  const yearlyGrowth = [
    { year: 2022, value: 100 },
    { year: 2023, value: 115 },
    { year: 2024, value: 132 },
    { year: 2025, value: 148 },
    { year: 2026, value: 175 },
    { year: 2027, value: 201 },
  ];

  return (
    <section id="investment" className="py-16 md:py-24 bg-[#1a1a1a] text-white" ref={sectionRef}>
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
            {t('newUzbekistan.investment.title') || "Investment Opportunities"}
          </h2>

          <p className="text-xl text-primary">
            {t('newUzbekistan.investment.subtitle') || "Secure your financial future with property in New Uzbekistan"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart visualization */}
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, x: -30 }}
            animate={isChartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              {t('newUzbekistan.investment.projectedGrowth') || "Projected Property Value Growth"}
            </h3>

            <div className="relative h-64">
              {/* Simplified chart visualization */}
              <div className="absolute inset-0 flex items-end">
                {yearlyGrowth.map((data, index) => {
                  const delay = 0.2 + index * 0.1;
                  const height = (data.value / 201) * 100;
                  
                  return (
                    <motion.div 
                      key={index}
                      className="flex-1 mx-1 rounded-t-sm bg-gradient-to-t from-primary/70 to-primary flex items-end justify-center relative"
                      initial={{ height: 0 }}
                      animate={isChartInView ? { height: `${height}%` } : { height: 0 }}
                      transition={{ duration: 0.8, delay }}
                    >
                      <div className="absolute -top-6 text-sm text-white font-medium w-full text-center">
                        {data.value}%
                      </div>
                      <div className="absolute -bottom-6 text-xs text-white/80 w-full text-center">
                        {data.year}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center mt-8 text-slate-300 text-sm">
              {t('newUzbekistan.investment.projectionNote') || "Projected property value growth (%) based on current market trends"}
            </div>
          </motion.div>

          {/* Investment benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6 text-white">
              {t('newUzbekistan.investment.whyInvest') || "Why Invest in New Uzbekistan"}
            </h3>

            <div className="space-y-6">
              {investmentBenefits.map((benefit, index) => (
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
                    <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                    <p className="text-slate-300">{benefit.description}</p>
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
                {t('newUzbekistan.investment.contactInvestor') || "Speak with Investment Advisor"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Investment packages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-24 bg-slate-800/30 rounded-xl p-8 border border-slate-700/50 shadow-lg"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-2 text-white">
              {t('newUzbekistan.investment.packages.title') || "Investment Packages"}
            </h3>
            <p className="text-slate-300 max-w-3xl mx-auto">
              {t('newUzbekistan.investment.packages.subtitle') || "Choose from our carefully structured investment plans designed to maximize returns while meeting different financial goals."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t('newUzbekistan.investment.packages.starter.title') || "Starter Package",
                price: t('newUzbekistan.investment.packages.starter.price') || "$45,000+",
                features: [
                  t('newUzbekistan.investment.packages.starter.feature1') || "Studio apartment",
                  t('newUzbekistan.investment.packages.starter.feature2') || "5-year payment plan available",
                  t('newUzbekistan.investment.packages.starter.feature3') || "Property management option",
                  t('newUzbekistan.investment.packages.starter.feature4') || "Projected ROI: 8-10% annually"
                ]
              },
              {
                title: t('newUzbekistan.investment.packages.growth.title') || "Growth Portfolio",
                price: t('newUzbekistan.investment.packages.growth.price') || "$85,000+",
                features: [
                  t('newUzbekistan.investment.packages.growth.feature1') || "One-bedroom apartment",
                  t('newUzbekistan.investment.packages.growth.feature2') || "3-year payment plan available",
                  t('newUzbekistan.investment.packages.growth.feature3') || "Free property management (1 year)",
                  t('newUzbekistan.investment.packages.growth.feature4') || "Projected ROI: 10-12% annually"
                ],
                highlighted: true
              },
              {
                title: t('newUzbekistan.investment.packages.premium.title') || "Premium Investment",
                price: t('newUzbekistan.investment.packages.premium.price') || "$150,000+",
                features: [
                  t('newUzbekistan.investment.packages.premium.feature1') || "Two-bedroom luxury apartment",
                  t('newUzbekistan.investment.packages.premium.feature2') || "Flexible payment options",
                  t('newUzbekistan.investment.packages.premium.feature3') || "Full property management included",
                  t('newUzbekistan.investment.packages.premium.feature4') || "Projected ROI: 12-15% annually"
                ]
              }
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className={cn(
                  "bg-slate-800/80 rounded-xl p-6 border transition-all duration-300 relative overflow-hidden",
                  pkg.highlighted 
                    ? "border-primary shadow-lg shadow-primary/10 transform md:-translate-y-4" 
                    : "border-slate-700/50 hover:border-slate-600/70"
                )}
              >
                {pkg.highlighted && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-xs font-bold py-1 px-3 rounded-bl">
                      {t('newUzbekistan.investment.packages.popular') || "MOST POPULAR"}
                    </div>
                  </div>
                )}
                
                <div className="mb-6 text-center">
                  <h4 className="text-xl font-bold mb-2 text-white">{pkg.title}</h4>
                  <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={cn(
                    "w-full justify-center",
                    pkg.highlighted
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  )}
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('newUzbekistan.investment.packages.inquire') || "Request Details"}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentSection;
