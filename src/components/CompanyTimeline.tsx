
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Building, Award, Target, Rocket, Briefcase, Trophy, Clock, Users, Landmark } from 'lucide-react';
import { fetchTimelineEvents, TimelineEvent } from '@/utils/timeline-helpers';
import { useLanguage } from '@/contexts/LanguageContext';

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
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-[60px] h-[calc(100%+20px)] w-0.5 bg-gradient-to-b from-primary/50 to-primary/10"></div>
    </motion.div>
  );
};

const getIconComponent = (iconName: string): React.ReactNode => {
  const iconProps = { className: "w-6 h-6 text-white" };
  
  switch (iconName) {
    case 'Flag':
      return <Flag {...iconProps} />;
    case 'Building':
      return <Building {...iconProps} />;
    case 'Award':
      return <Award {...iconProps} />;
    case 'Target':
      return <Target {...iconProps} />;
    case 'Rocket':
      return <Rocket {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    case 'Trophy':
      return <Trophy {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'Landmark':
      return <Landmark {...iconProps} />;
    default:
      return <Flag {...iconProps} />;
  }
};

const CompanyTimeline: React.FC = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const events = await fetchTimelineEvents();
      setTimelineEvents(events);
      setLoading(false);
    };
    
    loadEvents();
  }, []);
  
  const getLocalizedField = (event: TimelineEvent, field: 'title' | 'description'): string => {
    if (language === 'ru' && event[`${field}_ru`]) {
      return event[`${field}_ru`] || event[field];
    }
    if (language === 'uz' && event[`${field}_uz`]) {
      return event[`${field}_uz`] || event[field];
    }
    if (language === 'en' && event[`${field}_en`]) {
      return event[`${field}_en`] || event[field];
    }
    return event[field];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative py-10 px-4">
      {/* Central line for desktop */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20"></div>
      
      {/* Timeline items */}
      {timelineEvents.map((event, index) => (
        <TimelineItem 
          key={event.id} 
          year={event.year} 
          title={getLocalizedField(event, 'title')} 
          description={getLocalizedField(event, 'description')} 
          icon={getIconComponent(event.icon_name)}
          index={index}
        />
      ))}
    </div>
  );
};

export default CompanyTimeline;
