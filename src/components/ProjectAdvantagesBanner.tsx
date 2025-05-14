import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectAdvantagesBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-brand-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">{t("projectAdvantages.title")}</h2>
        <p className="text-lg mb-8">{t("projectAdvantages.subtitle")}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Advantage 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("projectAdvantages.advantages.advantage1.title")}</h3>
            <p>{t("projectAdvantages.advantages.advantage1.description")}</p>
          </div>
          
          {/* Advantage 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("projectAdvantages.advantages.advantage2.title")}</h3>
            <p>{t("projectAdvantages.advantages.advantage2.description")}</p>
          </div>
          
          {/* Advantage 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("projectAdvantages.advantages.advantage3.title")}</h3>
            <p>{t("projectAdvantages.advantages.advantage3.description")}</p>
          </div>
          
          {/* Advantage 4 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("projectAdvantages.advantages.advantage4.title")}</h3>
            <p>{t("projectAdvantages.advantages.advantage4.description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectAdvantagesBanner;
