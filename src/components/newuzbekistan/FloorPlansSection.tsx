import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, ZoomIn, ChevronLeft, ChevronRight, Phone, Mail, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as RovingFocusPrimitive from '@radix-ui/react-roving-focus';
import { cn } from "@/lib/utils";
import { formatNumberWithSpaces, formatPricePerSqm } from "@/utils/format-utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FloorPlansSectionProps {
  projectId?: string;
  pricePerSqm?: number;
}

// Define the floor plan type
interface FloorPlan {
  id: string;
  title: string;
  subtitle: string;
  area: number;
  room_type: string;
  image_url: string;
  display_order: number;
}

interface FloorPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
}

const FloorPlansSection: React.FC<FloorPlansSectionProps> = ({ projectId }) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1-комнатные');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Room types (corresponding to tabs)
  const roomTypes = ['1-комнатные', '2-комнатные', '3-комнатные'];

  // Fetch floor plans from Supabase
  const { data: floorPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['yangiUzbekistanFloorPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_plans')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw new Error(error.message);
      return data as FloorPlan[];
    },
  });
  
  // Fetch prices from Supabase
  const { data: floorPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['yangiUzbekistanFloorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*');
        
      if (error) throw new Error(error.message);
      return data as FloorPrice[];
    },
  });
  
  // Get the current price per sqm for the active tab
  const getPricePerSqm = () => {
    if (pricesLoading || !floorPrices) return 12000000; // Default fallback
    
    const priceData = floorPrices.find(price => price.apartment_type === activeTab);
    return priceData ? priceData.price_per_sqm : 12000000;
  };
  
  const currentPricePerSqm = getPricePerSqm();

  // Filter floor plans by room type
  const getFloorPlansForTab = (roomType: string) => {
    if (plansLoading || !floorPlans) return [];
    return floorPlans.filter(plan => plan.room_type === roomType)
      .sort((a, b) => a.display_order - b.display_order);
  };
  
  // Get the currently selected plan data
  const getSelectedPlanData = () => {
    if (selectedPlanIndex === null) return null;
    const plansForActiveTab = getFloorPlansForTab(activeTab);
    return selectedPlanIndex < plansForActiveTab.length ? plansForActiveTab[selectedPlanIndex] : null;
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedPlanIndex(null);
  };

  // Scroll the tabs container
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Animation variants for the plan cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const selectedPlanData = getSelectedPlanData();

  // Show loading state if prices or plans are still loading
  if (pricesLoading || plansLoading) {
    return (
      <section id="floor-plans" className="py-16 bg-[#161616]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-primary">ПЛАНИРОВКИ</h2>
            <h3 className="text-xl sm:text-2xl font-medium mb-8 text-center text-white">YANGI UZBEKISTAN</h3>
            <div className="w-full flex justify-center py-12">
              <div className="animate-pulse flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-white">Загрузка данных...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="floor-plans" className="py-16 bg-[#161616]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-primary">ПЛАНИРОВКИ</h2>
          <h3 className="text-xl sm:text-2xl font-medium mb-8 text-center text-white">YANGI UZBEKISTAN</h3>
          
          <Tabs defaultValue="1-комнатные" className="w-full max-w-5xl" value={activeTab} onValueChange={handleTabChange}>
            <div className="relative mb-8 w-full">
              <button onClick={scrollLeft} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden sm:flex">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <RovingFocusPrimitive.Root orientation="horizontal" loop className="w-full">
                <TabsPrimitive.List className="relative overflow-x-auto scrollbar-hide w-full flex items-center justify-start sm:justify-center px-4 py-2 bg-[#131313] rounded-xl border border-white/5 shadow-inner" style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }} ref={scrollContainerRef}>
                  <div className="flex gap-3 w-max sm:w-auto sm:mx-auto">
                    {roomTypes.map(roomType => (
                      <RovingFocusPrimitive.Item asChild key={roomType}>
                        <CustomTabsTrigger value={roomType}>
                          {roomType}
                        </CustomTabsTrigger>
                      </RovingFocusPrimitive.Item>
                    ))}
                  </div>
                </TabsPrimitive.List>
              </RovingFocusPrimitive.Root>
              <button onClick={scrollRight} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden sm:flex">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {roomTypes.map((roomType, idx) => (
              <TabsContent key={roomType} value={roomType} className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {getFloorPlansForTab(roomType).map((plan, index) => {
                    // Calculate price
                    const totalPrice = plan.area * currentPricePerSqm;
                    
                    return (
                      <motion.div
                        key={plan.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="col-span-1"
                      >
                        <Card className="bg-[#1a1a1a] border-none overflow-hidden relative h-full flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                          <div className="flex-1">
                            <div 
                              className="relative pt-[100%] overflow-hidden cursor-pointer"
                              onClick={() => {
                                setSelectedPlanIndex(index);
                                setIsDialogOpen(true);
                              }}
                            >
                              <img 
                                src={plan.image_url} 
                                alt={plan.title} 
                                className="absolute inset-0 w-full h-full object-contain p-4" 
                              />
                              <div className="absolute bottom-2 right-2 z-10 bg-black/70 text-white text-xs rounded-full p-1.5">
                                <ZoomIn className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h4 className="text-xl text-white font-semibold mb-1">
                              {plan.title}
                              <span className="text-sm font-normal text-gray-400 ml-1">
                                {plan.subtitle}
                              </span>
                            </h4>
                            
                            <div className="flex justify-between items-start mt-3">
                              <div>
                                <p className="text-sm text-gray-400">Площадь</p>
                                <p className="font-bold text-white">{plan.area} м²</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">Стоимость</p>
                                <p className="font-bold text-primary">от {formatNumberWithSpaces(totalPrice)} сум</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                {getFloorPlansForTab(roomType).length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    <p>Для данного типа планировок еще не добавлены</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex flex-col items-center mt-16 max-w-2xl mx-auto">
            <p className="text-gray-400 text-center text-sm">
              * Стоимость указана за квадратный метр с учетом внутренней отделки. 
              Окончательная цена рассчитывается и фиксируется при подписании договора.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button className="gap-2 bg-green-800 hover:bg-green-700" onClick={() => {
                // Placeholder action for calculator button
                window.open("/calculator", "_blank");
              }}>
                <Calculator className="h-4 w-4" />
                Рассчитать стоимость
              </Button>
              
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800" onClick={() => {
                // Placeholder action for contact button
                document.querySelector('#contact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Phone className="h-4 w-4 mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detail dialog for floor plans */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 p-0 sm:p-0 w-full sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">{selectedPlanData?.title} <span className="text-sm font-normal text-gray-400">{selectedPlanData?.subtitle}</span></h3>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <DialogClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 pb-16">
            <div className="relative">
              {selectedPlanData && (
                <img 
                  src={selectedPlanData.image_url} 
                  alt={selectedPlanData.title} 
                  className={cn(
                    "w-full h-auto object-contain transition-transform duration-300 mx-auto",
                    isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
                  )}
                  onClick={() => setIsZoomed(!isZoomed)} 
                />
              )}
            </div>
            
            {selectedPlanData && (
              <div className="bg-[#0f0f0f] rounded-xl p-5 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Информация о планировке</h4>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Тип:</span>
                      <span className="text-white font-medium">{selectedPlanData.room_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Площадь:</span>
                      <span className="text-white font-medium">{selectedPlanData.area} м²</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Стоимость</h4>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Стоимость за м²:</span>
                      <span className="text-white font-medium">{formatPricePerSqm(currentPricePerSqm)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Общая стоимость:</span>
                      <span className="text-primary font-bold">от {formatNumberWithSpaces(selectedPlanData.area * currentPricePerSqm)} сум</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button className="w-full bg-green-800 hover:bg-green-700 gap-2" onClick={() => {
                      // Placeholder action for calculator button
                      window.open("/calculator", "_blank");
                    }}>
                      <Calculator className="h-4 w-4" />
                      Рассчитать стоимость
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Custom tabs trigger component
const CustomTabsTrigger = React.forwardRef<
  HTMLButtonElement, 
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-[#202020] data-[state=inactive]:text-gray-400 hover:bg-primary/80",
      className
    )}
    {...props}
  />
));
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export default FloorPlansSection;
