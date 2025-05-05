
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Check } from 'lucide-react';
import { Button } from '../ui/button';

const InvestmentSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isChartInView = useInView(chartRef, { once: true, amount: 0.5 });

  return (
    <section 
      id="investment" 
      className="py-20 bg-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.investment.title')}
          </h2>
          
          <p className="text-xl text-blue-600 mb-6">
            {t('newUzbekistan.investment.subtitle')}
          </p>
          
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t('newUzbekistan.investment.desc')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Investment Benefits</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-green-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Capital Growth</h4>
                    <p className="text-gray-700">Projected annual value increase of 15-20%</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-green-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Rental Yield</h4>
                    <p className="text-gray-700">Estimated 8-10% annual rental return</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-green-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Infrastructure Development</h4>
                    <p className="text-gray-700">Area improvements increasing property values</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-green-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Payment Plans</h4>
                    <p className="text-gray-700">Flexible payment options with staged construction</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('newUzbekistan.contact.form.submit')}
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, x: 20 }}
            animate={isChartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Property Value Growth Projection</h3>
              
              {/* Simplified Chart */}
              <div className="relative h-60 mt-4 px-4">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                <div className="absolute left-0 bottom-0 h-full w-px bg-gray-300"></div>
                
                {/* Chart Line */}
                <svg className="absolute inset-0 overflow-visible" preserveAspectRatio="none">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isChartInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 0,200 C 50,180 100,150 150,120 S 250,70 300,40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Year Labels */}
                <div className="absolute bottom-[-25px] left-0 text-sm text-gray-600">2025</div>
                <div className="absolute bottom-[-25px] left-[40%] text-sm text-gray-600">2028</div>
                <div className="absolute bottom-[-25px] right-0 text-sm text-gray-600">2030</div>
                
                {/* Value Labels */}
                <div className="absolute bottom-0 right-0 mr-2 text-sm font-medium text-green-600">+60%</div>
                <div className="absolute top-0 right-0 mr-2 text-sm font-medium text-green-600">+120%</div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <div>Initial Investment</div>
                  <div className="font-medium">$100,000</div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <div>Projected Value (2030)</div>
                  <div className="font-medium text-green-600">$220,000</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full transform rotate-12">
              High ROI
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
