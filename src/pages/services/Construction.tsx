
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Construction: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('construction.pageTitle')} | Tower Up</title>
        <meta name="description" content={t('construction.pageDescription')} />
      </Helmet>

      <NavBar />

      <PageHeader
        title={t('construction.title')}
        imageSrc="/lovable-uploads/079c180b-f7a4-4e1a-8889-13f000a06289.jpg"
      />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t('construction.description')}
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Construction;
