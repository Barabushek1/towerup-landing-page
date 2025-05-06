
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

      {/* Smart Building Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Умное здание</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Современные решения для управления объектами недвижимости
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeIn} className="order-2 lg:order-1">
                <div className="space-y-8">
                  {[
                    {
                      title: "Интегрированное управление",
                      description: "Единый центр управления всеми инженерными системами здания с возможностью мониторинга и контроля в режиме реального времени."
                    },
                    {
                      title: "Энергоэффективность",
                      description: "Интеллектуальное управление освещением, отоплением и кондиционированием для оптимизации энергопотребления и снижения затрат."
                    },
                    {
                      title: "Безопасность и контроль доступа",
                      description: "Комплексная система безопасности с видеонаблюдением, контролем доступа и автоматическим реагированием на нештатные ситуации."
                    },
                    {
                      title: "Комфорт пользователей",
                      description: "Автоматическая настройка параметров микроклимата, освещения и других систем для обеспечения максимального комфорта."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="order-1 lg:order-2">
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                  <img 
                    src="/lovable-uploads/d46141cd-7934-475c-9744-aa34492b9748.png" 
                    alt="Умное здание TOWERUP"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Как мы работаем</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Этапы внедрения систем автоматизации
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  number: "01",
                  title: "Аудит и анализ",
                  description: "Изучаем ваши потребности, анализируем текущие процессы и системы, определяем задачи автоматизации."
                },
                {
                  number: "02",
                  title: "Проектирование",
                  description: "Разрабатываем технические решения, выбираем оптимальное оборудование и программное обеспечение."
                },
                {
                  number: "03",
                  title: "Внедрение",
                  description: "Устанавливаем оборудование, настраиваем программное обеспечение, интегрируем системы между собой."
                },
                {
                  number: "04",
                  title: "Поддержка",
                  description: "Обучаем персонал, обеспечиваем техническую поддержку и сопровождение внедренных систем."
                }
              ].map((step, index, arr) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                    <div className="text-4xl font-bold text-primary/50 mb-4">{step.number}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Преимущества автоматизации</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Как наши решения помогают вашему бизнесу
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Снижение затрат",
                  description: "Оптимизация потребления ресурсов и сокращение эксплуатационных расходов до 30%."
                },
                {
                  title: "Повышение безопасности",
                  description: "Комплексные системы безопасности для защиты имущества, данных и людей."
                },
                {
                  title: "Улучшение комфорта",
                  description: "Создание оптимальных условий для работы и пребывания людей в здании."
                },
                {
                  title: "Экономия времени",
                  description: "Автоматизация рутинных задач и процессов, повышение производительности труда."
                },
                {
                  title: "Гибкость и масштабируемость",
                  description: "Возможность расширения и модификации систем с минимальными затратами."
                },
                {
                  title: "Аналитика и отчетность",
                  description: "Сбор и анализ данных для принятия обоснованных управленческих решений."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16">
            <motion.div 
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы автоматизировать ваши процессы?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь с нами сегодня для консультации и разработки индивидуального решения.
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
