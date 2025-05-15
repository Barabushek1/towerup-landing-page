
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";

const ApartmentsSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const apartmentTypes = [
    {
      title: "1-комнатные квартиры",
      area: "35-42 м²",
      description: "Функциональные студии и компактные однокомнатные квартиры с продуманной планировкой",
      image: "https://i.imgur.com/PW2thZ0.png"
    },
    {
      title: "2-комнатные квартиры",
      area: "55-60 м²",
      description: "Просторные двухкомнатные квартиры для комфортной жизни семьи",
      image: "https://i.imgur.com/8c02C2C.png"
    },
    {
      title: "3-комнатные квартиры",
      area: "78-85 м²",
      description: "Вместительные трехкомнатные квартиры с отдельной кухней и просторными комнатами",
      image: "/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png"
    }
  ];

  return (
    <section ref={ref} id="apartments" className="py-16 md:py-24 bg-[#111111]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Наши квартиры</h2>
          <p className="text-xl text-primary mb-6">Комфортное пространство для жизни</p>
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-300">
              В жилом комплексе «Массив Узбекистан» представлены различные варианты квартир с продуманными планировками, которые отвечают потребностям современных жителей.
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apartmentTypes.map((apartment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-[#1a1a1a] rounded-xl border border-slate-700/30 overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={apartment.image} 
                  alt={apartment.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">{apartment.title}</h3>
                <p className="text-white font-medium mb-3">{apartment.area}</p>
                <p className="text-slate-300 mb-6">{apartment.description}</p>
                <Button className="w-full bg-primary hover:bg-primary/90">Подробнее</Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            Смотреть все планировки
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ApartmentsSection;
