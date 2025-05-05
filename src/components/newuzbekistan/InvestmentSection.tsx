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
      className="py-16 md:py-24 bg-[#161616]" // Dark background
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Use px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"> {/* Primary accent background */}
            <TrendingUp className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.investment.title')}
          </h2>

          <p className="text-xl text-primary mb-6"> {/* Primary accent color */}
            {t('newUzbekistan.investment.subtitle')}
          </p>

          <p className="text-slate-300 max-w-3xl mx-auto"> {/* Adjusted text color */}
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
            <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
              <h3 className="text-2xl font-bold mb-6 text-white">Investment Benefits</h3>

              <div className="space-y-4">
                {/* Investment Benefit Items */}
                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full mr-3 flex-shrink-0"> {/* Primary accent background */}
                    <Check className="h-4 w-4 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Capital Growth</h4>
                    <p className="text-slate-300">Projected annual value increase of 15-20%</p> {/* Adjusted text color */}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full mr-3 flex-shrink-0"> {/* Primary accent background */}
                    <Check className="h-4 w-4 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Rental Yield</h4>
                    <p className="text-slate-300">Estimated 8-10% annual rental return</p> {/* Adjusted text color */}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full mr-3 flex-shrink-0"> {/* Primary accent background */}
                    <Check className="h-4 w-4 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Infrastructure Development</h4>
                    <p className="text-slate-300">Area improvements increasing property values</p> {/* Adjusted text color */}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full mr-3 flex-shrink-0"> {/* Primary accent background */}
                    <Check className="h-4 w-4 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Payment Plans</h4>
                    <p className="text-slate-300">Flexible payment options with staged construction</p> {/* Adjusted text color */}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                   className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" // Primary button style
                  onClick={() => {
                     // Assuming 'contact' ID exists elsewhere
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('newUzbekistan.contact.form.submit')}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={chartRef} // Ref for the chart element
            initial={{ opacity: 0, x: 20 }}
            animate={isChartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }} // Animate when chart is in view
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
              <h3 className="text-xl font-bold mb-6 text-white">Property Value Growth Projection</h3>

              {/* Simplified Chart - Restyle */}
              <div className="relative h-60 mt-4 px-4">
                <div className="absolute bottom-0 left-0 w-full h-px bg-slate-600"></div> {/* Darker axis line */}
                <div className="absolute left-0 bottom-0 h-full w-px bg-slate-600"></div> {/* Darker axis line */}

                {/* Chart Line - Restyle stroke */}
                <svg className="absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 200"> {/* Added viewBox */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isChartInView ? { pathLength: 1 } : { pathLength: 0 }} // Trigger animation when chart is in view
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 0,200 C 50,180 100,150 150,120 S 250,70 300,40" // Example path
                    fill="none"
                    stroke={isChartInView ? "url(#chartGradient)" : "#475569"} // Use gradient when in view, static color when not
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                   {/* Define Gradient */}
                   <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#4ade80" /> {/* Green start (Primary-ish) */}
                     <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan end (Secondary highlight) */}
                   </linearGradient>
                </svg>

                {/* Year Labels - Restyle */}
                <div className="absolute bottom-[-25px] left-0 text-sm text-slate-400">2025</div>
                <div className="absolute bottom-[-25px] left-[40%] text-sm text-slate-400">2028</div>
                <div className="absolute bottom-[-25px] right-0 text-sm text-slate-400">2030</div>

                {/* Value Labels - Restyle */}
                <div className="absolute bottom-0 right-0 mr-2 text-sm font-medium text-primary">+60%</div> {/* Primary color */}
                <div className="absolute top-0 right-0 mr-2 text-sm font-medium text-primary">+120%</div> {/* Primary color */}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/50"> {/* Dark border */}
                <div className="flex justify-between text-sm text-slate-400"> {/* Adjusted text color */}
                  <div>Initial Investment</div>
                  <div className="font-medium text-white">$100,000</div> {/* Adjusted text color */}
                </div>
                <div className="flex justify-between mt-2 text-sm text-slate-400"> {/* Adjusted text color */}
                  <div>Projected Value (2030)</div>
                  <div className="font-medium text-primary">$220,000</div> {/* Primary color */}
                </div>
              </div>
            </div>

            {/* ROI Tag - Restyle */}
            <div className="absolute -top-4 -right-4 bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full transform rotate-12 shadow-md"> {/* Primary accent tag */}
              High ROI
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;