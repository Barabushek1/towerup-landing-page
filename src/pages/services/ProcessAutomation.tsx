
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Cpu, LineChart, Shield, Clock, Zap, Server, CheckCircle, ArrowRight } from 'lucide-react';

const ProcessAutomation: React.FC = () => {
  return (
    <ServicePageLayout
      title="Автоматизация процессов"
      description="Комплексная автоматизация бизнес-процессов и инженерных систем от компании TOWERUP"
      breadcrumb="Услуги / Автоматизация процессов"
      headerImage="/lovable-uploads/f8d7af91-e393-448c-8412-4a5dc153d393.png"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Автоматизация процессов и систем</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                TOWERUP предлагает комплексные решения по автоматизации бизнес-процессов и инженерных систем для повышения эффективности работы вашего предприятия или объекта недвижимости.
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Мы разрабатываем и внедряем современные системы автоматизации, которые позволяют сократить расходы, повысить безопасность и обеспечить комфорт пользователей.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Обсудить проект
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Запросить демо
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img 
                  src="/lovable-uploads/fd3f8b69-467d-4443-87ca-f47787321726.png" 
                  alt="Автоматизация процессов TOWERUP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img 
                  src="/lovable-uploads/36291711-53aa-4206-9094-543e63bd67d5.png" 
                  alt="Умные системы TOWERUP"
                  className="w-full h-full object-cover"
                />
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши услуги автоматизации</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Комплексные решения для бизнеса и объектов недвижимости
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Cpu className="h-6 w-6 text-primary" />,
                  title: "Автоматизация зданий (BMS)",
                  description: "Внедрение систем управления зданием, включающих контроль освещения, отопления, вентиляции, кондиционирования и безопасности."
                },
                {
                  icon: <LineChart className="h-6 w-6 text-primary" />,
                  title: "Автоматизация бизнес-процессов",
                  description: "Разработка и внедрение систем автоматизации документооборота, управления персоналом, финансами и другими бизнес-процессами."
                },
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: "Системы безопасности",
                  description: "Установка и настройка комплексных систем безопасности: видеонаблюдение, контроль доступа, сигнализация, пожаротушение."
                },
                {
                  icon: <Zap className="h-6 w-6 text-primary" />,
                  title: "Энергоэффективные решения",
                  description: "Внедрение систем энергосбережения, учета и оптимизации потребления ресурсов для снижения эксплуатационных расходов."
                },
                {
                  icon: <Server className="h-6 w-6 text-primary" />,
                  title: "Разработка ПО",
                  description: "Создание индивидуальных программных решений для автоматизации специфических задач вашего бизнеса или объекта."
                },
                {
                  icon: <Clock className="h-6 w-6 text-primary" />,
                  title: "Техническое обслуживание",
                  description: "Регулярное обслуживание, обновление и поддержка внедренных систем автоматизации для их бесперебойной работы."
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Преимущества автоматизации</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Что получает ваш бизнес после внедрения наших решений
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="h-8 w-8 text-primary" />,
                  title: "Экономия времени",
                  description: "Автоматизация рутинных процессов позволяет сотрудникам сосредоточиться на более важных задачах, требующих человеческого участия."
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "Снижение затрат",
                  description: "Оптимизация потребления ресурсов и повышение эффективности бизнес-процессов ведет к значительной экономии средств."
                },
                {
                  icon: <LineChart className="h-8 w-8 text-primary" />,
                  title: "Повышение производительности",
                  description: "Автоматизированные системы работают быстрее, точнее и без перерывов, что повышает общую производительность."
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Улучшение безопасности",
                  description: "Современные системы автоматизации включают расширенные функции безопасности и контроля доступа."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Минимизация ошибок",
                  description: "Автоматизированные системы значительно снижают риск человеческих ошибок в критически важных процессах."
                },
                {
                  icon: <Cpu className="h-8 w-8 text-primary" />,
                  title: "Аналитика и отчетность",
                  description: "Получение актуальных данных и аналитических отчетов для принятия обоснованных бизнес-решений."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши проекты автоматизации</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Успешные внедрения систем автоматизации для наших клиентов
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: "Автоматизация бизнес-центра «Меркурий»",
                  description: "Полная автоматизация инженерных систем бизнес-центра класса А+: климат-контроль, освещение, безопасность. Результат: снижение эксплуатационных расходов на 30%.",
                  image: "/lovable-uploads/90e6db77-c1a6-40d8-936b-0e623cf5cb93.png"
                },
                {
                  title: "Система «Умный дом» для ЖК «Новый Узбекистан»",
                  description: "Внедрение комплексного решения «Умный дом» для всех квартир жилого комплекса, включая управление освещением, отоплением, безопасностью через мобильное приложение.",
                  image: "/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png"
                }
              ].map((caseStudy, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={caseStudy.image} 
                      alt={caseStudy.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{caseStudy.title}</h3>
                    <p className="text-gray-300 mb-4">{caseStudy.description}</p>
                    <Button variant="ghost" className="group text-primary hover:text-primary hover:bg-primary/10">
                      <span>Подробнее</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div 
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы автоматизировать ваш бизнес?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь с нами сегодня для консультации и разработки индивидуального решения по автоматизации.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  Заказать консультацию
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  Запросить демо
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default ProcessAutomation;
