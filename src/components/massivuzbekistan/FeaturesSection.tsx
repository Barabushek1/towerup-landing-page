
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, Shield, User, Zap, Wifi, Thermometer } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1a1a1a] rounded-xl border border-slate-700/30 p-6 hover:border-primary/30 transition-colors duration-300"
    >
      <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const features = [
    {
      icon: <Home className="h-6 w-6 text-primary" />,
      title: "Современные квартиры",
      description: "Функциональные планировки и качественная отделка для максимального комфорта жильцов"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Безопасность",
      description: "Круглосуточное видеонаблюдение и система контроля доступа в здание"
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "Консьерж-сервис",
      description: "Профессиональный консьерж поможет решить любые бытовые вопросы"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Энергоэффективность",
      description: "Современные технологии для экономии ресурсов и снижения коммунальных платежей"
    },
    {
      icon: <Wifi className="h-6 w-6 text-primary" />,
      title: "Цифровые решения",
      description: "Высокоскоростной интернет и цифровые сервисы для управления квартирой"
    },
    {
      icon: <Thermometer className="h-6 w-6 text-primary" />,
      title: "Климат-контроль",
      description: "Индивидуальные системы отопления и кондиционирования для вашего комфорта"
    }
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#161616]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Особенности комплекса</h2>
          <p className="text-xl text-primary mb-6">Современные технологии для комфортной жизни</p>
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-300">
              Жилой комплекс «Массив Узбекистан» сочетает в себе современные технологии, высокое качество строительства и продуманные решения для комфортной жизни.
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
