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
const FeaturedProject = ({ title, subtitle, description, imageUrl, index, slug }: FeaturedProjectProps) => {
  const {
    t
  } = useLanguage();
  return (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <p>{description}</p>
      <img src={imageUrl} alt={title} />
    </div>
  );
};
export default FeaturedProject;
