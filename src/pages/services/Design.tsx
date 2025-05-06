
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Pencil, Ruler, Layers, PaintBucket, Building, Image, CheckCircle } from 'lucide-react';

const Design: React.FC = () => {
  return (
    <ServicePageLayout
      title="Проектирование"
      description="Инновационное проектирование от компании TOWERUP - от концепции до реализации"
      breadcrumb="Услуги / Проектирование"
      headerImage="/lovable-uploads/79c6d08b-3c0f-498e-a6dd-8e575692ec48.png"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Инновационное архитектурное проектирование</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                TOWERUP предлагает полный комплекс услуг по проектированию объектов различного назначения - от концепции до рабочей документации, от жилых домов до крупных коммерческих комплексов.
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Наша команда профессиональных архитекторов и инженеров создает уникальные проекты, сочетающие эстетику, функциональность и инновационные технологии.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Обсудить проект
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Наше портфолио
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img 
                  src="/lovable-uploads/2e9eec02-a548-4df3-8403-4176c16680c9.png" 
                  alt="Архитектурное проектирование TOWERUP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img 
                  src="/lovable-uploads/25b51154-0f47-4d3e-b27d-0b5594a609b0.png" 
                  alt="Дизайн интерьера TOWERUP"
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши услуги проектирования</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Комплексный подход к проектированию объектов любой сложности
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Pencil className="h-6 w-6 text-primary" />,
                  title: "Эскизное проектирование",
                  description: "Разработка концептуальных решений и предварительных эскизов будущего объекта с учетом всех пожеланий заказчика."
                },
                {
                  icon: <Building className="h-6 w-6 text-primary" />,
                  title: "Архитектурное проектирование",
                  description: "Создание архитектурных проектов любой сложности с учетом современных тенденций и технологий строительства."
                },
                {
                  icon: <Ruler className="h-6 w-6 text-primary" />,
                  title: "Конструктивное проектирование",
                  description: "Проектирование конструктивных элементов здания с учетом всех нагрузок и требований безопасности."
                },
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: "Инженерное проектирование",
                  description: "Проектирование всех инженерных систем здания: отопление, вентиляция, электроснабжение, водоснабжение и др."
                },
                {
                  icon: <PaintBucket className="h-6 w-6 text-primary" />,
                  title: "Дизайн интерьеров",
                  description: "Разработка дизайн-проектов интерьеров с учетом функциональности, эргономики и эстетических предпочтений."
                },
                {
                  icon: <Image className="h-6 w-6 text-primary" />,
                  title: "3D визуализация",
                  description: "Создание фотореалистичных изображений и видеороликов для наглядной демонстрации будущего объекта."
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

      {/* Process Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наш процесс работы</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                От идеи до реализации - как мы работаем над вашим проектом
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div variants={fadeIn} className="lg:col-span-5">
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-xl">
                  <img 
                    src="/lovable-uploads/8c18c4b0-5127-4ad6-93e2-a613af0ea09c.png" 
                    alt="Процесс проектирования TOWERUP"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="lg:col-span-7">
                <div className="space-y-8">
                  {[
                    {
                      number: "01",
                      title: "Консультация и брифинг",
                      description: "Мы начинаем с подробного обсуждения ваших потребностей, целей и бюджета проекта, чтобы точно понять ваше видение."
                    },
                    {
                      number: "02",
                      title: "Эскизное проектирование",
                      description: "Разрабатываем предварительные концепции и эскизы, которые обсуждаем с вами для выбора оптимального направления."
                    },
                    {
                      number: "03",
                      title: "Детальное проектирование",
                      description: "Создаем полную техническую документацию, включая архитектурные, конструктивные и инженерные решения."
                    },
                    {
                      number: "04",
                      title: "Согласование и экспертиза",
                      description: "Проводим согласование проекта во всех необходимых инстанциях и помогаем пройти экспертизу."
                    },
                    {
                      number: "05",
                      title: "Авторский надзор",
                      description: "Осуществляем контроль за реализацией проекта, чтобы гарантировать соответствие строительства проектной документации."
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Почему выбирают наше проектирование</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Преимущества работы с проектной командой TOWERUP
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Комплексный подход",
                  description: "Мы предоставляем полный цикл проектирования от концепции до рабочей документации."
                },
                {
                  title: "Опытная команда",
                  description: "Наши архитекторы и инженеры имеют многолетний опыт работы с проектами различной сложности."
                },
                {
                  title: "Инновационные решения",
                  description: "Мы используем передовые технологии и инновационные материалы в наших проектах."
                },
                {
                  title: "Соблюдение сроков",
                  description: "Мы ценим ваше время и всегда выполняем проекты в согласованные сроки."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                    </div>
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
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы воплотить вашу идею в жизнь?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь с нами сегодня для бесплатной консультации по вашему будущему проекту.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  Обсудить проект
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  Посмотреть портфолио
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Design;
