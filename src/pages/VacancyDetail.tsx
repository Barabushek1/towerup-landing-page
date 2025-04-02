
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { ArrowLeft, Briefcase, Building, MapPin, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Vacancy {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  is_active: boolean;
  description: string;
  requirements?: string;
  benefits?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const VacancyDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: vacancy, isLoading, error } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      if (!id) throw new Error("No vacancy ID provided");
      
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Vacancy;
    },
    enabled: !!id
  });
  
  // Helper function to render content with line breaks
  const renderWithLineBreaks = (text: string | undefined) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ВАКАНСИИ" 
          breadcrumb={vacancy ? `ВАКАНСИИ / ${vacancy.title.toUpperCase()}` : "ВАКАНСИИ"}
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl mx-auto">
              <Link to="/vacancies" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 font-benzin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к вакансиям
              </Link>
              
              {isLoading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                  <p className="mt-4 text-slate-400">Загрузка вакансии...</p>
                </div>
              ) : error || !vacancy ? (
                <div className="text-center py-20">
                  <p className="text-red-400">Вакансия не найдена или произошла ошибка при загрузке.</p>
                  <Link 
                    to="/vacancies" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin mt-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Вернуться к списку вакансий
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-slate-800/40 rounded-lg border border-primary/10 p-8 mb-8">
                    <h1 className="text-3xl font-bold text-white mb-6 font-benzin">{vacancy.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Местоположение</p>
                          <p className="font-medium text-white">{vacancy.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Занятость</p>
                          <p className="font-medium text-white">Полная занятость</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary/30 via-primary/20 to-transparent px-6 py-3 rounded-lg mb-8 flex items-center justify-between">
                      <span className="text-xl font-bold text-white font-benzin">Зарплата</span>
                      <span className="text-xl font-bold text-white font-benzin">{vacancy.salary_range}</span>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-bold mb-4 text-white font-benzin">Описание вакансии</h2>
                        <div className="text-slate-300 space-y-2">
                          {renderWithLineBreaks(vacancy.description)}
                        </div>
                      </div>
                      
                      {vacancy.requirements && (
                        <div>
                          <h2 className="text-xl font-bold mb-4 text-white font-benzin">Требования</h2>
                          <div className="text-slate-300 space-y-1">
                            {renderWithLineBreaks(vacancy.requirements)}
                          </div>
                        </div>
                      )}
                      
                      {vacancy.benefits && (
                        <div>
                          <h2 className="text-xl font-bold mb-4 text-white font-benzin">Что мы предлагаем</h2>
                          <div className="text-slate-300 space-y-1">
                            {renderWithLineBreaks(vacancy.benefits)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 p-8 rounded-lg bg-slate-800/40 border border-primary/10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="bg-primary/10 p-6 rounded-full">
                        <Briefcase className="w-12 h-12 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin text-center md:text-left">Заинтересованы в этой вакансии?</h3>
                        <p className="text-muted-foreground mb-4 font-benzin text-center md:text-left">
                          Отправьте нам свое резюме, и мы свяжемся с вами в ближайшее время.
                        </p>
                        <div className="flex justify-center md:justify-start">
                          <a 
                            href="#contact" 
                            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                          >
                            <span>Откликнуться на вакансию</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VacancyDetail;
