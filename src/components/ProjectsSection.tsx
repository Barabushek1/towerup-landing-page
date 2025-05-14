
import { useEffect, useState } from 'react';
import { Building, Users, MapPin, Construction } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export type StatItem = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  order: number;
  is_active: boolean;
}

export const ProjectsSection = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('company_stats')
          .select('*')
          .eq('is_active', true)
          .order('order');

        if (error) {
          console.error('Error fetching stats:', error);
        } else {
          setStats(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return <Building className="w-10 h-10 text-primary" />;
      case 'users':
        return <Users className="w-10 h-10 text-primary" />;
      case 'map-pin':
        return <MapPin className="w-10 h-10 text-primary" />;
      case 'construction':
        return <Construction className="w-10 h-10 text-primary" />;
      default:
        return <Building className="w-10 h-10 text-primary" />;
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8
      } 
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-[#1a1a1a] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no stats, don't render the section
  if (stats.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id}
              className="bg-[#212121] rounded-xl p-6 border border-slate-800/50 shadow-lg transition-all hover:border-primary/30 duration-300"
              variants={item}
            >
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  {getIcon(stat.icon)}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm md:text-base text-gray-400 mb-2">{stat.subtitle}</p>
                <p className="text-xs uppercase tracking-wider text-primary font-medium">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
