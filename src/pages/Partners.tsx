
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getCachedData } from '@/utils/cache-utils';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

const Partners: React.FC = () => {
  const { data: partners, isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      return getCachedData('partners_list', async () => {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        return data as Partner[];
      }, 120); // Cache for 2 hours
    },
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    cacheTime: 1000 * 60 * 60 * 2, // Keep in React Query cache for 2 hours
  });

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ПАРТНЕРЫ" 
          breadcrumb="ПАРТНЕРЫ"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200 font-benzin text-center">Наши партнеры</h2>
              <p className="text-lg text-slate-300 mb-12 text-center max-w-2xl mx-auto font-benzin">
                TOWER UP гордится партнерством с ведущими компаниями отрасли, которые разделяют наше стремление к инновациям и качеству
              </p>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-400">Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
                </div>
              ) : partners && partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <a 
                      key={partner.id}
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-800/50 hover:bg-slate-800 transition-all p-6 rounded-xl border border-slate-700/30 flex flex-col items-center text-center group"
                    >
                      <div className="w-32 h-32 bg-slate-900/50 rounded-2xl p-4 flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                        {partner.logo_url ? (
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain" 
                          />
                        ) : (
                          <div className="text-4xl font-bold text-primary">{partner.name.charAt(0)}</div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 font-benzin">{partner.name}</h3>
                      <span className="text-primary text-sm group-hover:underline">Посетить сайт</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400">Информация о партнерах будет добавлена в ближайшее время.</p>
                </div>
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

export default Partners;
