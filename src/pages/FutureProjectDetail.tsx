
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, MapPin, LayoutGrid, Construction, BadgeCheck } from 'lucide-react';
import { fetchFutureProjectBySlug, type FutureProject } from '@/utils/future-project-helpers';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';

interface Feature {
  title: string;
  description: string;
  title_en?: string;
  title_ru?: string;
  title_uz?: string;
  description_en?: string;
  description_ru?: string;
  description_uz?: string;
}

const FutureProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [project, setProject] = useState<FutureProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      if (slug) {
        const data = await fetchFutureProjectBySlug(slug);
        if (data) {
          setProject(data);
          if (data.coverImage) {
            setActiveImage(data.coverImage);
          } else if (data.galleryImages && data.galleryImages.length > 0) {
            setActiveImage(data.galleryImages[0]);
          }
        } else {
          navigate('/future-projects');
        }
      }
      setLoading(false);
    };
    
    loadProject();
  }, [slug, navigate]);

  // Handle localized content based on current language
  const getLocalizedContent = (obj: any, field: string, fallback: string): string => {
    const localizedField = `${field}_${language}`;
    return obj && obj[localizedField] ? obj[localizedField] : fallback;
  };

  // Get localized feature content
  const getLocalizedFeature = (feature: any): Feature => {
    if (!feature) return { title: '', description: '' };
    
    return {
      title: getLocalizedContent(feature, 'title', feature.title || ''),
      description: getLocalizedContent(feature, 'description', feature.description || '')
    };
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!project) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('futureProjects.projectNotFound')}</h1>
          <Link to="/future-projects">
            <Button>{t('futureProjects.backToProjects')}</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  // Get localized content
  const title = getLocalizedContent(project, 'title', project.title);
  const description = getLocalizedContent(project, 'description', project.description);
  const location = getLocalizedContent(project, 'location', project.location || '');
  
  return (
    <>
      <Helmet>
        <title>{title} | TOWERUP</title>
        <meta name="description" content={description.substring(0, 160)} />
      </Helmet>
      
      <NavBar />
      
      <main className="bg-zinc-900 pb-16">
        <div className="container mx-auto px-4 pt-8">
          <div className="mb-8">
            <Link to="/future-projects">
              <Button variant="ghost" className="group">
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('futureProjects.backToProjects')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Main image display */}
                <div className="bg-zinc-800 rounded-lg overflow-hidden h-[400px] md:h-[500px]">
                  {activeImage ? (
                    <img 
                      src={activeImage} 
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-zinc-400">No Image Available</span>
                    </div>
                  )}
                </div>
                
                {/* Gallery thumbnails */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {project.coverImage && (
                      <button
                        className={`aspect-square rounded-md overflow-hidden border-2 ${activeImage === project.coverImage ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setActiveImage(project.coverImage)}
                      >
                        <img 
                          src={project.coverImage} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </button>
                    )}
                    
                    {project.galleryImages.map((image, index) => (
                      <button
                        key={index}
                        className={`aspect-square rounded-md overflow-hidden border-2 ${activeImage === image ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setActiveImage(image)}
                      >
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Project description */}
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold font-benzin mb-4 text-zinc-50">{t('futureProjects.projectOverview')}</h2>
                  <div className="prose prose-zinc max-w-none text-zinc-300">
                    <p className="whitespace-pre-line">{description}</p>
                  </div>
                </div>
                
                {/* Project features */}
                {project.features && project.features.length > 0 && (
                  <div className="bg-zinc-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold font-benzin mb-6 text-zinc-50">{t('futureProjects.features')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.features.map((feature, index) => {
                        // Get localized feature content
                        const localizedFeature = getLocalizedFeature(feature);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-zinc-700/50 p-5 rounded-lg"
                          >
                            <h3 className="text-lg font-bold mb-2 flex items-center text-zinc-100">
                              <BadgeCheck size={20} className="text-primary mr-2" />
                              {localizedFeature.title}
                            </h3>
                            <p className="text-zinc-400">{localizedFeature.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                {/* Project details card */}
                <div className="bg-zinc-800 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold font-benzin mb-4 text-zinc-50">{t('futureProjects.projectDetails')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm uppercase text-zinc-500 mb-1">{t('futureProjects.status')}</h3>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${project.status === 'upcoming' ? 'bg-blue-500' : project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <span className="text-zinc-100">
                          {project.status === 'upcoming' ? t('futureProjects.statusUpcoming') : 
                           project.status === 'active' ? t('futureProjects.statusActive') : 
                           t('futureProjects.statusCompleted')}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="bg-zinc-700" />
                    
                    {location && (
                      <>
                        <div>
                          <h3 className="text-sm uppercase text-zinc-500 mb-1">{t('futureProjects.location')}</h3>
                          <div className="flex items-start">
                            <MapPin size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-100">{location}</span>
                          </div>
                        </div>
                        
                        <Separator className="bg-zinc-700" />
                      </>
                    )}
                    
                    {project.completionDate && (
                      <>
                        <div>
                          <h3 className="text-sm uppercase text-zinc-500 mb-1">{t('futureProjects.estimatedCompletion')}</h3>
                          <div className="flex items-center">
                            <Clock size={18} className="text-primary mr-2" />
                            <span className="text-zinc-100">{project.completionDate}</span>
                          </div>
                        </div>
                        
                        <Separator className="bg-zinc-700" />
                      </>
                    )}
                    
                    <div>
                      <h3 className="text-sm uppercase text-zinc-500 mb-1">{t('futureProjects.project')}</h3>
                      <div className="flex items-center">
                        <LayoutGrid size={18} className="text-primary mr-2" />
                        <span className="text-zinc-100">{title}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-zinc-700" />
                    
                    <div>
                      <h3 className="text-sm uppercase text-zinc-500 mb-1">{t('futureProjects.developer')}</h3>
                      <div className="flex items-center">
                        <Construction size={18} className="text-primary mr-2" />
                        <span className="text-zinc-100">TOWERUP</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact card */}
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold font-benzin mb-4 text-zinc-50">{t('futureProjects.contactUs')}</h2>
                  <p className="text-zinc-400 mb-4">{t('futureProjects.contactMessage')}</p>
                  <Link to="/contact">
                    <Button className="w-full">{t('futureProjects.contactButton')}</Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default FutureProjectDetail;
