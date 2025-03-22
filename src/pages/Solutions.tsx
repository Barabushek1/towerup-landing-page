
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Solutions: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Решения для объектов</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Мы разрабатываем и внедряем комплексные решения для различных типов объектов, 
                    учитывая их функциональное назначение, особенности эксплуатации и экологические требования.
                  </p>
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Наши решения включают в себя системы энергоэффективности, автоматизации зданий, 
                    безопасности и многое другое, что делает объекты более функциональными и комфортными для использования.
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

export default Solutions;
