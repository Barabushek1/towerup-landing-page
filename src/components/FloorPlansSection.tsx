
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";

// Floor plan data
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
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
    },
    {
      id: 2,
      title: "1-комнатная",
      subtitle: "квартира",
      area: "39.51 м²",
      areaLabel: "площадь",
      price: "от 450 362 000 сум",
      monthly: "от 9 382 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
    },
    {
      id: 3,
      title: "1-комнатная",
      subtitle: "квартира",
      area: "35.43 м²",
      areaLabel: "площадь",
      price: "от 407 445 000 сум",
      monthly: "от 8 655 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
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
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
    },
    {
      id: 5,
      title: "2-комнатная",
      subtitle: "квартира",
      area: "62.45 м²",
      areaLabel: "площадь",
      price: "от 736 910 000 сум",
      monthly: "от 15 352 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
    }
  ],
  "3-комнатные": [
    {
      id: 6,
      title: "3-комнатная",
      subtitle: "квартира",
      area: "84.76 м²",
      areaLabel: "площадь",
      price: "от 1 000 168 000 сум",
      monthly: "от 20 837 000 сум / мес. в рассрочку",
      image: "/lovable-uploads/349569c7-e156-4d0f-9067-9010b4c0789a.png"
    }
  ]
};

const FloorPlansSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("1-комнатные");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <section id="floor-plans" className="py-16 bg-[#161616]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-12 scroll-animate-section">
          <h2 className="text-4xl font-bold mb-2 text-center text-brand-primary">ПЛАНИРОВКИ</h2>
          <h3 className="text-2xl font-medium mb-6 text-center text-white">TOWERUP</h3>
          
          <Tabs 
            defaultValue="1-комнатные" 
            className="w-full max-w-4xl" 
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="mb-8 w-full flex justify-center gap-4">
              {Object.keys(floorPlans).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={`px-4 py-2 text-sm font-medium transition-all border border-brand-primary/20 hover:border-brand-primary/50 ${
                    activeTab === category 
                      ? "bg-brand-primary text-white" 
                      : "bg-transparent text-white"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(floorPlans).map(([category, plans]) => (
              <TabsContent key={category} value={category} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className="bg-[#1a1a1a] border border-slate-700/30 overflow-hidden rounded-xl hover:border-brand-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/5"
                    >
                      <CardContent className="p-0">
                        <div className="p-6">
                          <h3 className="text-brand-primary text-2xl font-bold">{plan.title}</h3>
                          <p className="text-white/80 mb-2">{plan.subtitle}</p>
                          
                          <div className="my-4">
                            <h4 className="text-brand-primary text-3xl font-bold">{plan.area}</h4>
                            <p className="text-white/60">{plan.areaLabel}</p>
                          </div>
                        </div>
                        
                        <div className="relative aspect-video bg-black/30 border-y border-slate-700/30">
                          <img 
                            src={plan.image} 
                            alt={`${plan.title} ${plan.area}`} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-4">
                            <h4 className="text-brand-primary text-xl font-bold">{plan.price}</h4>
                            <p className="text-white/60 text-sm">{plan.monthly}</p>
                          </div>
                          
                          <Button 
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
                          >
                            Выбрать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FloorPlansSection;
