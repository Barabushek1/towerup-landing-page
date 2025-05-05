
import React, { useRef, useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import {
  Check,
  Home,
  Square,
  SquareDashed,
  Maximize,
  Minimize,
  BedDouble,
  Bath,
  ArrowLeft,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '../ui/dialog';

// Re-defining FloorPlan interface to include all necessary details
interface FloorPlan {
  id: string;
  title: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  description: string;
  features: string[];
  image: string;
  price: string;
}

const ApartmentsSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });

  const [activeTab, setActiveTab] = useState("type1");
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Floor plan data - Use specific data for New Uzbekistan project
  const floorPlans: FloorPlan[] = useMemo(() => [
    {
      id: "type1",
      title: t('newUzbekistan.apartments.studio.title') || "Type A - Studio",
      area: "52.2 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      description: t('newUzbekistan.apartments.studio.desc') || "Compact one-bedroom apartment with efficient layout. Features a comfortable bedroom, bathroom, kitchen-living area and balcony.",
      features: [
        "Kitchen-living area: 11.2 m²",
        "Bedroom: 12.1 m²",
        "Living room: 12.0 m²",
        "Bathroom: 3.6 m²",
        "Balcony: 1.75 m²"
      ],
      image: "/lovable-uploads/d46141cd-7934-475c-9744-aa34492b9748.png",
      price: "from $45,000"
    },
    {
      id: "type2",
      title: t('newUzbekistan.apartments.oneBedroom.title') || "Type B - One Bedroom",
      area: "52.2 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      description: t('newUzbekistan.apartments.oneBedroom.desc') || "Alternative one-bedroom layout with different room arrangement. Features a spacious bedroom, bathroom, kitchen-living area and balcony.",
      features: [
        "Kitchen-living area: 11.2 m²",
        "Bedroom: 12.1 m²",
        "Living room: 12.0 m²",
        "Bathroom: 3.6 m²",
        "Balcony: 1.75 m²"
      ],
      image: "/lovable-uploads/e30db59a-62ae-47c9-bee3-47f9c2a72b1b.png",
      price: "from $45,000"
    },
    {
      id: "type3",
      title: t('newUzbekistan.apartments.oneBedroom.title') + " Plus" || "Type C - One Bedroom Plus",
      area: "54.65 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 0,
      description: t('newUzbekistan.apartments.oneBedroom.desc') || "Spacious one-bedroom with larger living areas. Features a bedroom, bathroom, separate kitchen and dining area, and spacious living room.",
      features: [
        "Kitchen-dining area: 9.8 m²",
        "Bedroom: 10.8 m²",
        "Living room: 13.1 m²",
        "Bathroom: 3.6 m²",
        "Storage: 2.25 m²"
      ],
      image: "/lovable-uploads/2623cf3d-8e9e-492a-a374-0c70580ed70d.png",
      price: "from $52,000"
    },
    {
      id: "type4",
      title: t('newUzbekistan.apartments.oneBedroom.title') + " Alt" || "Type D - One Bedroom Alt",
      area: "54.65 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 0,
      description: t('newUzbekistan.apartments.oneBedroom.desc') || "Alternative larger one-bedroom layout. Features a bedroom, bathroom, kitchen-dining area and spacious living room with storage space.",
      features: [
        "Kitchen-dining area: 9.8 m²",
        "Bedroom: 10.8 m²",
        "Living room: 13.1 m²",
        "Bathroom: 3.6 m²",
        "Storage: 2.25 m²"
      ],
      image: "/lovable-uploads/07e5cbbb-96b3-4e0c-bc6c-43759ac026eb.png",
      price: "from $52,000"
    },
    {
      id: "type5",
      title: t('newUzbekistan.apartments.twoBedroom.title') || "Type E - Two Bedroom",
      area: "65.15 m²",
      bedrooms: 2,
      bathrooms: 1,
      balconies: 0,
      description: t('newUzbekistan.apartments.twoBedroom.desc') || "Modern two-bedroom apartment with excellent space utilization. Features two comfortable bedrooms, bathroom, kitchen-dining area and spacious living room.",
      features: [
        "Kitchen-dining area: 9.6 m²",
        "Master bedroom: 10.8 m²",
        "Second bedroom: 9.3 m²",
        "Living room: 14.2 m²",
        "Bathroom: 5.1 m²"
      ],
      image: "/lovable-uploads/25b51154-0f47-4d3e-b27d-0b5594a609b0.png",
      price: "from $65,000"
    },
    {
      id: "type6",
      title: t('newUzbekistan.apartments.twoBedroom.title') + " Deluxe" || "Type F - Two Bedroom Deluxe",
      area: "69.55 m²",
      bedrooms: 2,
      bathrooms: 2,
      balconies: 0,
      description: t('newUzbekistan.apartments.twoBedroom.desc') || "Premium two-bedroom apartment with two bathrooms. Features two bedrooms, two bathrooms, kitchen-dining area and elegant living room.",
      features: [
        "Kitchen-dining area: 8.6 m²",
        "Master bedroom: 12.1 m²",
        "Second bedroom: 10.8 m²",
        "Living room: 14.2 m²",
        "Master bathroom: 3.7 m²",
        "Second bathroom: 3.5 m²"
      ],
      image: "/lovable-uploads/fd3f8b69-467d-4443-87ca-f47787321726.png",
      price: "from $72,000"
    },
    {
      id: "building",
      title: t('newUzbekistan.apartments.floorLayout') || "Building Floor Layout",
      area: "Full Floor",
      bedrooms: 0,
      bathrooms: 0,
      balconies: 0,
      description: t('newUzbekistan.apartments.floorLayoutDesc') || "Complete floor layout showing the arrangement of all apartment units in a single floor of the New Uzbekistan residential complex.",
      features: [
        "Multiple apartment types",
        "Efficient building design",
        "Central elevator and stairs",
        "Optimal unit positioning",
        "Natural light maximization"
      ],
      image: "/lovable-uploads/fd0b85fc-caff-4e79-8acf-8c3e7ce81787.png",
      price: "Price varies by unit"
    },
  ], [t]);


  // Find the currently selected floor plan object based on activeTab
  const currentPlan = floorPlans.find(plan => plan.id === activeTab);

  // Function to render the small badges like "1 Bedroom", "2 Bathrooms"
  const renderFeatureBadge = (count: number | undefined, icon: React.ReactNode, label: string) => {
    if (count === undefined || count === 0) return null;

    return (
      <div className="flex items-center gap-1 bg-slate-800/60 px-3 py-1 rounded-full text-sm text-white/80 border border-slate-700/50">
        {icon}
        <span>{count} {label}</span>
      </div>
    );
  };

  // Handle opening the modal
  const handleOpenModal = (plan: FloorPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
      setSelectedPlan(null);
      setIsModalOpen(false);
  };

   // Logic for modal image navigation
   const navigateModalImage = (direction: 'prev' | 'next') => {
       if (!selectedPlan) return;

       const currentIndex = floorPlans.findIndex(plan => plan.id === selectedPlan.id);
       let newIndex;

       if (direction === 'prev') {
           newIndex = (currentIndex - 1 + floorPlans.length) % floorPlans.length;
       } else {
           newIndex = (currentIndex + 1) % floorPlans.length;
       }

       setSelectedPlan(floorPlans[newIndex]);
   };


  return (
    <section
      id="apartments"
      className="py-16 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <LayoutGrid className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.apartments.title')}
          </h2>

          <p className="text-xl text-primary">
            {t('newUzbekistan.apartments.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-6 p-1 bg-slate-800 rounded-lg border border-slate-700/50">
                {floorPlans.map((plan) => (
                  <TabsTrigger
                    key={plan.id}
                    value={plan.id}
                    className={cn(
                      "py-3 px-2 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors font-medium rounded-md",
                      "text-sm md:text-base",
                       "flex-grow"
                    )}
                  >
                    {plan.id === 'building' ? (t('newUzbekistan.apartments.floorLayout') || "Floor Layout") : (plan.title.includes(' - ') ? plan.title.split(' - ')[0] : plan.title)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
              {floorPlans.map((plan) => (
                 <TabsContent
                     key={plan.id}
                     value={plan.id}
                     forceMount={true}
                     className="focus-visible:outline-none focus-visible:ring-0 mt-0"
                 >
                   <div
                     className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-slate-800/40 rounded-xl p-6 md:p-8 border border-slate-700/30"
                   >
                     <div className="flex flex-col gap-4 lg:order-1">
                        <div>
                         <h3 className="text-2xl font-bold mb-1 text-white">{plan.title}</h3>
                         <div className="flex items-center gap-2 text-primary text-lg font-medium">
                           <Square className="h-5 w-5" />
                           <span>{plan.area}</span>
                         </div>
                       </div>


                       <div className="rounded-xl overflow-hidden relative shadow-lg group border border-slate-700/50 flex-grow flex items-center justify-center bg-slate-900 aspect-video md:aspect-[4/3] lg:aspect-square">
                         {plan.id !== 'building' && (
                            <div className="absolute top-3 right-3 bg-primary px-4 py-2 rounded-full text-sm font-medium text-white shadow-md z-10">
                              {plan.price}
                            </div>
                         )}


                         <div
                           className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                           onClick={() => handleOpenModal(plan)}
                         >
                           <Button
                             variant="secondary"
                             className="bg-white/10 hover:bg-white/20 text-white border border-white/30 shadow-lg"
                             onClick={(e) => { e.stopPropagation(); handleOpenModal(plan); }}
                           >
                             <Maximize className="mr-2 h-5 w-5" />
                             {t('newUzbekistan.apartments.viewDetails') || "View Details"}
                           </Button>
                         </div>

                         <img
                           src={plan.image}
                           alt={plan.title}
                           className="w-full h-full object-contain transition-transform duration-300"
                         />
                       </div>

                        {plan.id !== 'building' && (
                           <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                             {renderFeatureBadge(plan.bedrooms, <BedDouble className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bedrooms') || "Bedrooms")}
                             {renderFeatureBadge(plan.bathrooms, <Bath className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bathrooms') || "Bathrooms")}
                             {plan.balconies !== undefined && renderFeatureBadge(plan.balconies, <SquareDashed className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.balconies') || "Balconies")}
                           </div>
                         )}


                     </div>

                     <div className="space-y-6 lg:order-2">
                       <div>
                         <p className="text-slate-300 leading-relaxed">{plan.description}</p>
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-lg font-medium text-primary">
                           {t('newUzbekistan.apartments.featuresTitle') || "Room Specifications"}
                         </h4>
                         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                           {plan.features.map((feature, index) => (
                             <li key={index} className="flex items-center text-slate-300">
                               <div className="mr-2 p-1 rounded-full bg-primary/20 flex-shrink-0">
                                 <Check className="h-4 w-4 text-primary" />
                               </div>
                               <span>{feature}</span>
                             </li>
                           ))}
                         </ul>
                       </div>

                        {plan.id !== 'building' && (
                           <div className="mt-6 pt-4 border-t border-slate-700/50">
                             <h4 className="text-xl font-bold text-white mb-2">
                               {t('newUzbekistan.apartments.startingPrice') || "Starting Price:"}
                             </h4>
                             <p className="text-2xl font-bold text-primary">{plan.price}</p>
                           </div>
                         )}


                       <div className="pt-6">
                         <Button
                           className="bg-primary hover:bg-primary/90 text-white px-6 shadow-lg w-full py-3 text-lg"
                           onClick={() => {
                             document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                           }}
                         >
                           {t('newUzbekistan.apartments.inquire') || "Inquire About This Unit"}
                         </Button>
                       </div>
                     </div>
                   </div>
                 </TabsContent>
              ))}
              </motion.div>
            </Tabs>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center"
          >
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              {t('newUzbekistan.apartments.footer') || "Floor plans are subject to availability. Contact our sales team for current pricing and availability of specific units."}
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 text-lg py-3 px-6"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('newUzbekistan.contact.form.title')}
            </Button>
          </motion.div>
        </div>
      </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 bg-black/90 border-none flex items-center justify-center relative">
           <button
             className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
             onClick={handleCloseModal}
             aria-label={t('common.close') || "Close"}
           >
             <Minimize className="h-6 w-6" />
           </button>

           {floorPlans.length > 1 && (
             <>
               <button
                 className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
                 onClick={() => navigateModalImage('prev')}
                 aria-label={t('common.previous') || "Previous"}
               >
                 <ArrowLeft className="h-8 w-8" />
               </button>
               <button
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
                 onClick={() => navigateModalImage('next')}
                 aria-label={t('common.next') || "Next"}
               >
                 <ArrowRight className="h-8 w-8" />
               </button>
             </>
           )}


           {selectedPlan && (
             <motion.img
               key={selectedPlan.id}
               src={selectedPlan.image}
               alt={`Floor plan: ${selectedPlan.title}`}
               className="max-w-full max-h-full object-contain"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.3 }}
             />
           )}
            {selectedPlan && (
                 <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-md z-50 pointer-events-none">
                     <h4 className="text-xl font-bold">{selectedPlan.title}</h4>
                     <p className="text-sm text-slate-300">{selectedPlan.area} | {selectedPlan.price}</p>
                 </div>
             )}
         </DialogContent>
       </Dialog>
    </section>
  );
};

export default ApartmentsSection;
