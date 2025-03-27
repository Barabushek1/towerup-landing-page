
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { MapPin, Coins, Clock, Briefcase, ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface VacancyItem {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  description: string;
  requirements?: string;
  is_active: boolean;
  image_url?: string;
  additional_images?: string[];
  created_at: string;
  updated_at: string;
}

const VacancyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vacancy, setVacancy] = useState<VacancyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as VacancyItem;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      setVacancy(data);
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!vacancy?.additional_images) return;
    
    const imagesCount = vacancy.additional_images.length;
    if (direction === 'next') {
      setCurrentImageIndex((currentImageIndex + 1) % imagesCount);
    } else {
      setCurrentImageIndex((currentImageIndex - 1 + imagesCount) % imagesCount);
    }
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, currentImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-6">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-lg p-8 border border-primary/10">
            <h1 className="text-2xl font-bold mb-4 font-benzin text-white">Вакансия не найдена</h1>
            <p className="mb-6 font-benzin">Запрашиваемая вакансия не существует или была удалена.</p>
            <Link to="/vacancies">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Вернуться к вакансиям
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
      <NavBar />
      
      <PageHeader 
        title={vacancy.title}
        breadcrumb="ВАКАНСИИ"
      />
      
      <div className="bg-[#1a1a1a] py-8">
        <div className="container mx-auto px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">ГЛАВНАЯ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/vacancies">ВАКАНСИИ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-white">{vacancy.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <main>
        <div className="bg-[#1a1a1a] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Link to="/vacancies">
                <Button variant="outline" className="mb-6 flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Все вакансии
                </Button>
              </Link>
              
              {/* Main image if available */}
              {vacancy.image_url && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={vacancy.image_url} 
                    alt={vacancy.title}
                    className="w-full h-auto object-cover" 
                  />
                </div>
              )}
              
              <div className="bg-slate-800/40 rounded-lg p-8 border border-primary/10">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10 mr-6">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-benzin text-white">{vacancy.title}</h1>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">{vacancy.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">{vacancy.salary_range}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">Полная занятость</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 font-benzin border-b border-slate-700 pb-2">Описание вакансии</h2>
                  <div className="prose prose-invert max-w-none font-benzin">
                    {vacancy.description ? (
                      vacancy.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-slate-400">Подробное описание не предоставлено</p>
                    )}
                  </div>
                </div>
                
                {vacancy.requirements && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 font-benzin border-b border-slate-700 pb-2">Требования</h2>
                    <ul className="list-disc list-inside font-benzin">
                      {vacancy.requirements.split('\n').map((item, index) => (
                        <li key={index} className="mb-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-10">
                  <a 
                    href="#contact" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                  >
                    <span>Откликнуться на вакансию</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
              
              {/* Photo Gallery with full-screen capability */}
              {vacancy.additional_images && vacancy.additional_images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 font-benzin">Фотогалерея</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {vacancy.additional_images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Lightbox for fullscreen image view */}
      {lightboxOpen && vacancy.additional_images && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={closeLightbox}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigateImage('prev')}
                className="text-white hover:bg-white/20 h-12 w-12"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigateImage('next')}
                className="text-white hover:bg-white/20 h-12 w-12"
              >
                <ArrowLeft className="h-6 w-6 transform rotate-180" />
              </Button>
            </div>
            
            <img
              src={vacancy.additional_images[currentImageIndex]}
              alt={`Фото ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentImageIndex + 1} / {vacancy.additional_images.length}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default VacancyDetail;
