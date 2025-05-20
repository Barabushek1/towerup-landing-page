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
  const [activeTab, setActiveTab] = useState<string>("1-комнатные");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Fetch floor plans from Supabase
  const { data: floorPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['yangiUzbekistanFloorPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_plans')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching floor plans:", error);
        throw new Error(`Error fetching floor plans: ${error.message}`);
      }
      
      return data as FloorPlan[];
    }
  });
  
  // Fetch floor prices from Supabase
  const { data: floorPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['yangiUzbekistanFloorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*');
      
      if (error) {
        console.error("Error fetching floor prices:", error);
        throw new Error(`Error fetching floor prices: ${error.message}`);
      }
      
      return data as FloorPrice[];
    }
  });
  
  // Get the current price per sqm for the active tab
  const getPricePerSqm = () => {
    if (pricesLoading || !floorPrices) return 12000000; // Default fallback
    
    const priceData = floorPrices.find(price => price.apartment_type === activeTab);
    return priceData ? priceData.price_per_sqm : 12000000;
  };
  
  const currentPricePerSqm = getPricePerSqm();

  // Get floor plans for the current active tab
  const getFloorPlansForTab = () => {
    if (plansLoading || !floorPlans) return [];
    return floorPlans.filter(plan => plan.room_type === activeTab);
  };

  const currentFloorPlans = getFloorPlansForTab();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const openFullScreenImage = (planId: string) => {
    setSelectedPlan(planId);
    setIsImageOpen(true);
  };

  const getSelectedPlanData = () => {
    if (selectedPlan === null || !floorPlans) return null;
    return floorPlans.find(plan => plan.id === selectedPlan);
  };

  // Calculate price from area
  const calculatePrice = (area: number): number => {
    return area * currentPricePerSqm;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -150,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 150,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeElement = container.querySelector(`[data-state="active"]`) as HTMLElement;
    if (activeElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const centerPosition = elementRect.left + elementRect.width / 2 - containerRect.left - containerRect.width / 2;
      container.scrollBy({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const selectedPlanData = getSelectedPlanData();

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -10
    }
  };

  // Get unique room types
  const roomTypes = floorPlans ? Array.from(new Set(floorPlans.map(plan => plan.room_type))) : ["1-комнатные", "2-комнатные", "3-комнатные"];

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
              
              {/* Mobile scroll buttons */}
              <div className="flex justify-center mt-3 sm:hidden">
                <button onClick={scrollLeft} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-2">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={scrollRight} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {roomTypes.map(roomType => (
                <TabsContent key={roomType} value={roomType} className="w-full">
                  <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible" 
                    exit="exit" 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {currentFloorPlans.map(plan => {
                      const calculatedPrice = calculatePrice(plan.area);
                      
                      return (
                        <motion.div key={plan.id} variants={itemVariants} className="h-full">
                          <Card className="bg-[#1a1a1a] border border-slate-700/30 overflow-hidden rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                            <CardContent className="p-0 h-full flex flex-col">
                              <div className="p-5 sm:p-6">
                                <h3 className="text-primary text-xl sm:text-2xl font-bold">{plan.title}</h3>
                                <p className="text-white/80 mb-2">{plan.subtitle}</p>
                                
                                <div className="my-4">
                                  <h4 className="text-primary text-2xl sm:text-3xl font-bold">{plan.area} м²</h4>
                                  <p className="text-white/60">площадь</p>
                                </div>
                              </div>
                              
                              <div 
                                className="relative aspect-square bg-gray-800 border-y border-slate-700/30 group cursor-pointer overflow-hidden flex-shrink-0" 
                                onClick={() => openFullScreenImage(plan.id)}
                              >
                                <img 
                                  src={plan.image_url} 
                                  alt={`${plan.title} ${plan.area} м²`} 
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <ZoomIn className="h-8 w-8 text-white" />
                                    <span className="text-white font-medium text-sm bg-primary/80 px-3 py-1 rounded-full">Просмотреть</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-5 sm:p-6 mt-auto">
                                <div className="mb-4">
                                  <h4 className="text-primary text-lg sm:text-xl font-bold">
                                    от {formatNumberWithSpaces(calculatedPrice)} сум
                                  </h4>
                                  <p className="text-white/60 text-xs sm:text-sm flex items-center gap-1">
                                    <Calculator className="w-3 h-3 text-primary/70" />
                                    {formatNumberWithSpaces(currentPricePerSqm)} сум/м²
                                  </p>
                                </div>
                                
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white transition-colors">
                                  Выбрать
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Full Screen Floor Plan Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] max-h-[95vh] p-0 bg-black border-gray-800">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <DialogClose className="rounded-full p-2 bg-black/70 hover:bg-black/90 text-white/80 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
            
            {selectedPlanData && (
              <div className="flex flex-col h-full">
                <div className="p-6 flex-none bg-[#0a0a0a] border-b border-gray-800/40">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-white text-xl sm:text-2xl font-bold">
                        {selectedPlanData.title} {selectedPlanData.subtitle}
                      </h3>
                      <p className="text-white/60">
                        {selectedPlanData.area} м²
                      </p>
                    </div>
                    <div className="bg-[#131313] px-4 py-2 rounded-lg border border-primary/20">
                      <h4 className="text-primary font-bold text-lg">
                        от {formatNumberWithSpaces(calculatePrice(selectedPlanData.area))} сум
                      </h4>
                      <p className="text-xs text-white/50">
                        {formatNumberWithSpaces(currentPricePerSqm)} сум/м²
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden flex items-center justify-center p-0 sm:p-4 bg-black">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={selectedPlanData.image_url}
                    alt={`${selectedPlanData.title} ${selectedPlanData.area} м²`}
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                  />
                </div>

                <div className="p-6 bg-[#0a0a0a] border-t border-gray-700/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-primary text-xl font-bold">
                        от {formatNumberWithSpaces(calculatePrice(selectedPlanData.area))} сум
                      </h4>
                      <p className="text-white/60 text-sm">
                        Узнайте условия у менеджера
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-primary hover:bg-primary/90 text-white transition-colors flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>Позвонить</span>
                      </Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Запросить информацию</span>
                      </Button>
                    </div>
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

// Custom TabsTrigger component
const CustomTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>, 
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    value={value}
    className={cn(
      "px-5 py-2.5 min-w-[140px] sm:min-w-[160px] text-base font-medium transition-all border rounded-lg shrink-0",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus-visible:ring-offset-2",
      "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20",
      "data-[state=inactive]:border-white/20 data-[state=inactive]:bg-[#1a1a1a] data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#222] data-[state=inactive]:hover:border-primary/40",
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
));
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export default FloorPlansSection;
