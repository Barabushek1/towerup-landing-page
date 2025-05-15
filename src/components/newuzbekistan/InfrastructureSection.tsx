
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Lightbulb, Wifi, ShoppingBag, Bus, Snail, School, ParkingCircle, Eye } from 'lucide-react';

interface InfrastructureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const InfrastructureItem: React.FC<InfrastructureItemProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col items-center bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden"
    >
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-300">{description}</p>
      </div>
    </motion.div>
  );
};

const InfrastructureSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const infrastructureItems = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      title: "Супермаркеты",
      description: "Рядом расположены магазины и супермаркеты для удобства жителей",
      delay: 0.1
    },
    {
      icon: <School className="h-8 w-8 text-indigo-400" />,
      title: "Образование",
      description: "Школы и детские сады в пешей доступности для вашей семьи",
      delay: 0.2
    },
    {
      icon: <ParkingCircle className="h-8 w-8 text-blue-400" />,
      title: "Парковка",
      description: "Удобная подземная и наземная парковка с достаточным количеством мест",
      delay: 0.3
    },
    {
      icon: <Bus className="h-8 w-8 text-green-400" />,
      title: "Транспорт",
      description: "Удобное транспортное сообщение и развитая инфраструктура",
      delay: 0.4
    },
    {
      icon: <Wifi className="h-8 w-8 text-yellow-400" />,
      title: "Интернет",
      description: "Высокоскоростной интернет и современные коммуникации",
      delay: 0.5
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-orange-400" />,
      title: "Инженерия",
      description: "Современные инженерные системы для комфортной жизни",
      delay: 0.6
    }
  ];

  return (
    <section id="infrastructure" className="py-16 md:py-24 bg-[#161616]" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Инфраструктура
          </h2>
          <p className="text-xl text-primary mb-6">
            Всё необходимое для комфортной жизни
          </p>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Жилой комплекс "Янги Узбекистан" предлагает развитую инфраструктуру для комфортной жизни. Здесь предусмотрено всё необходимое для повседневных задач.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infrastructureItems.map((item, index) => (
            <InfrastructureItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={item.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
