
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Construction: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="СТРОИТЕЛЬСТВО ОБЪЕКТОВ" 
          breadcrumb="СТРОИТЕЛЬСТВО"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin">Строительные услуги</h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <p className="mb-6 font-benzin">
                  Наша компания предоставляет полный спектр услуг по строительству объектов различного назначения: 
                  жилых комплексов, коммерческих зданий, промышленных объектов и инфраструктуры.
                </p>
                <p className="mb-6 font-benzin">
                  Мы используем современные технологии строительства и качественные материалы, 
                  что позволяет нам создавать долговечные и функциональные объекты.
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

export default Construction;
