import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { MapPin, Car, TreeDeciduous } from 'lucide-react';
const LocationSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });
  return;
};
export default LocationSection;