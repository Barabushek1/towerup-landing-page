
import React, { useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

const ProgressSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState('construction');

  // Sample progress data - replace with actual data later
  const constructionProgress = 65;
  const salesProgress = 45;

  const milestones = [
    {
      date: "Январь 2023",
      title: "Начало строительства",
      description: "Старт строительных работ и подготовка площадки",
      completed: true
    },
    {
      date: "Июнь 2023",
      title: "Фундаментные работы",
      description: "Завершение фундаментных работ всего комплекса",
      completed: true
    },
    {
      date: "Декабрь 2023",
      title: "Возведение каркаса",
      description: "Возведение каркаса здания до 8 этажа",
      completed: true
    },
    {
      date: "Март 2024",
      title: "Инженерные системы",
      description: "Монтаж основных инженерных систем и коммуникаций",
      completed: false
    },
    {
      date: "Июнь 2024",
      title: "Фасадные работы",
      description: "Начало фасадных работ и установка окон",
      completed: false
    },
    {
      date: "Декабрь 2024",
      title: "Сдача объекта",
      description: "Завершение строительства и сдача объекта в эксплуатацию",
      completed: false
    }
  ];

  return (
    <section id="progress" className="py-16 md:py-24 bg-[#1a1a1a]" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Clock className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Ход строительства
          </h2>

          <p className="text-xl text-primary mb-6">
            Актуальный статус проекта
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 space-y-6"
          >
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Строительство</h3>
                <div className="text-2xl font-bold text-primary">{constructionProgress}%</div>
              </div>
              <Progress value={constructionProgress} className="h-3" />
              
              <div className="mt-8 space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full mt-1 flex items-center justify-center ${milestone.completed ? 'bg-primary/20 text-primary' : 'bg-slate-700/50 text-slate-400'}`}>
                      {milestone.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">{milestone.date}</span>
                        <h4 className={`font-bold ${milestone.completed ? 'text-primary' : 'text-white'}`}>
                          {milestone.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-1/2"
          >
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-6 h-full">
              <h3 className="text-xl font-bold text-white mb-4">Фотогалерея строительства</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-700/50 hover:opacity-90 transition">
                  <img 
                    src="/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png" 
                    alt="Ход строительства - январь 2024" 
                    className="w-full h-full object-cover"
                  />
                  <div className="p-2 bg-black/30 text-xs text-white">Январь 2024</div>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-700/50 hover:opacity-90 transition">
                  <img 
                    src="/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png" 
                    alt="Ход строительства - февраль 2024" 
                    className="w-full h-full object-cover"
                  />
                  <div className="p-2 bg-black/30 text-xs text-white">Февраль 2024</div>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-700/50 hover:opacity-90 transition">
                  <img 
                    src="/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png" 
                    alt="Ход строительства - март 2024" 
                    className="w-full h-full object-cover"
                  />
                  <div className="p-2 bg-black/30 text-xs text-white">Март 2024</div>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-700/50 hover:opacity-90 transition">
                  <img 
                    src="/lovable-uploads/a4a83568-45d7-4f2d-b87c-031fc305db6e.png" 
                    alt="Ход строительства - апрель 2024" 
                    className="w-full h-full object-cover"
                  />
                  <div className="p-2 bg-black/30 text-xs text-white">Апрель 2024</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="inline-flex items-center text-primary hover:text-primary/80">
                  Смотреть все фотографии <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;
