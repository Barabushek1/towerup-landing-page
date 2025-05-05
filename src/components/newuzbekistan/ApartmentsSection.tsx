import React, { useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import {
  Check,
  Home,
  Square,
  SquareDashed,
  Maximize, // For modal button
  Minimize, // For modal close button
  BedDouble,
  Bath,
  ArrowLeft, // For modal navigation
  ArrowRight // For modal navigation
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
// Assuming you have a Shadcn Dialog component setup
import { Dialog, DialogContent } from '../ui/dialog';

// Re-defining FloorPlan interface to include all necessary details
interface FloorPlan {
  id: string;
  title: string; // e.g., Type A - Studio
  area: string; // e.g., 52.2 m²
  bedrooms: number;
  bathrooms: number;
  balconies?: number; // Optional
  description: string;
  features: string[]; // List of specific room specs
  image: string; // Path to the floor plan image
  price: string; // Static price example (ideally dynamic)
}

const ApartmentsSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });

  const [activeTab, setActiveTab] = useState("type1"); // State for active tab
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null); // State for modal data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  // Floor plan data - Use specific data for New Uzbekistan project
  // NOTE: This data structure is static. For production, this should
  // be fetched from Supabase or passed as a prop from the ProjectDetail
  // page, filtered for the current project.
  const floorPlans: FloorPlan[] = [
    {
      id: "type1",
      title: t('newUzbekistan.apartments.type1.title') || "Type A - Studio",
      area: "52.2 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      description: t('newUzbekistan.apartments.type1.desc') || "Compact one-bedroom apartment with efficient layout. Features a comfortable bedroom, bathroom, kitchen-living area and balcony.",
      features: [
        "Kitchen-living area: 11.2 m²",
        "Bedroom: 12.1 m²",
        "Living room: 12.0 m²", // This might be incorrect for a 1-bedroom, check source
        "Bathroom: 3.6 m²",
        "Balcony: 1.75 m²"
      ],
      image: "/lovable-uploads/d46141cd-7934-475c-9744-aa34492b9748.png", // Use actual image paths
      price: "from $45,000" // Static price example
    },
    {
      id: "type2",
      title: t('newUzbekistan.apartments.type2.title') || "Type B - One Bedroom",
      area: "52.2 m²", // Same area but different layout? Check source
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      description: t('newUzbekistan.apartments.type2.desc') || "Alternative one-bedroom layout with different room arrangement. Features a spacious bedroom, bathroom, kitchen-living area and balcony.",
      features: [
        "Kitchen-living area: 11.2 m²",
        "Bedroom: 12.1 m²",
        "Living room: 12.0 m²", // This might be incorrect for a 1-bedroom, check source
        "Bathroom: 3.6 m²",
        "Balcony: 1.75 m²"
      ],
      image: "/lovable-uploads/e30db59a-62ae-47c9-bee3-47f9c2a72b1b.png", // Use actual image paths
      price: "from $45,000" // Static price example
    },
    {
      id: "type3",
      title: t('newUzbekistan.apartments.type3.title') || "Type C - One Bedroom Plus",
      area: "54.65 m²",
      bedrooms: 1,
      bathrooms: 1,
      // Balcony is missing in features for this type, maybe no balcony?
      description: t('newUzbekistan.apartments.type3.desc') || "Spacious one-bedroom with larger living areas. Features a bedroom, bathroom, separate kitchen and dining area, and spacious living room.",
      features: [
        "Kitchen-dining area: 9.8 m²",
        "Bedroom: 10.8 m²",
        "Living room: 13.1 m²",
        "Bathroom: 3.6 m²",
        "Storage: 2.25 m²" // Added Storage
      ],
      image: "/lovable-uploads/2623cf3d-8e9e-492a-a374-0c70580ed70d.png", // Use actual image paths
      price: "from $52,000" // Static price example
    },
    {
      id: "type4",
      title: t('newUzbekistan.apartments.type4.title') || "Type D - One Bedroom Alt",
      area: "54.65 m²", // Same area as type3, check source
      bedrooms: 1,
      bathrooms: 1,
       // Balcony is missing in features for this type, maybe no balcony?
      description: t('newUzbekistan.apartments.type4.desc') || "Alternative larger one-bedroom layout. Features a bedroom, bathroom, kitchen-dining area and spacious living room with storage space.",
      features: [
        "Kitchen-dining area: 9.8 m²",
        "Bedroom: 10.8 m²",
        "Living room: 13.1 m²",
        "Bathroom: 3.6 m²",
        "Storage: 2.25 m²" // Added Storage
      ],
      image: "/lovable-uploads/07e5cbbb-96b3-4e0c-bc6c-43759ac026eb.png", // Use actual image paths
      price: "from $52,000" // Static price example
    },
    {
      id: "type5",
      title: t('newUzbekistan.apartments.type5.title') || "Type E - Two Bedroom",
      area: "65.15 m²",
      bedrooms: 2,
      bathrooms: 1,
       // Balcony might be missing, check source
      description: t('newUzbekistan.apartments.type5.desc') || "Modern two-bedroom apartment with excellent space utilization. Features two comfortable bedrooms, bathroom, kitchen-dining area and spacious living room.",
      features: [
        "Kitchen-dining area: 9.6 m²",
        "Master bedroom: 10.8 m²",
        "Second bedroom: 9.3 m²",
        "Living room: 14.2 m²",
        "Bathroom: 5.1 m²"
      ],
      image: "/lovable-uploads/25b51154-0f47-4d3e-b27d-0b5594a609b0.png", // Use actual image paths
      price: "from $65,000" // Static price example
    },
    {
      id: "type6",
      title: t('newUzbekistan.apartments.type6.title') || "Type F - Two Bedroom Deluxe",
      area: "69.55 m²",
      bedrooms: 2,
      bathrooms: 2, // Two bathrooms
      // Balcony might be missing, check source
      description: t('newUzbekistan.apartments.type6.desc') || "Premium two-bedroom apartment with two bathrooms. Features two bedrooms, two bathrooms, kitchen-dining area and elegant living room.",
      features: [
        "Kitchen-dining area: 8.6 m²",
        "Master bedroom: 12.1 m²",
        "Second bedroom: 10.8 m²",
        "Living room: 14.2 m²",
        "Master bathroom: 3.7 m²",
        "Second bathroom: 3.5 m²"
      ],
      image: "/lovable-uploads/fd3f8b69-467d-4443-87ca-f47787321726.png", // Use actual image paths
      price: "from $72,000" // Static price example
    },
    {
      id: "building", // This is the full floor layout, not an apartment type
      title: t('newUzbekistan.apartments.building.title') || "Building Floor Layout",
      area: "Full Floor", // Indicate it's not a single unit area
      bedrooms: 0, // No bedrooms
      bathrooms: 0, // No bathrooms
      description: t('newUzbekistan.apartments.building.desc') || "Complete floor layout showing the arrangement of all apartment units in a single floor of the New Uzbekistan residential complex.",
      features: [ // Features of the layout/building floor
        "Multiple apartment types",
        "Efficient building design",
        "Central elevator and stairs",
        "Optimal unit positioning",
        "Natural light maximization"
      ],
      image: "/lovable-uploads/fd0b85fc-caff-4e79-8acf-8c3e7ce81787.png", // Use actual image path
      price: "Price varies by unit" // Indicate price complexity
    }
     // Note: You should also have data for 3-bedroom and Premium types if they exist based on your screenshot text
     // Add them here following the same structure
     /*
     {
        id: "three-bedroom",
        title: t('newUzbekistan.apartments.threeBedroom.title'),
        area: "...",
        bedrooms: 3,
        bathrooms: 1, // or 2
        description: t('newUzbekistan.apartments.threeBedroom.desc'),
        features: [...],
        image: "/path/to/3bedroom.png",
        price: "from $..."
     },
     {
        id: "premium",
        title: t('newUzbekistan.apartments.premium.title'),
        area: "...",
        bedrooms: ..., // > 3
        bathrooms: ..., // > 2
        description: t('newUzbekistan.apartments.premium.desc'),
        features: [...],
        image: "/path/to/premium.png",
        price: "from $..."
     },
     */
  ];

  // Function to render the small badges like "1 Bedroom", "2 Bathrooms"
  const renderFeatureBadge = (count: number | undefined, icon: React.ReactNode, label: string) => {
    if (count === undefined || count === 0) return null; // Don't render if count is 0 or undefined

    return (
      <div className="flex items-center gap-1 bg-slate-800/60 px-3 py-1 rounded-full text-sm text-white/80 border border-slate-700/50"> {/* Dark styles */}
        {icon}
        <span>{count} {label}</span>
      </div>
    );
  };

  // Find the currently selected floor plan object based on activeTab
  const currentPlan = floorPlans.find(plan => plan.id === activeTab);

  // Handle opening the modal
  const handleOpenModal = (plan: FloorPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
      setSelectedPlan(null); // Clear selected plan
      setIsModalOpen(false); // Close modal
  };

   // Logic for modal image navigation
   const navigateModalImage = (direction: 'prev' | 'next') => {
       if (!selectedPlan) return;

       const currentIndex = floorPlans.findIndex(plan => plan.id === selectedPlan.id);
       let newIndex;

       if (direction === 'prev') {
           newIndex = (currentIndex - 1 + floorPlans.length) % floorPlans.length;
       } else { // 'next'
           newIndex = (currentIndex + 1) % floorPlans.length;
       }

       setSelectedPlan(floorPlans[newIndex]); // Update selected plan for modal
   };


  return (
    <section
      id="apartments" // Keep ID for navigation
      className="py-16 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white" // Dark background gradient
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Consistent container padding */}
        {/* Section Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Consistent spacing
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Home className="h-6 w-6 text-primary" /> {/* Primary icon color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.apartments.title') || "Choose Your Perfect Home"} {/* Use translation */}
          </h2>

          <p className="text-xl text-primary"> {/* Primary subtitle color */}
            {t('newUzbekistan.apartments.subtitle') || "A variety of floor plans designed for modern living"} {/* Use translation */}
          </p>
        </motion.div>

        {/* Tabs for Selecting Floor Plan Type */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div> {/* Container for tabs */}
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tabs List */}
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-6 bg-slate-800 border border-slate-700/50"> {/* Responsive grid, dark styles */}
                {/* Render triggers for each floor plan type */}
                {floorPlans.map((plan) => (
                  <TabsTrigger
                    key={plan.id}
                    value={plan.id}
                    className={cn(
                      "py-3 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors font-medium", // Dark theme tab styles
                      "text-sm md:text-base" // Adjust text size responsively
                    )}
                  >
                    {/* Use translation for floor plan titles, Fallback to title if translation missing */}
                    {plan.title.includes(' - ') ? plan.title.split(' - ')[0] : plan.title} {/* Split title for tab label if needed */}
                  </TabsTrigger>
                ))}
                 {/* Keep the "Building Floor Layout" tab if needed */}
                  {/* <TabsTrigger
                    value="building"
                    className="py-3 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors font-medium text-sm md:text-base"
                  >
                    {t('newUzbekistan.apartments.floorLayout') || "Floor Layout"}
                  </TabsTrigger> */}
              </TabsList>

              {/* Tabs Content - Display details for the active tab */}
              {/* Render content for each floor plan. Use `currentPlan` to avoid re-rendering all content */}
              {currentPlan && ( // Only render content if a plan is selected
                 <TabsContent
                     key={currentPlan.id} // Key the content to the *current* plan for potential animation
                     value={currentTab} // Value must match the active tab state
                     forceMount={true} // Ensure content stays in DOM for animations
                     className="focus-visible:outline-none focus-visible:ring-0 mt-0" // Remove default margin
                 >
                   {/* Content layout: Image on left, Details on right (or reversed) */}
                   <motion.div
                     key={currentPlan.id} // Animate content when tab changes
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-800/40 rounded-xl p-6 border border-slate-700/30" // Dark card style
                   >
                     {/* Image Column - Reorganized for better visual flow */}
                     <div className="flex flex-col h-full lg:order-1"> {/* Order 1 on large screens */}
                       {/* Plan Title, Area, and Badges */}
                       <div className="mb-4">
                         <h3 className="text-2xl font-bold mb-1 text-white">{currentPlan.title}</h3> {/* Plan title */}
                         <div className="flex items-center gap-2 text-primary text-lg font-medium"> {/* Area */}
                           <Square className="h-5 w-5" />
                           <span>{currentPlan.area}</span>
                         </div>
                       </div>

                       {/* Main Floor Plan Image Container */}
                       <div className="rounded-xl overflow-hidden relative shadow-lg group border border-slate-700/50 flex-grow flex items-center justify-center bg-slate-900"> {/* Dark styles, added flex-grow */}
                         {/* Price Badge */}
                         <div className="absolute top-2 right-2 bg-primary px-4 py-2 rounded-full text-sm font-medium text-white shadow-md z-10">
                           {currentPlan.price}
                         </div>

                         {/* Image Overlay for Magnify */}
                         <div
                           className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                           onClick={() => handleOpenModal(currentPlan)} // Open modal on click
                         >
                           <Button
                             variant="default" // Use default button style
                             className="bg-primary/90 hover:bg-primary text-white shadow-lg"
                             onClick={(e) => { e.stopPropagation(); handleOpenModal(currentPlan); }} // Prevent click from propagating if button is clicked directly
                           >
                             <Maximize className="mr-2 h-5 w-5" />
                             {t('newUzbekistan.apartments.viewDetails') || "View Details"} {/* Use translation */}
                           </Button>
                         </div>

                         {/* The Floor Plan Image */}
                         <img
                           src={currentPlan.image}
                           alt={currentPlan.title} // Use plan title as alt text
                           className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" // Image styling
                         />
                       </div>

                       {/* Feature Badges (Bedrooms, Bathrooms, Balconies) */}
                       <div className="flex flex-wrap gap-2 mb-4 mt-4"> {/* Added margin top */}
                         {renderFeatureBadge(currentPlan.bedrooms, <BedDouble className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bedrooms') || "Bedrooms")}
                         {renderFeatureBadge(currentPlan.bathrooms, <Bath className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bathrooms') || "Bathrooms")}
                         {currentPlan.balconies !== undefined && renderFeatureBadge(currentPlan.balconies, <SquareDashed className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.balconies') || "Balconies")}
                       </div>
                     </div>

                     {/* Details Column - Text, Features List, CTA */}
                     <div className="space-y-6 lg:order-2"> {/* Order 2 on large screens */}
                       <div>
                         <p className="text-slate-300 mb-6">{currentPlan.description}</p> {/* Description */}
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-lg font-medium text-primary">
                           {t('newUzbekistan.apartments.featuresTitle') || "Room Specifications"} {/* Use translation */}
                         </h4>
                         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                           {currentPlan.features.map((feature, index) => (
                             <li key={index} className="flex items-center text-slate-300">
                               <div className="mr-2 p-1 rounded-full bg-primary/20 flex-shrink-0">
                                 <Check className="h-4 w-4 text-primary" />
                               </div>
                               <span>{feature}</span>
                             </li>
                           ))}
                         </ul>
                       </div>

                       {/* CTA Button */}
                       <div className="pt-4">
                         <Button
                           className="bg-primary hover:bg-primary/90 text-white px-6 shadow-lg w-full" // Made button full width
                           onClick={() => {
                             // Assuming 'contact' ID exists elsewhere, e.g., a ContactSection
                             document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                           }}
                         >
                           {t('newUzbekistan.apartments.inquire') || "Inquire About This Unit"} {/* Use translation */}
                         </Button>
                       </div>
                     </div>
                   </motion.div>
                 </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Footer Text and Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center"
          >
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              {t('newUzbekistan.apartments.footer') || "Floor plans are subject to availability. Contact our sales team for current pricing and availability of specific units."} {/* Use translation */}
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('newUzbekistan.contact.form.title') || "Contact Sales Team"} {/* Use translation */}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Modal for Fullscreen Floor Plan View */}
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         {/* DialogContent styled for dark/transparent background */}
         <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 bg-black/90 border-none flex items-center justify-center relative">
           {/* Close button */}
           <button
             className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
             onClick={handleCloseModal}
             aria-label="Закрыть" // Added aria label
           >
             <Minimize className="h-6 w-6" /> {/* Using Minimize icon for close */}
           </button>

           {/* Navigation buttons (Optional, if you want to browse plans in modal) */}
           {floorPlans.length > 1 && (
             <>
               <button
                 className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
                 onClick={() => navigateModalImage('prev')}
                 aria-label="Предыдущий план" // Added aria label
               >
                 <ArrowLeft className="h-8 w-8" />
               </button>
               <button
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black/50 rounded-full z-50 hover:bg-black/70 transition"
                 onClick={() => navigateModalImage('next')}
                 aria-label="Следующий план" // Added aria label
               >
                 <ArrowRight className="h-8 w-8" />
               </button>
             </>
           )}


           {selectedPlan && (
             <motion.img
               key={selectedPlan.id} // Animate image change in modal
               src={selectedPlan.image}
               alt={`Floor plan: ${selectedPlan.title}`} // Alt text
               className="max-w-full max-h-full object-contain" // Styling to fit within modal
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.3 }}
             />
           )}
            {/* Optionally display some details inside the modal */}
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