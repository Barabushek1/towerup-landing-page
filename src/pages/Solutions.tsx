
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Solutions: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="НАШИ РЕШЕНИЯ" 
          breadcrumb="РЕШЕНИЯ"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin">Инновационные решения</h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <p className="mb-6 font-benzin">
                  Мы разрабатываем и внедряем комплексные решения для различных типов объектов, 
                  учитывая их функциональное назначение, особенности эксплуатации и экологические требования.
                </p>
                <p className="mb-6 font-benzin">
                  Наши решения включают в себя системы энергоэффективности, автоматизации зданий, 
                  безопасности и многое другое, что делает объекты более функциональными и комфортными для использования.
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

export default Solutions;
