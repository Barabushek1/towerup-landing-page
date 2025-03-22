
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Наши партнёры</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border border-primary/10 rounded-lg p-6 flex flex-col items-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-full mb-4"></div>
                      <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">Партнёр {item}</h3>
                      <p className="text-center text-muted-foreground font-benzin">Описание партнера и сферы сотрудничества</p>
                    </div>
                  ))}
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

export default Partners;
