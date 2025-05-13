
import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const TermsOfService: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>{t('termsOfService.title')} | TOWER UP</title>
        <meta name="description" content={t('termsOfService.description')} />
      </Helmet>
      
      <NavBar />
      
      <PageHeader 
        title={t('termsOfService.title')}
        subtitle={t('termsOfService.subtitle')}
        backgroundImage="/lovable-uploads/499747fd-cec7-42ad-a52d-b4a550043793.png"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <h2>{t('termsOfService.introduction.title')}</h2>
          <p>{t('termsOfService.introduction.content')}</p>
          
          <h2>{t('termsOfService.usage.title')}</h2>
          <p>{t('termsOfService.usage.content')}</p>
          
          <h2>{t('termsOfService.limitations.title')}</h2>
          <p>{t('termsOfService.limitations.content')}</p>
          
          <h2>{t('termsOfService.privacy.title')}</h2>
          <p>{t('termsOfService.privacy.content')}</p>
          
          <h2>{t('termsOfService.changes.title')}</h2>
          <p>{t('termsOfService.changes.content')}</p>
          
          <h2>{t('termsOfService.contact.title')}</h2>
          <p>{t('termsOfService.contact.content')}</p>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default TermsOfService;
