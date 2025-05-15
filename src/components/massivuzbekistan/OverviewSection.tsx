
import React from 'react';
import { motion, useInView } from 'framer-motion';

const OverviewSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#161616]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">О комплексе <span className="text-primary">«Массив Узбекистан»</span></h2>
            
            <div className="space-y-4 text-slate-300">
              <p>
                Жилой комплекс «Массив Узбекистан» - современный жилой комплекс в центральной части Ташкента, предлагающий комфортабельные квартиры различных планировок.
              </p>
              
              <p>
                Комплекс отличается современной архитектурой, качественными материалами строительства и продуманными планировками квартир, что создает комфортное пространство для жизни.
              </p>
              
              <p>
                Расположение комплекса обеспечивает отличную транспортную доступность и близость к основным объектам городской инфраструктуры.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/40">
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-white/70 text-sm">Этажей</div>
              </div>
              
              <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/40">
                <div className="text-3xl font-bold text-primary mb-1">240</div>
                <div className="text-white/70 text-sm">Квартир</div>
              </div>
              
              <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/40">
                <div className="text-3xl font-bold text-primary mb-1">35-85</div>
                <div className="text-white/70 text-sm">м² площадь квартир</div>
              </div>
              
              <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/40">
                <div className="text-3xl font-bold text-primary mb-1">Q4 2024</div>
                <div className="text-white/70 text-sm">Сдача объекта</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="aspect-video rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png" 
                alt="Жилой комплекс «Массив Узбекистан»" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png" 
                  alt="Территория комплекса" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" 
                  alt="Внутренний двор" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png" 
                  alt="Фасад здания" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
