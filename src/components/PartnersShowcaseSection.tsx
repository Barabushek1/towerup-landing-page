
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { HandshakeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { getCachedData } from '@/utils/cache-utils';

interface Partner {
    id: string;
    name: string;
    logo_url: string;
    website_url: string;
}

const PartnersShowcaseSection: React.FC = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    // --- Optimized autoplay effect ---
    useEffect(() => {
        if (!emblaApi) return;

        let autoplay: NodeJS.Timeout | null = null;

        const startAutoplay = () => {
            stopAutoplay();
            autoplay = setInterval(() => {
                if (document.visibilityState === 'visible') { // Only scroll when tab is visible
                    emblaApi?.scrollNext();
                }
            }, 3000);
        };

        const stopAutoplay = () => {
            if (autoplay) clearInterval(autoplay);
        };

        // Pause on hover for usability
        const carouselElement = emblaApi.containerNode();
        carouselElement.addEventListener('mouseenter', stopAutoplay);
        carouselElement.addEventListener('mouseleave', startAutoplay);
        
        // Also pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                startAutoplay();
            } else {
                stopAutoplay();
            }
        });

        startAutoplay();

        return () => {
            stopAutoplay();
            carouselElement.removeEventListener('mouseenter', stopAutoplay);
            carouselElement.removeEventListener('mouseleave', startAutoplay);
            document.removeEventListener('visibilitychange', () => {});
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    // Fetching data with improved caching
    const { data: partners = [], isLoading, error } = useQuery({
        queryKey: ['partners-showcase'],
        queryFn: async () => {
            return getCachedData('partners_showcase', async () => {
                const { data, error } = await supabase.from('partners').select('*').order('name');
                if (error) {
                    console.error('Error fetching partners:', error);
                    throw error;
                }
                return data as Partner[];
            }, 180); // Cache for 3 hours
        },
        staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
        gcTime: 1000 * 60 * 60 * 3, // Keep in React Query cache for 3 hours
    });

    return (
        <section className="py-16 md:py-24 relative bg-[#0f0f0f] overflow-hidden"> {/* Adjusted padding */}
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-transparent to-slate-900/50 -z-10 opacity-70"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-5 opacity-50"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-5 opacity-50"></div>


            <div className="container mx-auto px-4 sm:px-6"> {/* Adjusted padding */}
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium mb-4 font-benzin text-sm md:text-base uppercase tracking-wider"> {/* Adjusted padding/size */}
                        Партнеры
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-benzin"> {/* Adjusted sizes */}
                        Наши надежные партнеры
                    </h2>
                    {/* Optional Subtitle */}
                    {/* <p className="text-slate-400 text-base md:text-lg">Компании, которым мы доверяем и с которыми строим будущее.</p> */}
                </div>

                {/* Loading Skeleton */}
                {isLoading ? (
                    <div className="flex justify-center items-center gap-4 overflow-x-hidden pb-4"> {/* Added padding-bottom */}
                        {[...Array(5)].map((_, i) => ( // Use Array constructor
                            <Skeleton key={i} className="w-36 h-24 sm:w-40 sm:h-28 bg-slate-800 rounded-lg flex-shrink-0" />
                        ))}
                    </div>
                ) : error ? (
                    // Error State
                     <div className="text-center py-10 px-6 bg-slate-800/50 rounded-lg border border-red-700/50 max-w-md mx-auto">
                        <HandshakeIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-400 mb-2 text-lg font-semibold">Ошибка загрузки</p>
                        <p className="text-slate-400 text-sm">Не удалось получить список партнеров. Пожалуйста, попробуйте обновить страницу позже.</p>
                    </div>
                ) : partners.length > 0 ? (
                    // Carousel Implementation
                    <div className="relative px-0 md:px-8"> {/* Removed horizontal padding on mobile */}
                        <div className="overflow-hidden -mx-2 sm:-mx-4" ref={emblaRef}> {/* Negative margin to counter padding */}
                            <div className="flex"> {/* Embla flex container */}
                                {partners.concat(partners).map((partner, index) => ( // Duplicate partners for seamless loop appearance
                                    <div
                                        key={`${partner.id}-${index}`} // Unique key for duplicated items
                                        className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 sm:px-4" // Adjusted widths and added px
                                        style={{ minWidth: 0 }} // Prevent flex items from growing
                                    >
                                        <a
                                            href={partner.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Visit ${partner.name} website`}
                                            className={cn(
                                                "group flex items-center justify-center p-4 sm:p-6",
                                                "bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/50",
                                                "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
                                                "w-full h-24 sm:h-32", // Fixed height for consistency
                                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900" // Added focus styles
                                            )}
                                        >
                                            {partner.logo_url ? (
                                                <img
                                                    src={partner.logo_url}
                                                    alt={`${partner.name} logo`}
                                                    className="max-w-[80%] max-h-[70%] object-contain transition-transform duration-300 group-hover:scale-105" // Adjusted size constraints
                                                    loading="lazy" // Lazy load logos
                                                    onError={e => { // Basic Fallback
                                                        (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image
                                                        const parent = (e.target as HTMLImageElement).parentElement;
                                                        if (parent) {
                                                            const textFallback = document.createElement('span');
                                                            textFallback.className = 'text-sm font-medium text-center text-white/70';
                                                            textFallback.textContent = partner.name;
                                                            parent.appendChild(textFallback);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-center text-white/70">
                                                    {partner.name}
                                                </span>
                                            )}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Control Buttons (Desktop Only) */}
                        <div className="hidden md:block"> {/* Keep hidden on mobile */}
                            <button
                                onClick={scrollPrev}
                                aria-label="Previous partner logo"
                                className="absolute left-0 top-1/2 -translate-y-1/2 transform -translate-x-2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-lg transition-opacity opacity-70 hover:opacity-100 z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={scrollNext}
                                aria-label="Next partner logo"
                                className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-lg transition-opacity opacity-70 hover:opacity-100 z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Empty State
                     <div className="text-center py-10 px-6 bg-slate-800/50 rounded-lg border border-slate-700 max-w-md mx-auto">
                        <HandshakeIcon className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 text-base">Партнеры пока не добавлены.</p>
                        <p className="text-slate-500 text-sm mt-1">Скоро здесь появится информация о наших надежных партнерах.</p>
                    </div>
                )}

                {/* Decorative bottom line (optional) */}
                {/* <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-16 md:mt-20"></div> */}
            </div>
        </section>
    );
};

export default PartnersShowcaseSection;
