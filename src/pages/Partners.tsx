
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="НАШИ ПАРТНЁРЫ" 
          breadcrumb="ПАРТНЁРЫ"
        />
      
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin text-center">Надёжные партнёры</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border border-gray-700/20 bg-[#222] rounded-lg p-6 flex flex-col items-center hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-primary text-2xl">P{item}</span>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2 font-benzin">Партнёр {item}</h3>
                    <p className="text-center text-gray-400 font-benzin">Описание партнера и сферы сотрудничества</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
