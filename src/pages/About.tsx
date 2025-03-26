
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const About: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="О КОМПАНИИ" 
          breadcrumb="О КОМПАНИИ"
          bgImage="/lovable-uploads/588f4168-3957-47f6-b722-795cfc295ea7.png"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin">О нашей компании</h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <p className="mb-6 font-benzin">
                  Наша компания специализируется на реализации сложных строительных проектов, 
                  от проектирования до воплощения в жизнь. Мы гордимся качеством нашей работы и 
                  стремимся к совершенству в каждом проекте.
                </p>
                <p className="mb-6 font-benzin">
                  С момента основания нашей компании, мы завершили более 100 крупных проектов, 
                  включая жилые комплексы, коммерческие здания и объекты инфраструктуры.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
