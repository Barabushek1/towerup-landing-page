import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Calendar, Check, Clock } from 'lucide-react';
import { Progress } from '../ui/progress'; // Assuming Shadcn Progress is styled for dark theme backgrounds/track

interface ConstructionPhaseProps {
  title: string;
  status: string;
  completion: string;
  progress: number;
  delay: number; // Keep delay for staggered animation
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
      className="bg-slate-800/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700/50 hover:border-primary/30" // Dark card style
    >
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>

      <div className="flex items-center text-slate-300 mb-3"> {/* Adjusted text color */}
        <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0" /> {/* Primary accent color */}
        <span>{status}</span>
      </div>

      <div className="flex items-center text-slate-300 mb-5"> {/* Adjusted text color */}
        <Clock className="h-5 w-5 mr-2 text-primary flex-shrink-0" /> {/* Primary accent color */}
        <span>{completion}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400"> {/* Adjusted text color */}
          <span>Progress</span>
          <span className="font-medium text-white">{progress}%</span> {/* Adjusted text color */}
        </div>
        {/* Ensure Progress component is styled correctly in your ui/progress.tsx */}
        {/* The track should be dark, and the indicator should be primary */}
        <Progress value={progress} className="h-2 bg-slate-700/50" /> {/* Example track background */}
      </div>
    </motion.div>
  );
};


const ProgressSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Keep phases data
  const phases = [
    {
      title: t('newUzbekistan.progress.phase1.title'),
      status: t('newUzbekistan.progress.phase1.status'),
      completion: t('newUzbekistan.progress.phase1.completion'),
      progress: 65, // Example progress/dates
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
      className="py-16 md:py-24 bg-[#1a1a1a]" // Dark background
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
            <Calendar className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.progress.title')}
          </h2>

          <p className="text-xl text-primary"> {/* Primary accent color */}
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
          transition={{ duration: 0.6, delay: 0.7 }} // Keep delay
          viewport={{ once: true }}
          className="mt-12 md:mt-16 relative aspect-video rounded-xl overflow-hidden shadow-xl border border-slate-700/50" // Dark styles
        >
          <img
            src="/lovable-uploads/f8d7af91-e393-448c-8412-4a5dc153d393.png" // Keep image path
            alt="Construction Progress" // Added alt text
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end"> {/* Darker overlay */}
            <div className="p-6 text-white">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div> {/* Primary status indicator */}
                <span className="font-medium text-slate-300">Live Construction Updates</span> {/* Adjusted text color */}
              </div>
              <h3 className="text-2xl font-bold">{t('newUzbekistan.title')}</h3> {/* Assuming title is project title */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgressSection;