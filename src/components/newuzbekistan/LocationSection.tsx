
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
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.location.title')}
          </h2>
          
          <p className="text-xl text-blue-600 mb-6">
            {t('newUzbekistan.location.subtitle')}
          </p>
          
          <p className="text-gray-700 max-w-3xl mx-auto">
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
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {t('newUzbekistan.location.transport.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('newUzbekistan.location.transport.desc')}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 pl-14">
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>10 min to main highway</span>
                </li>
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>15 min to city center</span>
                </li>
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>5 bus routes nearby</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <TreeDeciduous className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {t('newUzbekistan.location.nature.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('newUzbekistan.location.nature.desc')}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 pl-14">
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Adjacent to forest area</span>
                </li>
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>3 large parks within walking distance</span>
                </li>
                <li className="text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Clean air zone</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-3 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Interactive Map Placeholder */}
            <div className="w-full h-full relative bg-gray-200">
              <img 
                src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" 
                alt="Location Map" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-lg max-w-xs text-center">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t('newUzbekistan.title')}</h3>
                  <p className="text-gray-700">Prime location with excellent connectivity</p>
                </div>
              </div>
              
              {/* Map Pins */}
              <div className="absolute left-[40%] top-[30%] animate-pulse">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div className="absolute -bottom-1 left-[50%] transform -translate-x-1/2 w-20 h-20 bg-blue-500/20 rounded-full -z-10"></div>
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
