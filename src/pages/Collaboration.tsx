
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchActiveTenders } from '@/utils/tender-helpers';
import { Tender } from '@/types/tenders';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import TenderCard from '@/components/collaboration/TenderCard';
import TenderDetailsDialog from '@/components/collaboration/TenderDetailsDialog';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Collaboration: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tenders = [], isLoading, error } = useQuery({
    queryKey: ['activeTenders'],
    queryFn: fetchActiveTenders,
  });

  const openTenderDetails = (tender: Tender) => {
    setSelectedTender(tender);
    setIsDialogOpen(true);
  };

  const closeTenderDetails = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedTender(null), 300); // Clear after animation completes
  };

  return (
    <>
      <Helmet>
        <title>{t('collaboration.pageTitle')} | Tower Up</title>
        <meta name="description" content={t('collaboration.pageDescription')} />
      </Helmet>

      <NavBar />

      <PageHeader
        title={t('collaboration.title')}
        subtitle={t('collaboration.subtitle')}
        imageSrc="/lovable-uploads/079c180b-f7a4-4e1a-8889-13f000a06289.jpg"
      />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-benzin font-bold mb-4">{t('collaboration.intro.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('collaboration.intro.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>{t('collaboration.benefits.quality.title')}</CardTitle>
              <CardDescription>
                {t('collaboration.benefits.quality.description')}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('collaboration.benefits.innovation.title')}</CardTitle>
              <CardDescription>
                {t('collaboration.benefits.innovation.description')}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('collaboration.benefits.reliability.title')}</CardTitle>
              <CardDescription>
                {t('collaboration.benefits.reliability.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-benzin font-bold mb-6 text-center">
            {t('collaboration.activeTenders')}
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {t('collaboration.errorLoading')}
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t('collaboration.noTenders')}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tenders.map((tender: Tender) => (
                <TenderCard
                  key={tender.id}
                  tender={tender}
                  onClick={() => openTenderDetails(tender)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-benzin font-bold mb-6 text-center">
            {t('collaboration.process.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle>{t('collaboration.process.step1.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('collaboration.process.step1.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle>{t('collaboration.process.step2.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('collaboration.process.step2.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle>{t('collaboration.process.step3.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('collaboration.process.step3.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle>{t('collaboration.process.step4.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('collaboration.process.step4.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-benzin font-bold mb-6 text-center">
            {t('collaboration.requirements.title')}
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('collaboration.requirements.subtitle')}</CardTitle>
              <CardDescription>
                {t('collaboration.requirements.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('collaboration.requirements.category')}</TableHead>
                    <TableHead>{t('collaboration.requirements.details')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t('collaboration.requirements.legal.title')}</TableCell>
                    <TableCell>{t('collaboration.requirements.legal.details')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('collaboration.requirements.financial.title')}</TableCell>
                    <TableCell>{t('collaboration.requirements.financial.details')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('collaboration.requirements.technical.title')}</TableCell>
                    <TableCell>{t('collaboration.requirements.technical.details')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('collaboration.requirements.experience.title')}</TableCell>
                    <TableCell>{t('collaboration.requirements.experience.details')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <TenderDetailsDialog
        tender={selectedTender}
        isOpen={isDialogOpen}
        onClose={closeTenderDetails}
      />

      <Footer />
    </>
  );
};

export default Collaboration;
