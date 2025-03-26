
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Design: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ПРОЕКТИРОВАНИЕ" 
          breadcrumb="ПРОЕКТИРОВАНИЕ"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin">Проектные услуги</h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <p className="mb-6 font-benzin">
                  Мы предлагаем профессиональные услуги по проектированию зданий и сооружений. 
                  Наша команда опытных архитекторов и инженеров разрабатывает проекты различной сложности, 
                  учитывая все требования заказчика и нормативные стандарты.
                </p>
                <p className="mb-6 font-benzin">
                  Мы используем современное программное обеспечение для создания детальных 3D-моделей 
                  и проектной документации, что позволяет визуализировать результат еще до начала строительства.
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

export default Design;
