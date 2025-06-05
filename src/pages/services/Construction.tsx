import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Building, Clock, Shield, Wrench, CheckCircle, Users, FileText } from 'lucide-react';

// Assuming 't' is a translation function available globally or imported
// For example: import { useTranslation } from 'react-i18next'; and then const { t } = useTranslation();
// For this example, we'll just assume `t` is directly available as a placeholder.
const t = (key: string) => key; // Placeholder for the actual translation function

const Construction: React.FC = () => {
  return (
    <ServicePageLayout
      title={t("page.title")}
      description={t("page.description")}
      breadcrumb={t("page.breadcrumb")}
      headerImage="https://i.ibb.co/bgbbvY0D/Generated-Image-May-20-2025-12-53-AM.jpg"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("hero.heading")}</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                {t("hero.paragraph1")}
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                {t("hero.paragraph2")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  {t("hero.buttonDiscussProject")}
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  {t("hero.buttonOurObjects")}
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img alt={t("hero.imageAlt")} className="w-full h-full object-cover" src="/lovable-uploads/7bdf99aa-2b8a-47f6-83d2-abd294990266.jpg" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("services.heading")}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("services.subheading")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Building className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.residential.title",
                  descriptionKey: "services.card.residential.description",
                },
                {
                  icon: <Building className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.commercial.title",
                  descriptionKey: "services.card.commercial.description",
                },
                {
                  icon: <Building className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.industrial.title",
                  descriptionKey: "services.card.industrial.description",
                },
                {
                  icon: <Wrench className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.engineeringNetworks.title",
                  descriptionKey: "services.card.engineeringNetworks.description",
                },
                {
                  icon: <Clock className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.constructionManagement.title",
                  descriptionKey: "services.card.constructionManagement.description",
                },
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  titleKey: "services.card.constructionConsulting.title",
                  descriptionKey: "services.card.constructionConsulting.description",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t(service.titleKey)}</h3>
                  <p className="text-gray-300">{t(service.descriptionKey)}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("whyChooseUs.heading")}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("whyChooseUs.subheading")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.qualityGuarantee.title",
                  descriptionKey: "whyChooseUs.card.qualityGuarantee.description",
                },
                {
                  icon: <Clock className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.deadlineAdherence.title",
                  descriptionKey: "whyChooseUs.card.deadlineAdherence.description",
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.professionalTeam.title",
                  descriptionKey: "whyChooseUs.card.professionalTeam.description",
                },
                {
                  icon: <Building className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.integratedApproach.title",
                  descriptionKey: "whyChooseUs.card.integratedApproach.description",
                },
                {
                  icon: <Wrench className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.modernTechnologies.title",
                  descriptionKey: "whyChooseUs.card.modernTechnologies.description",
                },
                {
                  icon: <FileText className="h-8 w-8 text-primary" />,
                  titleKey: "whyChooseUs.card.transparency.title",
                  descriptionKey: "whyChooseUs.card.transparency.description",
                },
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t(advantage.titleKey)}</h3>
                  <p className="text-gray-300">{t(advantage.descriptionKey)}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("projectsShowcase.heading")}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("projectsShowcase.subheading")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  image: "/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png",
                  titleKey: "projectsShowcase.item.bochka.title",
                  categoryKey: "projectsShowcase.category.commercial",
                },
                {
                  image: "/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png",
                  titleKey: "projectsShowcase.item.newUzbekistan.title",
                  categoryKey: "projectsShowcase.category.residential",
                },
                {
                  image: "/lovable-uploads/38cd93b4-a24c-4390-bd04-0ed51282d778.png",
                  titleKey: "projectsShowcase.item.pushkinPlaza.title",
                  categoryKey: "projectsShowcase.category.multifunctional",
                },
              ].map((project, index) => (
                <motion.div key={index} variants={fadeIn} className="overflow-hidden rounded-xl border border-white/10 group">
                  <div className="aspect-[4/3] relative">
                    <img src={project.image} alt={t(project.titleKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="text-primary text-sm font-medium block mb-2">{t(project.categoryKey)}</span>
                      <h3 className="text-xl font-bold text-white">{t(project.titleKey)}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn} className="mt-12 text-center">
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                {t("projectsShowcase.buttonAllProjects")}
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t("cta.heading")}</h2>
              <p className="text-xl text-gray-300 mb-8">
                {t("cta.paragraph")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  {t("cta.buttonOrderConsultation")}
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  {t("cta.buttonFindCost")}
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Construction;