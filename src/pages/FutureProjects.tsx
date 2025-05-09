
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/PageHeader';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchFutureProjects, FutureProject } from '@/utils/future-project-helpers';
import { motion } from 'framer-motion';

const FutureProjects: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<FutureProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const data = await fetchFutureProjects();
      setProjects(data);
      setLoading(false);
    };

    loadProjects();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('futureProjects.pageTitle')} | TOWERUP</title>
        <meta name="description" content={t('futureProjects.metaDescription')} />
      </Helmet>

      <NavBar />
      
      <PageHeader 
        title={t('futureProjects.title')}
        subtitle={t('futureProjects.subtitle')}
        breadcrumbs={[
          { name: t('nav.home'), href: '/' },
          { name: t('nav.projects'), href: '/projects' },
          { name: t('nav.futureProjects'), href: '/future-projects' }
        ]}
        backgroundImage="https://images.unsplash.com/photo-1486744328743-c1151100a95a?q=80&w=1974&auto=format&fit=crop"
      />
      
      <main className="pt-12 pb-24 bg-white">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 font-benzin">
              {t('futureProjects.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('futureProjects.sectionDescription')}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-benzin mb-4">
                {t('futureProjects.noProjects')}
              </h3>
              <p className="text-gray-500">
                {t('futureProjects.checkBackSoon')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="h-56 overflow-hidden relative">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 font-benzin">No Image</span>
                      </div>
                    )}
                    
                    {project.status && (
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'upcoming' ? 'bg-blue-500 text-white' :
                        project.status === 'active' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {project.status === 'upcoming' ? t('futureProjects.statusUpcoming') :
                         project.status === 'active' ? t('futureProjects.statusActive') :
                         t('futureProjects.statusCompleted')}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-dark mb-3 font-benzin">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {project.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={16} className="mr-2 text-primary" />
                          {project.location}
                        </div>
                      )}
                      
                      {project.completionDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={16} className="mr-2 text-primary" />
                          {t('futureProjects.estimatedCompletion')}: {project.completionDate}
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/future-projects/${project.slug}`} className="block">
                      <Button className="w-full justify-between">
                        {t('futureProjects.viewProject')}
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default FutureProjects;
