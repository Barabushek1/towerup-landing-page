import React, { useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Check, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils'; // Added cn for conditional classes

interface ApartmentType {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  area: string;
  price: string;
}

const ApartmentsSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });

  const [activeTab, setActiveTab] = useState("studio");

  // NOTE: This data structure is static. For production, this should
  // potentially be part of the project data fetched from Supabase,
  // especially if prices change. The ProjectDetail template uses a
  // different approach with ApartmentCalculator and FloorPlansSection.
  // This reworked component *only* matches the style, not the data logic
  // of the ProjectDetail template.
  const apartmentTypes: ApartmentType[] = [
    {
      id: "studio",
      title: t('newUzbekistan.apartments.studio.title'),
      description: t('newUzbekistan.apartments.studio.desc'),
      features: ["25-35 m²", "Open layout", "Modern design", "Functional space"],
      image: "/lovable-uploads/01ec8090-c3b7-4770-b254-07c6f1ac1521.png",
      area: "25-35 m²",
      price: "from $35,000" // Static price example
    },
    {
      id: "one-bedroom",
      title: t('newUzbekistan.apartments.oneBedroom.title'),
      description: t('newUzbekistan.apartments.oneBedroom.desc'),
      features: ["40-55 m²", "Separate bedroom", "Living area", "Kitchen space"],
      image: "/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png",
      area: "40-55 m²",
      price: "from $50,000" // Static price example
    },
    {
      id: "two-bedroom",
      title: t('newUzbekistan.apartments.twoBedroom.title'),
      description: t('newUzbekistan.apartments.twoBedroom.desc'),
      features: ["60-75 m²", "Two bedrooms", "Living room", "Kitchen-dining area"],
      image: "/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png",
      area: "60-75 m²",
      price: "from $65,000" // Static price example
    },
    {
      id: "three-bedroom",
      title: t('newUzbekistan.apartments.threeBedroom.title'),
      description: t('newUzbekistan.apartments.threeBedroom.desc'),
      features: ["80-100 m²", "Three bedrooms", "Spacious living room", "Kitchen-dining area"],
      image: "/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png",
      area: "80-100 m²",
      price: "from $80,000" // Static price example
    },
    {
      id: "premium",
      title: t('newUzbekistan.apartments.premium.title'),
      description: t('newUzbekistan.apartments.premium.desc'),
      features: ["100+ m²", "Premium finishes", "Panoramic views", "Exclusive layouts"],
      image: "/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png",
      area: "100+ m²",
      price: "from $100,000" // Static price example
    }
  ];

  return (
    <section
      id="apartments"
      className="py-16 md:py-24 bg-[#1a1a1a] text-white" // Dark background
      ref={sectionRef}
    >
      <div className="container mx-auto px-6"> {/* Use px-6 for consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"> {/* Primary accent background */}
            <Home className="h-6 w-6 text-primary" /> {/* Primary accent color */}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.apartments.title')}
          </h2>

          <p className="text-xl text-primary"> {/* Primary accent color */}
            {t('newUzbekistan.apartments.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-6 bg-slate-800 border border-slate-700/50"> {/* Darker background, border */}
              {apartmentTypes.map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className={cn(
                    "py-3 text-white/70 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white transition-colors", // Primary active state
                    "font-medium" // Ensure consistent font weight
                  )}
                >
                  {type.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {apartmentTypes.map((apartment) => (
              <TabsContent
                key={apartment.id}
                value={apartment.id}
                className="focus-visible:outline-none focus-visible:ring-0 mt-0" // Remove default margin-top from shadcn TabsContent
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-800/40 rounded-xl p-6 border border-slate-700/30" // Dark card style
                >
                  <div className="rounded-xl overflow-hidden relative aspect-[4/3] shadow-lg"> {/* Added shadow */}
                    <img
                      src={apartment.image}
                      alt={apartment.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary px-4 py-2 rounded-full text-sm font-medium text-white shadow-md"> {/* Primary price tag */}
                      {apartment.price}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white"> {/* Dark overlay */}
                      <div className="text-lg font-medium">{apartment.area}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{apartment.title}</h3>
                      <p className="text-slate-300 mb-6">{apartment.description}</p> {/* Adjusted text color */}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-primary"> {/* Primary accent color */}
                        {t('newUzbekistan.apartments.features')}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        {apartment.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-slate-300"> {/* Adjusted text color */}
                            <div className="mr-2 p-1 rounded-full bg-primary/20 flex-shrink-0"> {/* Primary accent background */}
                              <Check className="h-4 w-4 text-primary" /> {/* Primary accent color */}
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white px-6 shadow-lg" // Primary button style
                        onClick={() => {
                          // Assuming 'contact' ID exists elsewhere, e.g., a ContactSection
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {t('newUzbekistan.apartments.cta')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center" // Adjusted spacing
          >
            <p className="text-slate-300 max-w-2xl mx-auto mb-6"> {/* Adjusted text color */}
              {t('newUzbekistan.apartments.footer')}
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10" // Primary outline button style
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('newUzbekistan.contact.form.title')}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentsSection;