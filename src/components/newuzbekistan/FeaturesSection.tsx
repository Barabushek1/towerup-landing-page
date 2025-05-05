import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import {
  Building,
  TreeDeciduous,
  Lightbulb,
  ParkingCircle,
  Shield,
  Users
} from 'lucide-react';
// Assuming Feature component is internal or will be defined here if standalone

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number; // Keep delay for staggered animation
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:bg-slate-800/40 hover:shadow-lg rounded-xl border border-slate-700/50 bg-[#1a1a1a]" // Dark card styles
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"> {/* Primary accent background */}
        {icon} {/* Icons will keep their specific colors if defined internally, or default to parent */}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p> {/* Adjusted text color */}
    </motion.div>
  );
};


const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const features = [ // Icons colors defined here
    {
      icon: <Building className="h-8 w-8 text-primary" />, // Primary color
      title: t('newUzbekistan.features.architecture.title'),
      description: t('newUzbekistan.features.architecture.desc'),
      delay: 0.1
    },
    {
      icon: <TreeDeciduous className="h-8 w-8 text-green-400" />, // Specific green for nature/trees
      title: t('newUzbekistan.features.greenery.title'),
      description: t('newUzbekistan.features.greenery.desc'),
      delay: 0.2
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-400" />, // Specific yellow for ideas/infrastructure
      title: t('newUzbekistan.features.infrastructure.title'),
      description: t('newUzbekistan.features.infrastructure.desc'),
      delay: 0.3
    },
    {
      icon: <ParkingCircle className="h-8 w-8 text-blue-400" />, // Specific blue for parking/transport
      title: t('newUzbekistan.features.parking.title'),
      description: t('newUzbekistan.features.parking.desc'),
      delay: 0.4
    },
    {
      icon: <Shield className="h-8 w-8 text-red-400" />, // Specific red for security/danger
      title: t('newUzbekistan.features.security.title'),
      description: t('newUzbekistan.features.security.desc'),
      delay: 0.5
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-400" />, // Specific indigo for people/community
      title: t('newUzbekistan.features.recreation.title'),
      description: t('newUzbekistan.features.recreation.desc'),
      delay: 0.6
    }
  ];

  return (
    <section
      id="features"
      className="py-16 md:py-24 bg-[#161616]" // Dark background
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Use px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.features.title')}
          </h2>

          <p className="text-xl text-primary"> {/* Primary accent color */}
            {t('newUzbekistan.features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon} // Pass the icon including its color class
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;