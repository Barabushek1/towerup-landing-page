import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
interface FeaturedProjectProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  index: number;
  slug?: string;
}
const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  index,
  slug
}) => {
  const {
    t
  } = useLanguage();
  return;
};
export default FeaturedProject;