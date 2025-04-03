import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { HandshakeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import useEmblaCarousel from 'embla-carousel-react';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

const PartnersShowcaseSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Автопрокрутка
  useEffect(() => {
    if (!emblaApi || !isMobile) return;

    let autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 2000);

    return () => clearInterval(autoplay);
  }, [emblaApi, isMobile]);

  // Функции для кнопок "назад/вперед"
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Получение данных из Supabase
  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners-showcase'],
    queryFn: async () => {
      const { data, error } = await supabase.from('partners').select('*').order('name');
      if (error) {
        console.error('Error fetching partners:', error);
        throw error;
      }
      return data as Partner[];
    }
  });

  return (
    <section className="py-24 relative bg-[#0f0f0f] overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-slate-900/50 -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-5"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium mb-6 font-benzin text-3xl">
            Партнеры
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-benzin">
            Наши надежные партнеры
          </h2>
        </div>

        {/* Скелетон загрузки */}
        {isLoading ? (
          <div className="flex justify-center items-center gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="w-40 h-24 bg-slate-800 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700 max-w-lg mx-auto">
            <HandshakeIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">Произошла ошибка при загрузке партнеров</p>
          </div>
        ) : partners.length > 0 ? (
          <div className="relative px-4 md:px-8">
            {/* Карусель */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {partners.map(partner => (
                  <div
                    key={partner.id}
                    className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 sm:p-4"
                  >
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center justify-center p-4 sm:p-6",
                        "bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/50",
                        "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
                        "w-full h-24 sm:h-32"
                      )}
                    >
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={e => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = 'https://placehold.co/200x100?text=' + encodeURIComponent(partner.name);
                          }}
                        />
                      ) : (
                        <span className="text-lg font-medium text-center text-white">
                          {partner.name}
                        </span>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопки управления (только для ПК) */}
            <div className="hidden md:flex justify-between absolute inset-0 items-center">
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white p-3 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white p-3 rounded-full shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700 max-w-lg mx-auto">
            <HandshakeIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Партнеры пока не добавлены</p>
          </div>
        )}

        {/* Декоративная нижняя линия */}
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-20"></div>
      </div>
    </section>
  );
};

export default PartnersShowcaseSection;
