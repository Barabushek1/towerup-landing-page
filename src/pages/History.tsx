
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const History: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">История компании</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Наша компания была основана в 2003 году группой профессионалов строительной отрасли. 
                    За годы работы мы превратились в одну из ведущих строительных компаний региона.
                  </p>
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Мы прошли путь от малых проектов до крупных инфраструктурных объектов, 
                    постоянно совершенствуя наши технологии и подходы к строительству.
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

export default History;
