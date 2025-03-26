
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { useAdminData } from '@/contexts/AdminDataContext';
import { ExternalLink } from 'lucide-react';

const Partners: React.FC = () => {
  const { partners } = useAdminData();
  
  // Используем данные админа, если доступны, иначе возвращаемся к заполнителям
  const displayPartners = partners.length > 0 ? partners : [
    { id: "default_1", name: "Партнёр 1", logo: "", url: "#" },
    { id: "default_2", name: "Партнёр 2", logo: "", url: "#" },
    { id: "default_3", name: "Партнёр 3", logo: "", url: "#" },
    { id: "default_4", name: "Партнёр 4", logo: "", url: "#" },
    { id: "default_5", name: "Партнёр 5", logo: "", url: "#" },
    { id: "default_6", name: "Партнёр 6", logo: "", url: "#" }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="НАШИ ПАРТНЁРЫ" 
          breadcrumb="ПАРТНЁРЫ"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin text-center">Надёжные партнёры</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {displayPartners.map((partner) => (
                  <a 
                    key={partner.id} 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-6 flex flex-col items-center hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="w-24 h-24 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-16 w-16 object-contain" />
                      ) : (
                        <span className="text-primary text-2xl">{partner.name.charAt(0)}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2 font-benzin group-hover:text-primary transition-colors">{partner.name}</h3>
                    <div className="flex items-center text-slate-300 group-hover:text-primary transition-colors">
                      <span className="text-sm mr-1">Перейти на сайт</span>
                      <ExternalLink size={14} />
                    </div>
                  </a>
                ))}
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

export default Partners;
