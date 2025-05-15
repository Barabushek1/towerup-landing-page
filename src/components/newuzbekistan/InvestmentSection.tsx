
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart3, LineChart } from 'lucide-react';
import { Button } from '../../components/ui/button';

const InvestmentSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const investmentBenefits = [
    {
      title: "Высокая ликвидность",
      description: "Недвижимость в Ташкенте отличается высоким спросом и стабильным ростом цен",
      icon: <TrendingUp className="h-6 w-6 text-primary" />
    },
    {
      title: "Доходность",
      description: "Средняя доходность от сдачи в аренду составляет 8-10% годовых",
      icon: <DollarSign className="h-6 w-6 text-primary" />
    },
    {
      title: "Рост стоимости",
      description: "Ежегодный рост стоимости недвижимости в Ташкенте составляет 12-15%",
      icon: <BarChart3 className="h-6 w-6 text-primary" />
    },
    {
      title: "Стабильность",
      description: "Инвестиции в недвижимость защищены от инфляции и валютных колебаний",
      icon: <LineChart className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section id="investment" className="py-16 md:py-24 bg-gradient-to-b from-[#161616] to-[#0c0c0c]" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png"
                alt="Инвестиции в Янги Узбекистан"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Инвестиции в будущее
            </h2>
            
            <p className="text-xl text-primary mb-6">
              Выгодное вложение средств с стабильной доходностью
            </p>
            
            <p className="text-slate-300 mb-8">
              Жилой комплекс "Янги Узбекистан" представляет собой не только комфортное место для жизни, но и выгодный инвестиционный проект. Растущий спрос на современное жилье, удобное расположение и развитая инфраструктура делают инвестиции в данный проект особенно привлекательными.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {investmentBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{benefit.title}</h4>
                    <p className="text-slate-300 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-between">
                <div>
                  <p className="text-sm text-slate-400">Средняя стоимость за м²</p>
                  <p className="text-2xl font-bold text-white">10,000,000 сум</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Рост стоимости (год)</p>
                  <p className="text-2xl font-bold text-primary">+15%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Окупаемость</p>
                  <p className="text-2xl font-bold text-white">8-10 лет</p>
                </div>
              </div>
            </div>
            
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Получить инвестиционный расчет
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
