
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Construction: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Строительство объектов</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Наша компания предоставляет полный спектр услуг по строительству объектов различного назначения: 
                    жилых комплексов, коммерческих зданий, промышленных объектов и инфраструктуры.
                  </p>
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Мы используем современные технологии строительства и качественные материалы, 
                    что позволяет нам создавать долговечные и функциональные объекты.
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

export default Construction;
