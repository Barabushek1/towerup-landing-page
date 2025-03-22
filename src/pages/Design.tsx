
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Design: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Проектирование</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Мы предлагаем профессиональные услуги по проектированию зданий и сооружений. 
                    Наша команда опытных архитекторов и инженеров разрабатывает проекты различной сложности, 
                    учитывая все требования заказчика и нормативные стандарты.
                  </p>
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Мы используем современное программное обеспечение для создания детальных 3D-моделей 
                    и проектной документации, что позволяет визуализировать результат еще до начала строительства.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Design;
