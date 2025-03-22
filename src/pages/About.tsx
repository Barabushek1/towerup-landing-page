
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">О компании</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-muted-foreground font-benzin">
                    Наша компания специализируется на реализации сложных строительных проектов, 
                    от проектирования до воплощения в жизнь. Мы гордимся качеством нашей работы и 
                    стремимся к совершенству в каждом проекте.
                  </p>
                  <p className="mb-6 text-muted-foreground font-benzin">
                    С момента основания нашей компании, мы завершили более 100 крупных проектов, 
                    включая жилые комплексы, коммерческие здания и объекты инфраструктуры.
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

export default About;
