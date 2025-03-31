
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, Maximize, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Floor plan data with updated counts and image
const floorPlans = {
  "1-комнатные": [
    {
      id: 1,
      title: "1-комнатная",
      subtitle: "квартира",
      area: "31.01 м²",
      areaLabel: "площадь",
      price: "от 348 768 000 сум",
      monthly: "от 7 266 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 2,
      title: "1-комнатная",
      subtitle: "квартира",
      area: "39.51 м²",
      areaLabel: "площадь",
      price: "от 450 362 000 сум",
      monthly: "от 9 382 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 3,
      title: "1-комнатная",
      subtitle: "квартира",
      area: "35.43 м²",
      areaLabel: "площадь",
      price: "от 407 445 000 сум",
      monthly: "от 8 655 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    }
  ],
  "2-комнатные": [
    {
      id: 4,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "58.32 м²",
      areaLabel: "площадь",
      price: "от 688 176 000 сум",
      monthly: "от 14 337 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 5,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "62.45 м²",
      areaLabel: "площадь",
      price: "от 736 910 000 сум",
      monthly: "от 15 352 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 6,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "65.18 м²",
      areaLabel: "площадь",
      price: "от 769 124 000 сум",
      monthly: "от 16 023 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 7,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "60.55 м²",
      areaLabel: "площадь",
      price: "от 714 490 000 сум",
      monthly: "от 14 885 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 8,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "64.37 м²",
      areaLabel: "площадь",
      price: "от 759 566 000 сум",
      monthly: "от 15 824 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    }
  ],
  "3-комнатные": [
    {
      id: 9,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "84.76 м²",
      areaLabel: "площадь",
      price: "от 1 000 168 000 сум",
      monthly: "от 20 837 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 10,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "89.24 м²",
      areaLabel: "площадь",
      price: "от 1 053 032 000 сум",
      monthly: "от 21 938 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 11,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "93.12 м²",
      areaLabel: "площадь",
      price: "от 1 098 816 000 сум",
      monthly: "от 22 892 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 12,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "91.55 м²",
      areaLabel: "площадь",
      price: "от 1 080 290 000 сум",
      monthly: "от 22 506 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    },
    {
      id: 13,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "95.67 м²",
      areaLabel: "площадь",
      price: "от 1 128 906 000 сум",
      monthly: "от 23 519 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png"
    }
  ]
};

const FloorPlansSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("1-комнатные");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const openFullScreenImage = (planId: number) => {
    setSelectedPlan(planId);
    setIsImageOpen(true);
  };

  const getSelectedPlanData = () => {
    if (selectedPlan === null) return null;
    
    for (const category in floorPlans) {
      const plan = floorPlans[category as keyof typeof floorPlans].find(
        p => p.id === selectedPlan
      );
      if (plan) return plan;
    }
    return null;
  };

  const selectedPlanData = getSelectedPlanData();

  return (
    <section id="floor-plans" className="py-10 md:py-16 bg-[#161616]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-8 md:mb-12 scroll-animate-section">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-brand-primary">ПЛАНИРОВКИ</h2>
          <h3 className="text-xl md:text-2xl font-medium mb-6 text-center text-white">TOWERUP</h3>
          
          <Tabs 
            defaultValue="1-комнатные" 
            className="w-full max-w-4xl" 
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="mb-6 md:mb-8 w-full flex justify-center gap-2 md:gap-4 overflow-x-auto pb-2">
              {Object.keys(floorPlans).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={`px-3 py-2 text-xs md:text-sm font-medium transition-all border border-brand-primary/20 hover:border-brand-primary/50 whitespace-nowrap ${
                    activeTab === category 
                      ? "bg-brand-primary text-white" 
                      : "bg-transparent text-white"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <AnimatePresence mode="wait">
              {Object.entries(floorPlans).map(([category, plans]) => (
                <TabsContent key={category} value={category} className="w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  >
                    {plans.map((plan) => (
                      <motion.div 
                        key={plan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: plan.id * 0.1 % 0.5 }}
                      >
                        <Card 
                          className="bg-[#1a1a1a] border border-slate-700/30 overflow-hidden rounded-xl hover:border-brand-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/5"
                        >
                          <CardContent className="p-0">
                            <div className="p-4 md:p-6">
                              <h3 className="text-brand-primary text-xl md:text-2xl font-bold">{plan.title}</h3>
                              <p className="text-white/80 mb-2">{plan.subtitle}</p>
                              
                              <div className="my-3 md:my-4">
                                <h4 className="text-brand-primary text-2xl md:text-3xl font-bold">{plan.area}</h4>
                                <p className="text-white/60">{plan.areaLabel}</p>
                              </div>
                            </div>
                            
                            <div className="relative aspect-square bg-black/30 border-y border-slate-700/30 group cursor-pointer overflow-hidden"
                                 onClick={() => openFullScreenImage(plan.id)}>
                              <img 
                                src={plan.image} 
                                alt={`${plan.title} ${plan.area}`} 
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                  <ZoomIn className="h-8 w-8 text-white" />
                                  <span className="text-white font-medium text-sm bg-brand-primary/80 px-3 py-1 rounded-full">Просмотреть</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 md:p-6">
                              <div className="mb-4">
                                <h4 className="text-brand-primary text-lg md:text-xl font-bold">{plan.price}</h4>
                                <p className="text-white/60 text-xs md:text-sm">{plan.monthly}</p>
                              </div>
                              
                              <Button 
                                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
                              >
                                Выбрать
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-0 bg-black/95 border-gray-800">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-2 right-2 z-20">
              <DialogClose className="rounded-full p-2 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
            
            {selectedPlanData && (
              <div className="flex flex-col h-full">
                <div className="p-4 md:p-6 flex-none">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    {selectedPlanData.title} {selectedPlanData.subtitle}
                  </h3>
                  <p className="text-white/60">
                    {selectedPlanData.area} • {selectedPlanData.price}
                  </p>
                </div>
                
                <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={selectedPlanData.image}
                    alt={`${selectedPlanData.title} ${selectedPlanData.area}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FloorPlansSection;
