
import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Building, Award, Target, Rocket } from 'lucide-react';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, icon, index }) => {
  return (
    <motion.div 
      className="relative mb-12 md:mb-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
        {/* Year bubble */}
        <div className="z-10 mb-4 md:mb-0">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            <div className="bg-primary text-white py-3 px-6 rounded-full font-bold shadow-lg flex items-center gap-3 relative">
              <span>{year}</span>
              <div className="bg-white/10 p-1.5 rounded-full">
                {icon}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Content */}
        <motion.div 
          className={`md:w-[calc(100%-100px)] bg-[#1E1E1E] p-5 rounded-lg shadow-lg border border-white/5 ${index % 2 === 0 ? 'md:ml-6' : 'md:mr-6'}`}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </motion.div>
      </div>
      
      {/* Connector line (visible only on desktop) */}
      {index < 4 && (
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-[60px] h-[calc(100%+20px)] w-0.5 bg-gradient-to-b from-primary/50 to-primary/10"></div>
      )}
    </motion.div>
  );
};

const CompanyTimeline: React.FC = () => {
  const timeline = [
    {
      year: '2010',
      title: 'Основание компании',
      description: 'Компания TOWER UP была основана с целью создания современных и инновационных решений в области строительства.',
      icon: <Flag className="w-6 h-6 text-white" />
    },
    {
      year: '2015',
      title: 'Первый крупный проект',
      description: 'Реализация первого масштабного проекта в центре Ташкента, получивший признание в архитектурном сообществе.',
      icon: <Building className="w-6 h-6 text-white" />
    },
    {
      year: '2018',
      title: 'Международное признание',
      description: 'Компания получила международную награду за инновационные решения в области устойчивого строительства.',
      icon: <Award className="w-6 h-6 text-white" />
    },
    {
      year: '2020',
      title: 'Расширение деятельности',
      description: 'Открытие новых офисов и выход на региональные рынки Центральной Азии.',
      icon: <Target className="w-6 h-6 text-white" />
    },
    {
      year: '2023',
      title: 'Технологический прорыв',
      description: 'Внедрение передовых технологий умных домов и экологически чистых материалов в строительстве.',
      icon: <Rocket className="w-6 h-6 text-white" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto relative py-10 px-4">
      {/* Central line for desktop */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20"></div>
      
      {/* Timeline items */}
      {timeline.map((item, index) => (
        <TimelineItem 
          key={index} 
          year={item.year} 
          title={item.title} 
          description={item.description} 
          icon={item.icon}
          index={index}
        />
      ))}
    </div>
  );
};

export default CompanyTimeline;
