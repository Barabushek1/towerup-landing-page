
import React from 'react';
import { motion } from 'framer-motion';
import ProjectGallery from '../ProjectGallery';
import { ArrowRight, Building, MapPin, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

const BankingTechnologyProject: React.FC = () => {
  const projectImages = [
    {
      url: "/lovable-uploads/7ad10dee-9292-47bf-a026-8ebd56478382.png",
      alt: "БЦ Banking Technology - вечерний вид на фасад"
    },
    {
      url: "/lovable-uploads/df3e5ae7-5e64-42ad-852c-436270958842.png",
      alt: "БЦ Banking Technology - вид на входную группу"
    },
    {
      url: "/lovable-uploads/9bc69f30-37ae-4cd1-954b-c7c6bb9d350a.png",
      alt: "БЦ Banking Technology - фасад со стороны главного входа"
    },
    {
      url: "/lovable-uploads/7bb17164-6341-4bd5-bd24-6a4d660bf298.png",
      alt: "БЦ Banking Technology - вечерний фасад со стороны парковки"
    },
    {
      url: "/lovable-uploads/32ed9232-76ab-4193-9167-491242d8a059.png",
      alt: "БЦ Banking Technology - общий вид комплекса"
    },
    {
      url: "/lovable-uploads/96953409-c5c5-4fbe-8373-4459cb21b064.png",
      alt: "БЦ Banking Technology - вид на высотное здание комплекса"
    },
    {
      url: "/lovable-uploads/7fc72432-7f60-43b3-bb9d-3d74b3f1e298.png",
      alt: "БЦ Banking Technology - вечерний вид на входную группу"
    },
    {
      url: "/lovable-uploads/02ee241b-8839-4af3-a468-497a0ffe6d60.png",
      alt: "БЦ Banking Technology - вид на бизнес-центр в дневное время"
    }
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Левая колонка с информацией о проекте */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-benzin">БЦ "Banking Technology"</h1>
            
            <p className="text-gray-300 mb-6">
              Инновационный бизнес-центр класса А+, сочетающий в себе современную архитектуру, экологичность и передовые технологии. 
              Уникальный проект представляет собой многофункциональный комплекс, состоящий из высотного офисного здания с панорамным 
              остеклением и стильного павильона с изогнутыми стеклянными фасадами.
            </p>
            
            <p className="text-gray-300 mb-6">
              Фасад здания выполнен из высококачественных материалов с использованием вертикального ритма элементов, 
              придающего зданию динамичный и элегантный вид. Уникальная архитектурная подсветка делает проект 
              заметным городским ориентиром и в вечернее время.
            </p>

            <p className="text-gray-300 mb-6">
              На крыше бизнес-центра расположена зеленая терраса с ландшафтным дизайном и зонами для отдыха сотрудников. 
              Территория вокруг комплекса благоустроена с применением современных ландшафтных решений, включая 
              автоматический полив и вечернюю подсветку растений.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/40 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Характеристики
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 pl-1">
                  <li>Класс: A+</li>
                  <li>Площадь: 24 000 м²</li>
                  <li>Этажность: 12 этажей</li>
                  <li>Парковка: 200 машиномест</li>
                  <li>Инженерные системы: "умное здание"</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/40 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Расположение и сроки
                </h3>
                <ul className="list-inside text-gray-300 space-y-1 pl-1">
                  <li><strong>Местоположение:</strong> Ташкент</li>
                  <li><strong>Адрес:</strong> Ул. Финансовая, 15</li>
                  <li><strong>Статус:</strong> Проектируется</li>
                  <li><strong>Начало строительства:</strong> Q1 2026</li>
                  <li><strong>Завершение:</strong> Q4 2027</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-800/40 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Особенности проекта
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 pl-1">
                <li>Уникальный архитектурный облик с изогнутыми стеклянными фасадами в павильонной части</li>
                <li>Энергоэффективное остекление с улучшенными теплосберегающими характеристиками</li>
                <li>Современная система управления зданием (BMS)</li>
                <li>Панорамный ресторан на верхнем этаже</li>
                <li>Конференц-центр с трансформируемыми пространствами</li>
                <li>Зеленая терраса на крыше с зонами для отдыха</li>
                <li>Интеллектуальная система контроля доступа</li>
                <li>Высокоскоростные лифты с биометрической идентификацией</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <a href="/contact">
                  Запросить информацию
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white">
                <a href="/projects">
                  Все проекты
                </a>
              </Button>
            </div>
          </div>
          
          {/* Правая колонка с основным изображением проекта */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <img 
                src="/lovable-uploads/7ad10dee-9292-47bf-a026-8ebd56478382.png"
                alt="БЦ Banking Technology" 
                className="w-full h-auto rounded-lg object-cover shadow-lg"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Проектируется</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm backdrop-blur-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Ташкент
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Галерея изображений */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-benzin">Галерея проекта</h2>
          <ProjectGallery images={projectImages} />
        </div>
        
        {/* Описание концепции */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-benzin">Концепция проекта</h2>
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
            <p className="text-gray-300 mb-4">
              Концепция бизнес-центра "Banking Technology" основана на создании интеллектуального рабочего пространства, 
              объединяющего инновационные технологии, комфорт и эстетику. Проект задуман как современный деловой комплекс, 
              способствующий продуктивной работе и развитию инноваций в сфере финансовых технологий.
            </p>
            <p className="text-gray-300 mb-4">
              Основная высотная башня комплекса символизирует стабильность и надежность финансового сектора, в то время как 
              стеклянный павильон с плавными формами отражает гибкость и открытость к инновациям. Архитектурное решение 
              подчеркивает баланс между традициями и новаторством в современном бизнесе.
            </p>
            <p className="text-gray-300">
              Комплекс спроектирован с учетом принципов устойчивого развития и энергоэффективности. В проекте предусмотрены 
              системы рекуперации тепла, солнечные панели на крыше здания и интеллектуальные системы управления ресурсами, 
              позволяющие минимизировать экологический след объекта.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BankingTechnologyProject;
