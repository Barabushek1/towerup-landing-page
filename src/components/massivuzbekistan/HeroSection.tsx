
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png"
          alt="Массив Узбекистан"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full items-center px-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              ЖК <span className="text-primary">«Массив Узбекистан»</span>
            </h1>
            
            <p className="mt-4 text-xl text-white/80 md:text-2xl">
              Современный жилой комплекс в центре Ташкента
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary/90">
                Выбрать квартиру
              </button>
              
              <button className="rounded-full border border-white/30 bg-black/30 px-8 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/10">
                Подробнее
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
