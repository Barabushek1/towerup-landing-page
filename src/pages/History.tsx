
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const History: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ИСТОРИЯ КОМПАНИИ" 
          breadcrumb="ИСТОРИЯ"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin">История развития</h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <p className="mb-6 font-benzin">
                  Наша компания была основана в 2003 году группой профессионалов строительной отрасли. 
                  За годы работы мы превратились в одну из ведущих строительных компаний региона.
                </p>
                <p className="mb-6 font-benzin">
                  Мы прошли путь от малых проектов до крупных инфраструктурных объектов, 
                  постоянно совершенствуя наши технологии и подходы к строительству.
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

export default History;
