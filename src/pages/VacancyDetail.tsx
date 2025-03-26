
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { MapPin, Coins, Clock, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminData, VacancyItem } from '@/contexts/AdminDataContext';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const VacancyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vacancies } = useAdminData();
  const [vacancy, setVacancy] = useState<VacancyItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vacancies && id) {
      const item = vacancies.find(item => item.id === id);
      if (item) {
        setVacancy(item);
      }
      setLoading(false);
    }
  }, [vacancies, id]);

  if (loading) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-6">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <main className="py-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-lg p-8 border border-primary/10">
            <h1 className="text-2xl font-bold mb-4 font-benzin text-white">Вакансия не найдена</h1>
            <p className="mb-6 font-benzin">Запрашиваемая вакансия не существует или была удалена.</p>
            <Link to="/vacancies">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Вернуться к вакансиям
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
      <NavBar />
      
      <PageHeader 
        title={vacancy.title}
        breadcrumb="ВАКАНСИИ"
      />
      
      <div className="bg-[#1a1a1a] py-8">
        <div className="container mx-auto px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">ГЛАВНАЯ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/vacancies">ВАКАНСИИ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-white">{vacancy.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <main>
        <div className="bg-[#1a1a1a] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Link to="/vacancies">
                <Button variant="outline" className="mb-6 flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Все вакансии
                </Button>
              </Link>
              
              <div className="bg-slate-800/40 rounded-lg p-8 border border-primary/10">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10 mr-6">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-benzin text-white">{vacancy.title}</h1>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">{vacancy.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">{vacancy.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <span className="font-benzin">{vacancy.type}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 font-benzin border-b border-slate-700 pb-2">Описание вакансии</h2>
                  <div className="prose prose-invert max-w-none font-benzin">
                    {vacancy.description ? (
                      vacancy.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-slate-400">Подробное описание не предоставлено</p>
                    )}
                  </div>
                </div>
                
                {vacancy.requirements && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 font-benzin border-b border-slate-700 pb-2">Требования</h2>
                    <ul className="list-disc list-inside font-benzin">
                      {vacancy.requirements.split('\n').map((item, index) => (
                        <li key={index} className="mb-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {vacancy.benefits && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 font-benzin border-b border-slate-700 pb-2">Мы предлагаем</h2>
                    <ul className="list-disc list-inside font-benzin">
                      {vacancy.benefits.split('\n').map((item, index) => (
                        <li key={index} className="mb-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-10">
                  <a 
                    href="#contact" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                  >
                    <span>Откликнуться на вакансию</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VacancyDetail;
