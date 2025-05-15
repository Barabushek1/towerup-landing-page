
import React from 'react';
import { motion, useInView } from 'framer-motion';

const MasterplanSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#111111]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Генеральный план комплекса</h2>
            <p className="text-xl text-primary">Продуманная организация пространства</p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-slate-800/20 rounded-xl overflow-hidden border border-slate-700/30 max-w-4xl mx-auto"
        >
          <img 
            src="/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png" 
            alt="Генеральный план ЖК «Массив Узбекистан»" 
            className="w-full h-auto"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700/30">
            <h3 className="text-xl font-bold mb-3 text-primary">Территория</h3>
            <p className="text-slate-300">
              Территория комплекса спланирована с учетом современных требований к комфорту и безопасности жильцов.
            </p>
          </div>
          
          <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700/30">
            <h3 className="text-xl font-bold mb-3 text-primary">Парковка</h3>
            <p className="text-slate-300">
              На территории комплекса предусмотрены парковочные места для жителей и их гостей.
            </p>
          </div>
          
          <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700/30">
            <h3 className="text-xl font-bold mb-3 text-primary">Безопасность</h3>
            <p className="text-slate-300">
              Территория комплекса находится под круглосуточным видеонаблюдением и охраной.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterplanSection;
