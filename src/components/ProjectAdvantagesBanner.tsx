
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Shield, ThumbsUp, Zap } from 'lucide-react';

const ProjectAdvantagesBanner: React.FC = () => {
  const { t } = useLanguage();
  
  const advantages = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: t('projectAdvantages.quality'),
      description: t('projectAdvantages.qualityDesc')
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-primary" />,
      title: t('projectAdvantages.reliability'),
      description: t('projectAdvantages.reliabilityDesc')
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: t('projectAdvantages.innovation'),
      description: t('projectAdvantages.innovationDesc')
    },
    {
      icon: <Check className="h-10 w-10 text-primary" />,
      title: t('projectAdvantages.expertise'),
      description: t('projectAdvantages.expertiseDesc')
    }
  ];

  return (
    <section className="py-16 bg-[#161616]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          {t('projectAdvantages.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-[#212121] rounded-lg p-6 flex flex-col items-center text-center transition-transform hover:transform hover:scale-105 hover:shadow-xl">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{advantage.title}</h3>
              <p className="text-gray-400">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectAdvantagesBanner;
