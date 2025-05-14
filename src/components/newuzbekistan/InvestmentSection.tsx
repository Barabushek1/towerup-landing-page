import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Building, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
const InvestmentSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });
  const projectFeatures = [{
    title: t('newUzbekistan.projectFeatures.feature1.title'),
    description: t('newUzbekistan.projectFeatures.feature1.desc')
  }, {
    title: t('newUzbekistan.projectFeatures.feature2.title'),
    description: t('newUzbekistan.projectFeatures.feature2.desc')
  }, {
    title: t('newUzbekistan.projectFeatures.feature3.title'),
    description: t('newUzbekistan.projectFeatures.feature3.desc')
  }];
  return;
};
export default InvestmentSection;