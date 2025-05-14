import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, School, Car, Percent, Train } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
const ProjectAdvantagesBanner: React.FC = () => {
  const {
    t
  } = useLanguage();
  const advantages = [{
    icon: School,
    title: t("projectAdvantages.nearby.title"),
    description: t("projectAdvantages.nearby.description"),
    image: "https://i.imgur.com/Gpxq4xr.png"
  }, {
    icon: Car,
    title: t("projectAdvantages.parking.title"),
    description: t("projectAdvantages.parking.description"),
    image: "https://i.imgur.com/JHUJPdb.png"
  }, {
    icon: Percent,
    title: t("projectAdvantages.installment.title"),
    description: t("projectAdvantages.installment.description"),
    image: "https://i.imgur.com/V4hFuba.png"
  }, {
    icon: Train,
    title: t("projectAdvantages.metro.title"),
    description: t("projectAdvantages.metro.description"),
    image: "https://i.imgur.com/nTzlAUG.png"
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return;
};
export default ProjectAdvantagesBanner;