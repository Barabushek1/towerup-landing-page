
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { HandshakeIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

const PartnersShowcaseSection: React.FC = () => {
  const isMobile = useIsMobile();

  // Fetch partners from Supabase
  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners-showcase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching partners:', error);
        throw error;
      }
      
      return data as Partner[];
    }
  });

  return (
    <section className="py-24 relative bg-[#0f0f0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-slate-900/50 -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-slate-800 rounded-full blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium mb-6 font-benzin text-3xl">
            Партнеры
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-benzin">
            Наши надежные партнеры
          </h2>
          <p className="text-lg text-slate-300 mx-auto font-benzin">
            Мы гордимся сотрудничеством с ведущими компаниями, которые разделяют наши ценности и стремление к качеству
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-40 h-24 bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700 max-w-lg mx-auto">
            <HandshakeIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">Произошла ошибка при загрузке партнеров</p>
          </div>
        ) : partners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 justify-items-center">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-center p-6",
                  "bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/50",
                  "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
                  "w-full h-32 md:h-40"
                )}
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x100?text=' + encodeURIComponent(partner.name);
                    }}
                  />
                ) : (
                  <span className="text-lg font-medium text-center text-white">{partner.name}</span>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700 max-w-lg mx-auto">
            <HandshakeIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Партнеры пока не добавлены</p>
          </div>
        )}

        {/* Decorative bottom line */}
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-20"></div>
      </div>
    </section>
  );
};

export default PartnersShowcaseSection;
