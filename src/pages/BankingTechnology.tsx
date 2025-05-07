
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import BankingTechnologyProject from '@/components/projects/BankingTechnologyProject';

const BankingTechnology: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#161616] text-gray-200">
      <NavBar />
      <PageHeader 
        title="БЦ &quot;BANKING TECHNOLOGY&quot;" 
        breadcrumb="ПРОЕКТЫ" 
        backgroundImage="/lovable-uploads/7ad10dee-9292-47bf-a026-8ebd56478382.png" 
      />
      <main>
        <BankingTechnologyProject />
      </main>
      <Footer />
    </div>
  );
};

export default BankingTechnology;
