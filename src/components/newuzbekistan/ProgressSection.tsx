
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Calendar, Check, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';

interface ConstructionPhaseProps {
  title: string;
  status: string;
  completion: string;
  progress: number;
  delay: number;
}

const ConstructionPhase: React.FC<ConstructionPhaseProps> = ({ 
  title, 
  status, 
  completion, 
  progress, 
  delay 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      
      <div className="flex items-center text-gray-700 mb-3">
        <Check className="h-5 w-5 mr-2 text-blue-600" />
        <span>{status}</span>
      </div>
      
      <div className="flex items-center text-gray-700 mb-5">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        <span>{completion}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </motion.div>
  );
};

const ProgressSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const phases = [
    {
      title: t('newUzbekistan.progress.phase1.title'),
      status: t('newUzbekistan.progress.phase1.status'),
      completion: t('newUzbekistan.progress.phase1.completion'),
      progress: 65,
      delay: 0.1
    },
    {
      title: t('newUzbekistan.progress.phase2.title'),
      status: t('newUzbekistan.progress.phase2.status'),
      completion: t('newUzbekistan.progress.phase2.completion'),
      progress: 25,
      delay: 0.3
    },
    {
      title: t('newUzbekistan.progress.phase3.title'),
      status: t('newUzbekistan.progress.phase3.status'),
      completion: t('newUzbekistan.progress.phase3.completion'),
      progress: 10,
      delay: 0.5
    }
  ];

  return (
    <section 
      id="progress" 
      className="py-20 bg-gray-50"
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
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.progress.title')}
          </h2>
          
          <p className="text-xl text-blue-600">
            {t('newUzbekistan.progress.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <ConstructionPhase
              key={index}
              title={phase.title}
              status={phase.status}
              completion={phase.completion}
              progress={phase.progress}
              delay={phase.delay}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 relative aspect-video rounded-xl overflow-hidden shadow-xl"
        >
          <img 
            src="/lovable-uploads/f8d7af91-e393-448c-8412-4a5dc153d393.png" 
            alt="Construction Progress" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-medium">Live Construction Updates</span>
              </div>
              <h3 className="text-2xl font-bold">{t('newUzbekistan.title')}</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgressSection;
