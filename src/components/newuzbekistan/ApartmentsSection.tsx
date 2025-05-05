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
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });
  const [activeTab, setActiveTab] = useState("studio");
  const apartmentTypes: ApartmentType[] = [{
    id: "studio",
    title: t('newUzbekistan.apartments.studio.title'),
    description: t('newUzbekistan.apartments.studio.desc'),
    features: ["25-35 m²", "Open layout", "Modern design", "Functional space"],
    image: "/lovable-uploads/01ec8090-c3b7-4770-b254-07c6f1ac1521.png",
    area: "25-35 m²",
    price: "from $35,000"
  }, {
    id: "one-bedroom",
    title: t('newUzbekistan.apartments.oneBedroom.title'),
    description: t('newUzbekistan.apartments.oneBedroom.desc'),
    features: ["40-55 m²", "Separate bedroom", "Living area", "Kitchen space"],
    image: "/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png",
    area: "40-55 m²",
    price: "from $50,000"
  }, {
    id: "two-bedroom",
    title: t('newUzbekistan.apartments.twoBedroom.title'),
    description: t('newUzbekistan.apartments.twoBedroom.desc'),
    features: ["60-75 m²", "Two bedrooms", "Living room", "Kitchen-dining area"],
    image: "/lovable-uploads/d0a4480f-81e3-4447-9368-f1e03d1151e4.png",
    area: "60-75 m²",
    price: "from $65,000"
  }, {
    id: "three-bedroom",
    title: t('newUzbekistan.apartments.threeBedroom.title'),
    description: t('newUzbekistan.apartments.threeBedroom.desc'),
    features: ["80-100 m²", "Three bedrooms", "Spacious living room", "Kitchen-dining area"],
    image: "/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png",
    area: "80-100 m²",
    price: "from $80,000"
  }, {
    id: "premium",
    title: t('newUzbekistan.apartments.premium.title'),
    description: t('newUzbekistan.apartments.premium.desc'),
    features: ["100+ m²", "Premium finishes", "Panoramic views", "Exclusive layouts"],
    image: "/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png",
    area: "100+ m²",
    price: "from $100,000"
  }];
  return;
};
export default ApartmentsSection;