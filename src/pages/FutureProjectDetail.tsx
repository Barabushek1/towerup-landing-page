import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchFutureProjectBySlug, FutureProject } from '@/utils/future-project-helpers';
import { motion } from 'framer-motion';
const FutureProjectDetail: React.FC = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const {
    t
  } = useLanguage();
  const [project, setProject] = useState<FutureProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  useEffect(() => {
    const loadProject = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchFutureProjectBySlug(slug);
      if (data) {
        setProject(data);
        setActiveImage(data.coverImage || null);
      }
      setLoading(false);
    };
    loadProject();
  }, [slug]);
  if (loading) {
    return <>
        <NavBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>;
  }
  if (!project) {
    return <>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('futureProjects.projectNotFound')}</h2>
          <p className="mb-8">{t('futureProjects.projectNotFoundDesc')}</p>
          <Link to="/future-projects">
            <Button>
              {t('futureProjects.backToProjects')}
            </Button>
          </Link>
        </div>
        <Footer />
      </>;
  }
  const breadcrumb = `${t('nav.home')} / ${t('nav.projects')} / ${t('nav.futureProjects')} / ${project.title}`;
  return <>
      <Helmet>
        <title>{project.title} | TOWERUP</title>
        <meta name="description" content={project.description.substring(0, 155)} />
      </Helmet>

      <NavBar />
      
      <PageHeader title={project.title} subtitle={project.location || t('futureProjects.futureProject')} breadcrumb={breadcrumb} backgroundImage={project.coverImage || undefined} />
      
      <main className="bg-white">
        <div className="container mx-auto px-4 py-12 bg-zinc-900">
          <Link to="/future-projects" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft size={16} className="mr-2" />
            {t('futureProjects.backToProjects')}
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="rounded-lg overflow-hidden bg-gray-100 h-[400px] sm:h-[500px]">
                  {activeImage ? <img src={activeImage} alt={project.title} className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} /> : <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 font-benzin">No Image</span>
                    </div>}
                </div>
              </div>
              
              {project.galleryImages && project.galleryImages.length > 0 && <div className="grid grid-cols-4 gap-3">
                  {project.coverImage && <button onClick={() => setActiveImage(project.coverImage || null)} className={`rounded-md overflow-hidden h-20 ${activeImage === project.coverImage ? 'ring-2 ring-primary' : ''}`}>
                      <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} />
                    </button>}
                  
                  {project.galleryImages.map((img, index) => <button key={index} onClick={() => setActiveImage(img)} className={`rounded-md overflow-hidden h-20 ${activeImage === img ? 'ring-2 ring-primary' : ''}`}>
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} />
                    </button>)}
                </div>}
            </div>
            
            {/* Right Column - Info */}
            <div>
              <div className="p-6 rounded-lg mb-6 bg-gray-800">
                <h2 className="text-2xl font-bold font-benzin mb-4">
                  {t('futureProjects.projectDetails')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-200">{t('futureProjects.location')}</p>
                      <p className="font-medium text-brand-secondary">{project.location || t('futureProjects.locationNotSpecified')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('futureProjects.estimatedCompletion')}</p>
                      <p className="font-medium">{project.completionDate || t('futureProjects.toBeAnnounced')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('futureProjects.status')}</p>
                      <p className="font-medium">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {project.status === 'upcoming' ? t('futureProjects.statusUpcoming') : project.status === 'active' ? t('futureProjects.statusActive') : t('futureProjects.statusCompleted')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mb-6">
                {t('futureProjects.contactUs')}
              </Button>
              
              {project.features && project.features.length > 0 && project.features.some(f => f.title || f.description) && <div className="p-6 rounded-lg bg-gray-800">
                  <h3 className="text-xl font-bold font-benzin mb-4">
                    {t('futureProjects.projectFeatures')}
                  </h3>
                  
                  <ul className="space-y-3">
                    {project.features.filter(f => f.title || f.description).map((feature, index) => <li key={index} className="flex">
                        <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          {feature.title && <p className="font-medium">{feature.title}</p>}
                          {feature.description && <p className="text-sm text-gray-600">{feature.description}</p>}
                        </div>
                      </li>)}
                  </ul>
                </div>}
            </div>
          </div>
          
          <div className="mt-12">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">{t('futureProjects.overview')}</TabsTrigger>
                {/* Additional tabs can be added here if needed */}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5
              }}>
                  <h2 className="text-2xl font-bold font-benzin mb-6">
                    {t('futureProjects.projectOverview')}
                  </h2>
                  
                  <div className="prose prose-lg max-w-none">
                    {project.description.split('\n').map((paragraph, index) => paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />)}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </>;
};
export default FutureProjectDetail;