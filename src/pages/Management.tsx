
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Management: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Руководство</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {[
                    { name: "Алексей Петров", position: "Генеральный директор" },
                    { name: "Елена Смирнова", position: "Финансовый директор" },
                    { name: "Иван Соколов", position: "Технический директор" },
                    { name: "Мария Иванова", position: "Директор по персоналу" }
                  ].map((person, index) => (
                    <div key={index} className="border border-primary/10 rounded-lg p-6">
                      <div className="w-32 h-32 bg-primary/10 rounded-full mb-4 mx-auto"></div>
                      <h3 className="text-xl font-medium text-brand-dark mb-2 text-center font-benzin">{person.name}</h3>
                      <p className="text-center text-muted-foreground font-benzin">{person.position}</p>
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

export default Management;
