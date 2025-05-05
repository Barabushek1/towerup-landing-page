
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { 
  Building, 
  HeartPulse, 
  ShoppingBag, 
  Utensils, 
  Dumbbell, 
  PartyPopper 
} from 'lucide-react';

interface InfrastructureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const InfrastructureItem: React.FC<InfrastructureItemProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="mr-4 p-3 rounded-full bg-blue-100 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-700">{description}</p>
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
      icon: <Building className="h-6 w-6 text-blue-600" />,
      title: t('newUzbekistan.infrastructure.education.title'),
      description: t('newUzbekistan.infrastructure.education.desc')
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-red-600" />,
      title: t('newUzbekistan.infrastructure.healthcare.title'),
      description: t('newUzbekistan.infrastructure.healthcare.desc')
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-indigo-600" />,
      title: t('newUzbekistan.infrastructure.shopping.title'),
      description: t('newUzbekistan.infrastructure.shopping.desc')
    },
    {
      icon: <Utensils className="h-6 w-6 text-orange-600" />,
      title: t('newUzbekistan.infrastructure.dining.title'),
      description: t('newUzbekistan.infrastructure.dining.desc')
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-green-600" />,
      title: t('newUzbekistan.infrastructure.sports.title'),
      description: t('newUzbekistan.infrastructure.sports.desc')
    },
    {
      icon: <PartyPopper className="h-6 w-6 text-purple-600" />,
      title: t('newUzbekistan.infrastructure.leisure.title'),
      description: t('newUzbekistan.infrastructure.leisure.desc')
    }
  ];

  return (
    <section 
      id="infrastructure" 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.infrastructure.title')}
          </h2>
          
          <p className="text-xl text-blue-600">
            {t('newUzbekistan.infrastructure.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infrastructureItems.map((item, index) => (
            <InfrastructureItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/lovable-uploads/32c3e8f6-2da4-474c-904f-fd321d91e87e.png" 
              alt="Infrastructure Overview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t('newUzbekistan.infrastructure.title')}</h3>
                <p className="text-white/90 max-w-md">{t('newUzbekistan.infrastructure.subtitle')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
