
import React, { useRef, useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import ProjectGallery from '../ProjectGallery';

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

  // Floor plan data based on the provided images
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
        "Living room: 12.0 m²", 
        "Bathroom: 3.6 m²",
        "Balcony: 1.75 m²"
      ],
      image: "/lovable-uploads/d46141cd-7934-475c-9744-aa34492b9748.png",
      price: "from $45,000"
    },
    {
      id: "type2",
      title: t('newUzbekistan.apartments.type2.title') || "Type B - One Bedroom",
      area: "52.2 m²",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      description: t('newUzbekistan.apartments.type2.desc') || "Alternative one-bedroom layout with different room arrangement. Features a spacious bedroom, bathroom, kitchen-living area and balcony.",
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
      title: t('newUzbekistan.apartments.type3.title') || "Type C - One Bedroom Plus",
      area: "54.65 m²",
      bedrooms: 1,
      bathrooms: 1,
      description: t('newUzbekistan.apartments.type3.desc') || "Spacious one-bedroom with larger living areas. Features a bedroom, bathroom, separate kitchen and dining area, and spacious living room.",
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
      title: t('newUzbekistan.apartments.type4.title') || "Type D - One Bedroom Alt",
      area: "54.65 m²",
      bedrooms: 1,
      bathrooms: 1,
      description: t('newUzbekistan.apartments.type4.desc') || "Alternative larger one-bedroom layout. Features a bedroom, bathroom, kitchen-dining area and spacious living room with storage space.",
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
      title: t('newUzbekistan.apartments.type5.title') || "Type E - Two Bedroom",
      area: "65.15 m²",
      bedrooms: 2,
      bathrooms: 1,
      description: t('newUzbekistan.apartments.type5.desc') || "Modern two-bedroom apartment with excellent space utilization. Features two comfortable bedrooms, bathroom, kitchen-dining area and spacious living room.",
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
      title: t('newUzbekistan.apartments.type6.title') || "Type F - Two Bedroom Deluxe",
      area: "69.55 m²",
      bedrooms: 2,
      bathrooms: 2,
      description: t('newUzbekistan.apartments.type6.desc') || "Premium two-bedroom apartment with two bathrooms. Features two bedrooms, two bathrooms, kitchen-dining area and elegant living room.",
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
      title: t('newUzbekistan.apartments.building.title') || "Building Floor Layout",
      area: "Full Floor",
      bedrooms: 0,
      bathrooms: 0,
      description: t('newUzbekistan.apartments.building.desc') || "Complete floor layout showing the arrangement of all apartment units in a single floor of the New Uzbekistan residential complex.",
      features: [
        "Multiple apartment types",
        "Efficient building design", 
        "Central elevator and stairs",
        "Optimal unit positioning",
        "Natural light maximization"
      ],
      image: "/lovable-uploads/fd0b85fc-caff-4e79-8acf-8c3e7ce81787.png",
      price: "Price varies by unit"
    }
  ];

  const renderFeatureBadge = (count: number, icon: React.ReactNode, label: string) => {
    if (count === 0) return null;
    
    return (
      <div className="flex items-center gap-1 bg-slate-800/60 px-3 py-1 rounded-full text-sm">
        {icon}
        <span>{count} {label}</span>
      </div>
    );
  };

  const handleOpenModal = (plan: FloorPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Floor plan gallery images for the interactive gallery
  const galleryImages = floorPlans.map(plan => ({
    url: plan.image,
    alt: plan.title
  }));

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
            <Home className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.apartments.title') || "Choose Your Perfect Home"}
          </h2>

          <p className="text-xl text-primary">
            {t('newUzbekistan.apartments.subtitle') || "A variety of floor plans designed for modern living"}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Floor Plans Gallery Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectGallery images={galleryImages} />
          </motion.div>

          <div className="mt-12 md:mt-16">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-6 bg-slate-800 border border-slate-700/50">
                {floorPlans.slice(0, 6).map((plan) => (
                  <TabsTrigger
                    key={plan.id}
                    value={plan.id}
                    className="py-3 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors font-medium"
                  >
                    {plan.title.split(' - ')[0]}
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  value="building"
                  className="py-3 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors font-medium"
                >
                  {t('newUzbekistan.apartments.floorLayout') || "Floor Layout"}
                </TabsTrigger>
              </TabsList>

              {floorPlans.map((plan) => (
                <TabsContent
                  key={plan.id}
                  value={plan.id}
                  className="focus-visible:outline-none focus-visible:ring-0 mt-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-800/40 rounded-xl p-6 border border-slate-700/30"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-1 text-white">{plan.title}</h3>
                        <div className="flex items-center gap-2 text-primary text-lg font-medium">
                          <Square className="h-5 w-5" />
                          <span>{plan.area}</span>
                        </div>
                      </div>

                      <div className="rounded-xl overflow-hidden relative shadow-lg group mb-4">
                        <div className="absolute top-2 right-2 bg-primary px-4 py-2 rounded-full text-sm font-medium text-white shadow-md z-10">
                          {plan.price}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button 
                            onClick={() => handleOpenModal(plan)}
                            variant="default"
                            className="bg-primary/90 hover:bg-primary text-white shadow-lg"
                          >
                            <Maximize className="mr-2 h-5 w-5" />
                            {t('newUzbekistan.apartments.viewDetails') || "View Details"}
                          </Button>
                        </div>
                        
                        <img
                          src={plan.image}
                          alt={plan.title}
                          className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {renderFeatureBadge(plan.bedrooms, <BedDouble className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bedrooms') || "Bedrooms")}
                        {renderFeatureBadge(plan.bathrooms, <Bath className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.bathrooms') || "Bathrooms")}
                        {plan.balconies && renderFeatureBadge(plan.balconies, <SquareDashed className="h-4 w-4 text-white/80" />, t('newUzbekistan.apartments.balconies') || "Balconies")}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-slate-300 mb-6">{plan.description}</p>
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

                      <div className="pt-4">
                        <Button
                          className="bg-primary hover:bg-primary/90 text-white px-6 shadow-lg"
                          onClick={() => {
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {t('newUzbekistan.apartments.inquire') || "Inquire About This Unit"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
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
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('newUzbekistan.contact.form.title') || "Contact Sales Team"}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentsSection;
