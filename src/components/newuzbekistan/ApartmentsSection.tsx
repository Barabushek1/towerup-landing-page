
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
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
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
      className="py-20 bg-gray-50"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {t('newUzbekistan.apartments.title')}
          </h2>
          
          <p className="text-xl text-blue-600 mb-6">
            {t('newUzbekistan.apartments.subtitle')}
          </p>
          
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t('newUzbekistan.apartments.desc')}
          </p>
        </motion.div>
        
        <Tabs 
          defaultValue="studio" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {apartmentTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="text-sm md:text-base">
                {type.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {apartmentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="overflow-hidden rounded-lg">
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{type.title}</h3>
                    <p className="text-gray-700 mb-6">{type.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-semibold">{type.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-blue-600">{type.price}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {t('newUzbekistan.contact.form.submit')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ApartmentsSection;
