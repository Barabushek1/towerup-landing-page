
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Projects: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Наши проекты</h1>
                <p className="text-lg text-muted-foreground mb-12 font-benzin">
                  Познакомьтесь с нашими ключевыми проектами в области строительства и проектирования.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border border-primary/10 rounded-lg overflow-hidden">
                      <div className="aspect-video w-full bg-primary/10"></div>
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">Проект {item}</h3>
                        <p className="text-muted-foreground mb-4 font-benzin">
                          Описание проекта и его особенностей, включая технические детали и сроки реализации.
                        </p>
                        <a href="#" className="text-primary font-medium hover:underline font-benzin">Подробнее</a>
                      </div>
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

export default Projects;
