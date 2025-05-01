import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, School, Car, Percent, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
const ProjectAdvantagesBanner: React.FC = () => {
  const advantages = [{
    icon: School,
    title: "Всё нужное - рядом",
    description: "Школа, детский сад, зеленая зона и другие объекты инфраструктуры.",
    image: "https://i.imgur.com/Gpxq4xr.png"
  }, {
    icon: Car,
    title: "Удобный паркинг",
    description: "Многоуровневый надземный паркинг для жителей комплекса.",
    image: "https://i.imgur.com/JHUJPdb.png"
  }, {
    icon: Percent,
    title: "Рассрочка 0%",
    description: "Выгодные условия приобретения до 2-х лет.",
    image: "https://i.imgur.com/V4hFuba.png"
  }, {
    icon: Paintbrush,
    title: "Ремонт под ключ",
    description: "Квартиры с полностью готовым ремонтом от застройщика.",
    image: "https://i.imgur.com/nTzlAUG.png"
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section className="py-16 md:py-24 bg-[#161616]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Преимущества ЖК «Пушкин»</h2>
          <div className="w-20 h-1 bg-primary mb-6"></div>
          <p className="text-slate-300 max-w-3xl mb-8">
            Жилой комплекс «Пушкин» — это стандарт современного комфортного жилья, 
            сочетающий в себе удачное расположение, качественное строительство и заботу о будущих жителях.
          </p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.1
      }}>
          {advantages.map((advantage, index) => <motion.div key={`home-advantage-${index}`} className="group relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shadow-lg" variants={itemVariants}>
              <div className="h-48 relative overflow-hidden">
                <img src={advantage.image} alt={advantage.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <advantage.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gray-800">
                <h3 className="text-xl font-bold text-white mb-2">{advantage.title}</h3>
                <p className="text-slate-300 text-sm">{advantage.description}</p>
              </div>
            </motion.div>)}
        </motion.div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/projects/pushkin">
              Узнать подробнее <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default ProjectAdvantagesBanner;