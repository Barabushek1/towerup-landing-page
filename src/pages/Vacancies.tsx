
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVacancySeeder } from '@/hooks/use-vacancy-seeder';
import { getCachedData } from '@/utils/cache-utils';

interface Vacancy {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  is_active: boolean;
  description: string;
  requirements?: string;
  benefits?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const Vacancies: React.FC = () => {
  // For the contact form toggle
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Seed initial vacancy data if needed
  useVacancySeeder();
  
  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: ['vacancies'],
    queryFn: async () => {
      console.log('Fetching vacancies...');
      return getCachedData('vacancies_list', async () => {
        // Ensure we only fetch active vacancies
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('is_active', true)
          .order('title');
        
        if (error) {
          console.error('Error fetching vacancies:', error);
          throw error;
        }
        
        console.log('Fetched active vacancies:', data);
        return data as Vacancy[];
      }, 5); // Cache for 5 minutes instead of an hour
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in React Query cache for 30 minutes
  });

  const scrollToContact = () => {
    // Toggle the contact form display
    setShowContactForm(true);
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ВАКАНСИИ" 
          breadcrumb="ВАКАНСИИ"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200 font-benzin text-center">Присоединяйтесь к нам</h2>
              
              {isLoading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                  <p className="mt-4 text-slate-400">Загрузка вакансий...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-400">Произошла ошибка при загрузке вакансий. Пожалуйста, попробуйте позже.</p>
                </div>
              ) : vacancies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vacancies.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-lg border border-primary/10 p-6 shadow-sm bg-slate-800/40
                      transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin">{item.title}</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">Полная занятость</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-medium text-brand-primary font-benzin">{item.salary_range}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between">
                        <a
                          href={`/vacancies/${item.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-benzin"
                        >
                          <span>Подробнее</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                        
                        <button
                          onClick={scrollToContact}
                          className="text-slate-300 hover:text-primary transition-colors font-benzin text-sm"
                        >
                          Откликнуться
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400">В настоящее время нет открытых вакансий.</p>
                </div>
              )}
              
              <div className="mt-16 p-8 rounded-lg bg-slate-800/40 border border-primary/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Briefcase className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin text-center md:text-left">Не нашли подходящую вакансию?</h3>
                    <p className="text-muted-foreground mb-4 font-benzin text-center md:text-left">
                      Отправьте нам свое резюме, и мы свяжемся с вами, когда появится подходящая позиция.
                    </p>
                    <div className="flex justify-center md:justify-start">
                      <button 
                        onClick={scrollToContact}
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                      >
                        <span>Отправить резюме</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form section */}
              <div id="contact" className={`mt-16 ${showContactForm ? 'block' : 'hidden'}`}>
                <div className="bg-slate-800/40 border border-primary/10 rounded-lg p-8">
                  <h3 className="text-2xl font-medium text-slate-200 mb-4 font-benzin">Отправить резюме</h3>
                  <p className="mb-6 text-muted-foreground">Заполните форму ниже, и наш HR-специалист свяжется с вами.</p>
                  
                  {/* I'm adding a placeholder for the form here - in a real app you'd build a proper form component */}
                  <div className="bg-slate-700/40 p-6 rounded-md text-center">
                    <p className="mb-4">Для отправки резюме перейдите на страницу конкретной вакансии</p>
                    <a 
                      href="/vacancies" 
                      className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                    >
                      Посмотреть вакансии
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
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

export default Vacancies;
