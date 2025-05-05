
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building, Users, ShoppingBag, Utensils, Film, Car } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TrcBochka: React.FC = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (inView) {
        controls.start('animate');
      }
    }, [controls, inView]);
    
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate={controls}
        variants={staggerContainer}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>{t('trcBochka.title')} | TOWERUP</title>
        <meta name="description" content={t('trcBochka.description')} />
      </Helmet>
      
      <NavBar />

      <main>
        {/* Hero Section */}
        <PageHeader 
          title={t('trcBochka.title')}
          breadcrumb={`${t('nav.projects')} / ${t('trcBochka.title')}`}
          backgroundImage="/lovable-uploads/60a5c9f9-6a6c-4358-84a4-aea6b38dc165.png"
        />

        {/* Project Overview */}
        <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
          <div className="absolute -left-64 -top-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse opacity-50 z-0"></div>
          <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 filter blur-[100px] md:blur-[120px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

          <div className="container mx-auto px-6 relative z-10">
            <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('trcBochka.overview.title')}</h2>
                <p className="text-lg leading-relaxed text-gray-300 mb-6">
                  {t('trcBochka.overview.desc1')}
                </p>
                <p className="text-lg leading-relaxed text-gray-300 mb-8">
                  {t('trcBochka.overview.desc2')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                    {t('trcBochka.contact.button')}
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                    {t('trcBochka.downloadPresentation')}
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="order-1 lg:order-2">
                <div className="relative">
                  <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                    <img 
                      src="/lovable-uploads/2744afca-b80a-4a76-8b7c-4666a3d44a60.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.sideView')}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                    <img 
                      src="/lovable-uploads/38cd93b4-a24c-4390-bd04-0ed51282d778.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.entrance')}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Key Features */}
            <AnimatedSection className="mt-24">
              <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
                {t('trcBochka.keyFeatures')}
              </motion.h3>
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Building, title: t('trcBochka.features.floors.title'), description: t('trcBochka.features.floors.desc') },
                  { icon: MapPin, title: t('trcBochka.features.location.title'), description: t('trcBochka.features.location.desc') },
                  { icon: Calendar, title: t('trcBochka.features.opening.title'), description: t('trcBochka.features.opening.desc') },
                  { icon: Users, title: t('trcBochka.features.visitors.title'), description: t('trcBochka.features.visitors.desc') }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Design & Architecture */}
        <section className="py-20 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <AnimatedSection>
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('trcBochka.architecture.title')}</h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  {t('trcBochka.architecture.subtitle')}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('trcBochka.architecture.facade.title')}</h3>
                    <p className="text-gray-300">
                      {t('trcBochka.architecture.facade.desc')}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('trcBochka.architecture.barrel.title')}</h3>
                    <p className="text-gray-300">
                      {t('trcBochka.architecture.barrel.desc')}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('trcBochka.architecture.terraces.title')}</h3>
                    <p className="text-gray-300">
                      {t('trcBochka.architecture.terraces.desc')}
                    </p>
                  </div>
                </div>

                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src="/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png" 
                    alt={`${t('trcBochka.title')} - ${t('trcBochka.architecture.title')}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-20000 animate-slowly-pan-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                      <h4 className="text-xl font-semibold text-white mb-2">{t('trcBochka.architecture.modern.title')}</h4>
                      <p className="text-gray-200">
                        {t('trcBochka.architecture.modern.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features & Amenities */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
          <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <AnimatedSection>
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('trcBochka.zones.title')}</h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  {t('trcBochka.zones.subtitle')}
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: ShoppingBag,
                    title: t('trcBochka.zones.retail.title'),
                    description: t('trcBochka.zones.retail.desc'),
                    color: "from-green-500/20 to-emerald-600/20"
                  },
                  {
                    icon: Utensils,
                    title: t('trcBochka.zones.food.title'),
                    description: t('trcBochka.zones.food.desc'),
                    color: "from-amber-500/20 to-orange-600/20"
                  },
                  {
                    icon: Film,
                    title: t('trcBochka.zones.entertainment.title'),
                    description: t('trcBochka.zones.entertainment.desc'),
                    color: "from-blue-500/20 to-indigo-600/20"
                  },
                  {
                    icon: Car,
                    title: t('trcBochka.zones.parking.title'),
                    description: t('trcBochka.zones.parking.desc'),
                    color: "from-gray-500/20 to-slate-600/20"
                  },
                  {
                    icon: Users,
                    title: t('trcBochka.zones.public.title'),
                    description: t('trcBochka.zones.public.desc'),
                    color: "from-purple-500/20 to-violet-600/20"
                  },
                  {
                    icon: Building,
                    title: t('trcBochka.zones.offices.title'),
                    description: t('trcBochka.zones.offices.desc'),
                    color: "from-red-500/20 to-rose-600/20"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="rounded-xl overflow-hidden group"
                  >
                    <div className={`bg-gradient-to-br ${feature.color} p-6 h-full border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg hover:scale-[1.02] flex flex-col`}>
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                      <p className="text-gray-300 flex-grow">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-20 md:py-24 bg-[#161616]">
          <div className="container mx-auto px-6">
            <AnimatedSection>
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('trcBochka.gallery.title')}</h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  {t('trcBochka.gallery.subtitle')}
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={fadeInUp} className="row-span-2 lg:col-span-2 rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[4/3] md:aspect-auto md:h-full relative group">
                    <img 
                      src="/lovable-uploads/38cd93b4-a24c-4390-bd04-0ed51282d778.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.gallery.mainEntrance')}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{t('trcBochka.gallery.mainEntrance')}</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/2] relative group">
                    <img 
                      src="/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.gallery.generalView')}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{t('trcBochka.gallery.generalView')}</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/2] relative group">
                    <img 
                      src="/lovable-uploads/2744afca-b80a-4a76-8b7c-4666a3d44a60.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.gallery.sideView')}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{t('trcBochka.gallery.sideView')}</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/2] relative group">
                    <img 
                      src="/lovable-uploads/60a5c9f9-6a6c-4358-84a4-aea6b38dc165.png" 
                      alt={`${t('trcBochka.title')} - ${t('trcBochka.gallery.withTerraces')}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{t('trcBochka.gallery.withTerraces')}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
          <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <AnimatedSection>
              <motion.div 
                variants={fadeInUp}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('trcBochka.cta.title')}</h2>
                <p className="text-xl text-gray-300 mb-8">
                  {t('trcBochka.cta.description')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                    {t('trcBochka.cta.requestButton')}
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                    {t('trcBochka.cta.downloadButton')}
                  </Button>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default TrcBochka;
