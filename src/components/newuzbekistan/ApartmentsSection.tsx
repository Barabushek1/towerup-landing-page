
import React, { useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Check, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';

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
  
  const apartmentTypes: ApartmentType[] = [
    {
      id: "studio",
      title: t('newUzbekistan.apartments.studio.title'),
      description: t('newUzbekistan.apartments.studio.desc'),
      features: ["25-35 m²", "Open layout", "Modern design", "Functional space"],
      image: "/lovable-uploads/01ec8090-c3b7-4770-b254-07c6f1ac1521.png",
      area: "25-35 m²",
      price: "from $35,000"
    },
    {
      id: "one-bedroom",
      title: t('newUzbekistan.apartments.oneBedroom.title'),
      description: t('newUzbekistan.apartments.oneBedroom.desc'),
      features: ["40-55 m²", "Separate bedroom", "Living area", "Kitchen space"],
      image: "/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png",
      area: "40-55 m²",
      price: "from $50,000"
    },
    {
      id: "two-bedroom",
      title: t('newUzbekistan.apartments.twoBedroom.title'),
      description: t('newUzbekistan.apartments.twoBedroom.desc'),
      features: ["60-75 m²", "Two bedrooms", "Living room", "Kitchen-dining area"],
      image: "/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png",
      area: "60-75 m²",
      price: "from $65,000"
    },
    {
      id: "three-bedroom",
      title: t('newUzbekistan.apartments.threeBedroom.title'),
      description: t('newUzbekistan.apartments.threeBedroom.desc'),
      features: ["80-100 m²", "Three bedrooms", "Spacious living room", "Kitchen-dining area"],
      image: "/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png",
      area: "80-100 m²",
      price: "from $80,000"
    },
    {
      id: "premium",
      title: t('newUzbekistan.apartments.premium.title'),
      description: t('newUzbekistan.apartments.premium.desc'),
      features: ["100+ m²", "Premium finishes", "Panoramic views", "Exclusive layouts"],
      image: "/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png",
      area: "100+ m²",
      price: "from $100,000"
    }
  ];

  return (
    <section 
      id="apartments" 
      className="py-20 bg-[#1A1F2C] text-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#9b87f5]/20 rounded-full mb-6">
            <Home className="h-6 w-6 text-[#9b87f5]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.apartments.title')}
          </h2>
          
          <p className="text-xl text-[#9b87f5]">
            {t('newUzbekistan.apartments.subtitle')}
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-6 bg-[#2A2F3C]">
              {apartmentTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id}
                  className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white py-3"
                >
                  {type.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {apartmentTypes.map((apartment) => (
              <TabsContent 
                key={apartment.id} 
                value={apartment.id}
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="rounded-xl overflow-hidden relative aspect-[4/3]">
                    <img 
                      src={apartment.image} 
                      alt={apartment.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#9b87f5] px-4 py-2 rounded-full text-sm font-medium">
                      {apartment.price}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="text-lg font-medium">{apartment.area}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{apartment.title}</h3>
                      <p className="text-gray-300 mb-6">{apartment.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-[#9b87f5]">
                        {t('newUzbekistan.apartments.features')}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        {apartment.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="mr-2 p-1 rounded-full bg-[#9b87f5]/20">
                              <Check className="h-4 w-4 text-[#9b87f5]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-[#9b87f5] hover:bg-[#7E69AB] px-6"
                        onClick={() => {
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
            className="mt-16 text-center"
          >
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              {t('newUzbekistan.apartments.footer')}
            </p>
            <Button 
              variant="outline"
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
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
