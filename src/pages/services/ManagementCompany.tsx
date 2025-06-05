
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Building, Users, ShieldCheck, PieChart, Clock, FileCheck, AreaChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ManagementCompany: React.FC = () => {
  const { t } = useLanguage();
  
  return <ServicePageLayout title={t('managementCompany.title')} description={t('managementCompany.description')} breadcrumb={t('managementCompany.breadcrumb')} headerImage="https://i.ibb.co/Jj2Y79Mb/Generated-Image-May-20-2025-1-06-AM.jpg">
      {/* Intro Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('managementCompany.intro.heading')}</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                {t('managementCompany.intro.description1')}
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                {t('managementCompany.intro.description2')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  {t('managementCompany.intro.contactButton')}
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  {t('managementCompany.intro.downloadButton')}
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img src="/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png" alt={t('managementCompany.intro.imageAlt1')} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img alt={t('managementCompany.intro.imageAlt2')} className="w-full h-full object-cover" src="/lovable-uploads/69b99dd6-648d-4ab5-929c-f4826e74623b.jpg" />
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('managementCompany.services.heading')}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t('managementCompany.services.subheading')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
                icon: <Building className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.0.title'),
                description: t('managementCompany.services.items.0.description')
              }, {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.1.title'),
                description: t('managementCompany.services.items.1.description')
              }, {
                icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.2.title'),
                description: t('managementCompany.services.items.2.description')
              }, {
                icon: <PieChart className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.3.title'),
                description: t('managementCompany.services.items.3.description')
              }, {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.4.title'),
                description: t('managementCompany.services.items.4.description')
              }, {
                icon: <FileCheck className="h-6 w-6 text-primary" />,
                title: t('managementCompany.services.items.5.title'),
                description: t('managementCompany.services.items.5.description')
              }].map((service, index) => <motion.div key={index} variants={fadeIn} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg" whileHover={{
                y: -5
              }}>
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </motion.div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('managementCompany.features.heading')}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t('managementCompany.features.subheading')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={fadeIn} className="relative overflow-hidden rounded-xl">
                <div className="aspect-[4/3] overflow-hidden border border-white/10">
                  <img src="/lovable-uploads/974b63c5-2ebc-40fc-b325-3a655d7afe14.png" alt={t('managementCompany.features.imageAlt')} className="w-full h-full object-cover" />
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('managementCompany.features.items.0.title')}</h3>
                        <p className="text-gray-300">
                          {t('managementCompany.features.items.0.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                        <AreaChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('managementCompany.features.items.1.title')}</h3>
                        <p className="text-gray-300">
                          {t('managementCompany.features.items.1.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('managementCompany.features.items.2.title')}</h3>
                        <p className="text-gray-300">
                          {t('managementCompany.features.items.2.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('managementCompany.cta.heading')}</h2>
              <p className="text-xl text-gray-300 mb-8">
                {t('managementCompany.cta.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  {t('managementCompany.cta.consultationButton')}
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  {t('managementCompany.cta.downloadButton')}
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>;
};
export default ManagementCompany;
