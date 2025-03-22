
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase } from 'lucide-react';

const Vacancies: React.FC = () => {
  const vacancies = [
    {
      title: "Главный инженер проекта",
      location: "Москва",
      salary: "от 150 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Архитектор",
      location: "Санкт-Петербург",
      salary: "от 120 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Прораб",
      location: "Москва",
      salary: "от 100 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Инженер-конструктор",
      location: "Дистанционно",
      salary: "от 90 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Специалист по закупкам",
      location: "Москва",
      salary: "от 85 000 ₽",
      type: "Полная занятость"
    },
    {
      title: "Бухгалтер",
      location: "Москва",
      salary: "от 80 000 ₽",
      type: "Полная занятость"
    }
  ];

  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Вакансии</h1>
                <p className="text-lg text-muted-foreground mb-12 font-benzin">
                  Присоединяйтесь к нашей команде профессионалов
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vacancies.map((item, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg border border-primary/10 p-6 shadow-sm bg-background
                      transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">{item.title}</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">{item.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-medium text-brand-primary font-benzin">{item.salary}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-muted">
                        <a 
                          href="#contact" 
                          className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-benzin"
                        >
                          <span>Откликнуться</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-16 p-8 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-brand-dark mb-2 font-benzin">Не нашли подходящую вакансию?</h3>
                      <p className="text-muted-foreground mb-4 font-benzin">
                        Отправьте нам свое резюме, и мы свяжемся с вами, когда появится подходящая позиция.
                      </p>
                      <a 
                        href="#contact" 
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                      >
                        <span>Отправить резюме</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
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

export default Vacancies;
