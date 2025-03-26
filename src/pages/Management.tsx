
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Management: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="РУКОВОДСТВО" 
          breadcrumb="РУКОВОДСТВО"
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin text-center">Наша команда</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {[
                  { name: "Алексей Петров", position: "Генеральный директор" },
                  { name: "Елена Смирнова", position: "Финансовый директор" },
                  { name: "Иван Соколов", position: "Технический директор" },
                  { name: "Мария Иванова", position: "Директор по персоналу" }
                ].map((person, index) => (
                  <div key={index} className="border border-gray-700/20 bg-[#222] rounded-lg p-6 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-32 h-32 bg-primary/10 rounded-full mb-4 mx-auto"></div>
                    <h3 className="text-xl font-medium text-white mb-2 text-center font-benzin">{person.name}</h3>
                    <p className="text-center text-gray-400 font-benzin">{person.position}</p>
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

export default Management;
