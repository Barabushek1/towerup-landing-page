import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Building, HeartPulse, ShoppingBag, Utensils, Dumbbell, PartyPopper, MapPin // Using MapPin for location text below map
} from 'lucide-react';
// cn is likely needed if you use conditional classes, assuming it's available
// import { cn } from '@/lib/utils';

interface InfrastructureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}
const InfrastructureItem: React.FC<InfrastructureItemProps> = ({
  icon,
  title,
  description,
  index
}) => {
  return <motion.div initial={{
    opacity: 0,
    x: index % 2 === 0 ? -20 : 20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} transition={{
    duration: 0.5,
    delay: index * 0.1
  }} viewport={{
    once: true,
    amount: 0.2
  }} className="flex items-start p-6 bg-slate-800/40 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700/50 hover:border-primary/30" // Dark card style
  >
      <div className="mr-4 p-3 rounded-full bg-primary/10 flex-shrink-0"> {/* Primary accent background */}
        {icon} {/* Icons will keep their specific colors if defined internally, or default to parent */}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-300">{description}</p> {/* Adjusted text color */}
      </div>
    </motion.div>;
};
const InfrastructureSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1
  });

  // Define icon colors here for specific items if needed, or let them inherit
  const infrastructureItems = [{
    icon: <Building className="h-6 w-6 text-primary" />,
    // Primary
    title: t('newUzbekistan.infrastructure.education.title'),
    description: t('newUzbekistan.infrastructure.education.desc')
  }, {
    icon: <HeartPulse className="h-6 w-6 text-red-500" />,
    // Specific red for health
    title: t('newUzbekistan.infrastructure.healthcare.title'),
    description: t('newUzbekistan.infrastructure.healthcare.desc')
  }, {
    icon: <ShoppingBag className="h-6 w-6 text-indigo-400" />,
    // Specific indigo
    title: t('newUzbekistan.infrastructure.shopping.title'),
    description: t('newUzbekistan.infrastructure.shopping.desc')
  }, {
    icon: <Utensils className="h-6 w-6 text-orange-400" />,
    // Specific orange
    title: t('newUzbekistan.infrastructure.dining.title'),
    description: t('newUzbekistan.infrastructure.dining.desc')
  }, {
    icon: <Dumbbell className="h-6 w-6 text-green-400" />,
    // Specific green for sports
    title: t('newUzbekistan.infrastructure.sports.title'),
    description: t('newUzbekistan.infrastructure.sports.desc')
  }, {
    icon: <PartyPopper className="h-6 w-6 text-purple-400" />,
    // Specific purple
    title: t('newUzbekistan.infrastructure.leisure.title'),
    description: t('newUzbekistan.infrastructure.leisure.desc')
  }];
  return;
};
export default InfrastructureSection;