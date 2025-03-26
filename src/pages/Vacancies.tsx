
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAdminData } from '@/contexts/AdminDataContext';

const Vacancies: React.FC = () => {
  const { vacancies } = useAdminData();
  
  // Use admin data if available, otherwise fallback to placeholder data
  const displayVacancies = vacancies.length > 0 ? vacancies : [
    {
      id: "default_1",
      title: "Главный инженер проекта",
      location: "Ташкент",
      salary: "от 15 000 000 сум",
      type: "Полная занятость",
      description: ""
    },
    {
      id: "default_2",
      title: "Архитектор",
      location: "Ташкент",
      salary: "от 12 000 000 сум",
      type: "Полная занятость",
      description: ""
    },
    {
      id: "default_3",
      title: "Прораб",
      location: "Ташкент",
      salary: "от 10 000 000 сум",
      type: "Полная занятость",
      description: ""
    },
    {
      id: "default_4",
      title: "Инженер-конструктор",
      location: "Дистанционно",
      salary: "от 9 000 000 сум",
      type: "Полная занятость",
      description: ""
    },
    {
      id: "default_5",
      title: "Специалист по закупкам",
      location: "Ташкент",
      salary: "от 8 500 000 сум",
      type: "Полная занятость",
      description: ""
    },
    {
      id: "default_6",
      title: "Бухгалтер",
      location: "Ташкент",
      salary: "от 8 000 000 сум",
      type: "Полная занятость",
      description: ""
    }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ВАКАНСИИ" 
          breadcrumb="ВАКАНСИИ"
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200 font-benzin text-center">Присоединяйтесь к нам</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayVacancies.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg border border-primary/10 p-6 shadow-sm bg-slate-800/40
                    transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin">{item.title}</h3>
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
              
              <div className="mt-16 p-8 rounded-lg bg-slate-800/40 border border-primary/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Briefcase className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin">Не нашли подходящую вакансию?</h3>
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
          
          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Vacancies;
