import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Check } from 'lucide-react';
import { Button } from '../ui/button';
const InvestmentSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null); // Ref for chart animation
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3
  });
  const isChartInView = useInView(chartRef, {
    once: true,
    amount: 0.5
  }); // Check if chart is in view

  return;
};
export default InvestmentSection;