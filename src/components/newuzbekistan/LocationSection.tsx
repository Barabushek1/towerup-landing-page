
import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { MapPin, Car, TreeDeciduous } from 'lucide-react';

const LocationSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      id="location"
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
            <MapPin className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.location.title')}
          </h2>

          <p className="text-xl text-primary mb-6"> {/* Primary accent color */}
            {t('newUzbekistan.location.subtitle')}
          </p>

          <p className="text-slate-300 max-w-3xl mx-auto"> {/* Adjusted text color */}
            {t('newUzbekistan.location.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50"> {/* Dark card style */}
              <div className="flex mb-4">
                <div className="p-3 bg-primary/10 rounded-full mr-4 flex-shrink-0"> {/* Primary accent background */}
                  <Car className="h-6 w-6 text-blue-400" /> {/* Specific blue for transport */}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {t('newUzbekistan.location.transport.title')}
                  </h3>
                  <p className="text-slate-300"> {/* Adjusted text color */}
                    {t('newUzbekistan.location.transport.desc')}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 pl-14 text-slate-300"> {/* Adjusted text color, added padding for list items */}
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.transport.item1')}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.transport.item2')}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.transport.item3')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/50"> {/* Dark card style */}
              <div className="flex mb-4">
                <div className="p-3 bg-primary/10 rounded-full mr-4 flex-shrink-0"> {/* Primary accent background */}
                  <TreeDeciduous className="h-6 w-6 text-green-400" /> {/* Specific green for nature */}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {t('newUzbekistan.location.nature.title')}
                  </h3>
                  <p className="text-slate-300"> {/* Adjusted text color */}
                    {t('newUzbekistan.location.nature.desc')}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 pl-14 text-slate-300"> {/* Adjusted text color, added padding for list items */}
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.nature.item1')}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.nature.item2')}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></div> {/* Primary bullet */}
                  <span>{t('newUzbekistan.location.nature.item3')}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-3 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50" // Dark styles
          >
            {/* Interactive Map Placeholder / Image - Restyle overlay */}
            <div className="w-full h-full relative bg-slate-700/50"> {/* Dark background placeholder */}
              <img
                src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" // Keep image path
                alt={t('newUzbekistan.location.mapAlt')} // Added alt text
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center"> {/* Darker overlay */}
                <div className="p-8 bg-white/10 backdrop-blur-sm rounded-lg max-w-xs text-center border border-white/20"> {/* Darker translucent card */}
                  <h3 className="text-xl font-bold mb-2 text-white">{t('newUzbekistan.title')}</h3> {/* Keep title */}
                  <p className="text-slate-300">{t('newUzbekistan.location.cardDesc')}</p> {/* Adjusted text color */}
                </div>
              </div>

              {/* Map Pins - Restyle */}
              <div className="absolute left-[40%] top-[30%] animate-pulse">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-primary" /> {/* Primary pin color */}
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping -z-10"></div> {/* Primary pulse color */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
