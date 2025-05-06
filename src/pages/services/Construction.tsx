import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Building, Clock, Shield, Wrench, CheckCircle, Users, FileText } from 'lucide-react';
const Construction: React.FC = () => {
  return <ServicePageLayout title="Строительство" description="Строительство объектов любой сложности от компании TOWERUP" breadcrumb="Услуги / Строительство" headerImage="/lovable-uploads/a752d5ec-95e4-49b3-acce-7ba19b32877c.png">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Строительство объектов любой сложности</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                TOWERUP предлагает полный комплекс услуг по строительству объектов различного назначения - от жилых комплексов до масштабных коммерческих сооружений.
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Мы соблюдаем высочайшие стандарты качества строительства, сроки реализации проектов и технические требования, используя современные технологии и материалы.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Обсудить проект
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Наши объекты
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img alt="Строительство TOWERUP" className="w-full h-full object-cover" src="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg" />
              </div>
              <div className="absolute -top-6 -right-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img src="/lovable-uploads/b7b815c6-44d8-4e9a-93e9-75538f6d0233.png" alt="Строительство зданий TOWERUP" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши строительные услуги</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Комплексное строительство от фундамента до финальной отделки
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
              icon: <Building className="h-6 w-6 text-primary" />,
              title: "Жилое строительство",
              description: "Строительство жилых домов, комплексов и элитных резиденций с применением современных технологий и материалов."
            }, {
              icon: <Building className="h-6 w-6 text-primary" />,
              title: "Коммерческое строительство",
              description: "Возведение бизнес-центров, торговых комплексов, гостиниц и других коммерческих объектов любой сложности."
            }, {
              icon: <Building className="h-6 w-6 text-primary" />,
              title: "Промышленное строительство",
              description: "Строительство производственных зданий, складских комплексов и других объектов промышленного назначения."
            }, {
              icon: <Wrench className="h-6 w-6 text-primary" />,
              title: "Инженерные сети",
              description: "Проектирование и прокладка всех инженерных коммуникаций: водоснабжение, отопление, вентиляция, электрика."
            }, {
              icon: <Clock className="h-6 w-6 text-primary" />,
              title: "Управление строительством",
              description: "Профессиональное управление строительным процессом, контроль качества и сроков выполнения работ."
            }, {
              icon: <FileText className="h-6 w-6 text-primary" />,
              title: "Строительный консалтинг",
              description: "Экспертная оценка строительных проектов, помощь в выборе технологий и материалов, оптимизация затрат."
            }].map((service, index) => <motion.div key={index} variants={fadeIn} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg" whileHover={{
              y: -5
            }}>
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </motion.div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Почему выбирают нас</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Преимущества строительства с TOWERUP
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
              icon: <Shield className="h-8 w-8 text-primary" />,
              title: "Гарантия качества",
              description: "Мы даем длительную гарантию на все выполненные работы и используем только сертифицированные материалы."
            }, {
              icon: <Clock className="h-8 w-8 text-primary" />,
              title: "Соблюдение сроков",
              description: "Строгое соблюдение графика работ и сдача объектов в установленные контрактом сроки."
            }, {
              icon: <Users className="h-8 w-8 text-primary" />,
              title: "Профессиональная команда",
              description: "Наши специалисты имеют многолетний опыт работы и постоянно совершенствуют свои навыки."
            }, {
              icon: <Building className="h-8 w-8 text-primary" />,
              title: "Комплексный подход",
              description: "Мы выполняем весь цикл работ от проектирования до ввода объекта в эксплуатацию."
            }, {
              icon: <Wrench className="h-8 w-8 text-primary" />,
              title: "Современные технологии",
              description: "Использование инновационных технологий и материалов для достижения наилучших результатов."
            }, {
              icon: <FileText className="h-8 w-8 text-primary" />,
              title: "Прозрачность",
              description: "Полная отчетность по всем этапам работ и расходованию средств, регулярные встречи с заказчиком."
            }].map((advantage, index) => <motion.div key={index} variants={fadeIn} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300" whileHover={{
              scale: 1.03
            }} transition={{
              type: 'spring',
              stiffness: 300
            }}>
                  <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{advantage.title}</h3>
                  <p className="text-gray-300">{advantage.description}</p>
                </motion.div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши проекты</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Посмотрите на наши реализованные объекты
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
              image: "/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png",
              title: "ТРЦ «Бочка»",
              category: "Коммерческое строительство"
            }, {
              image: "/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png",
              title: "Жилой комплекс «Новый Узбекистан»",
              category: "Жилое строительство"
            }, {
              image: "/lovable-uploads/38cd93b4-a24c-4390-bd04-0ed51282d778.png",
              title: "Пушкин Плаза",
              category: "Многофункциональный комплекс"
            }].map((project, index) => <motion.div key={index} variants={fadeIn} className="overflow-hidden rounded-xl border border-white/10 group">
                  <div className="aspect-[4/3] relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="text-primary text-sm font-medium block mb-2">{project.category}</span>
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    </div>
                  </div>
                </motion.div>)}
            </div>

            <motion.div variants={fadeIn} className="mt-12 text-center">
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                Все проекты
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы начать свой строительный проект?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Доверьте строительство профессионалам. Свяжитесь с нами сегодня для консультации и расчета стоимости.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  Заказать консультацию
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  Узнать стоимость
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>;
};
export default Construction;