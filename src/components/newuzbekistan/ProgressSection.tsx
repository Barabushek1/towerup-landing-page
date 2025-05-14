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
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} transition={{
    duration: 0.5,
    delay
  }} viewport={{
    once: true,
    amount: 0.2
  }} className="bg-slate-800/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700/50 hover:border-primary/30" // Dark card style
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
    </motion.div>;
};
const ProgressSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });

  // Keep phases data
  const phases = [{
    title: t('newUzbekistan.progress.phase1.title'),
    status: t('newUzbekistan.progress.phase1.status'),
    completion: t('newUzbekistan.progress.phase1.completion'),
    progress: 65,
    // Example progress/dates
    delay: 0.1
  }, {
    title: t('newUzbekistan.progress.phase2.title'),
    status: t('newUzbekistan.progress.phase2.status'),
    completion: t('newUzbekistan.progress.phase2.completion'),
    progress: 25,
    delay: 0.3
  }, {
    title: t('newUzbekistan.progress.phase3.title'),
    status: t('newUzbekistan.progress.phase3.status'),
    completion: t('newUzbekistan.progress.phase3.completion'),
    progress: 10,
    delay: 0.5
  }];
  return;
};
export default ProgressSection;