import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Wrench, PaintBucket, Hammer, CheckCircle, Clock, Ruler } from 'lucide-react';

const Renovation: React.FC = () => {
  return (
    <ServicePageLayout
      title="Ремонт"
      description="Профессиональные ремонтные работы любой сложности от компании TOWERUP"
      breadcrumb="Услуги / Ремонт"
      headerImage="/lovable-uploads/e30db59a-62ae-47c9-bee3-47f9c2a72b1b.png"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Профессиональные ремонтные работы</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                TOWERUP предлагает полный спектр ремонтных работ для жилых и коммерческих помещений - от косметического до капитального ремонта с индивидуальным подходом к каждому объекту.
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Мы гарантируем высокое качество выполнения работ, строгое соблюдение сроков и использование только сертифицированных материалов.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Заказать ремонт
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Рассчитать стоимость
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img 
                  src="/lovable-uploads/fd0b85fc-caff-4e79-8acf-8c3e7ce81787.png" 
                  alt="Ремонтные работы TOWERUP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                <img 
                  src="/lovable-uploads/0c133bd6-d1e4-46e2-bb5d-c0b5c77c5681.png" 
                  alt="Отделочные работы TOWERUP"
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Виды ремонтных работ</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Комплексный подход к ремонту любых помещений
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Wrench className="h-6 w-6 text-primary" />,
                  title: "Косметический ремонт",
                  description: "Обновление внешнего вида помещения без глобальных изменений: покраска, поклейка обоев, замена напольных покрытий."
                },
                {
                  icon: <Hammer className="h-6 w-6 text-primary" />,
                  title: "Капитальный ремонт",
                  description: "Полное обновление помещения с заменой инженерных коммуникаций, перепланировкой и заменой отделочных материалов."
                },
                {
                  icon: <PaintBucket className="h-6 w-6 text-primary" />,
                  title: "Отделочные работы",
                  description: "Высококачественная чистовая отделка помещений с использованием современных материалов и технологий."
                },
                {
                  icon: <Hammer className="h-6 w-6 text-primary" />,
                  title: "Ремонт коммерческих помещений",
                  description: "Профессиональный ремонт офисов, магазинов, ресторанов и других коммерческих объектов с учетом специфики бизнеса."
                },
                {
                  icon: <Ruler className="h-6 w-6 text-primary" />,
                  title: "Перепланировка помещений",
                  description: "Изменение планировки помещения с учетом всех строительных норм и правил, включая оформление необходимой документации."
                },
                {
                  icon: <Wrench className="h-6 w-6 text-primary" />,
                  title: "Инженерные работы",
                  description: "Прокладка и замена водопровода, канализации, отопления, вентиляции, электрики и других инженерных систем."
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Как мы работаем</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Прозрачный процесс работы от консультации до финальной приемки
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={fadeIn} className="order-2 md:order-1">
                <div className="space-y-8">
                  {[
                    {
                      number: "01",
                      title: "Консультация и оценка",
                      description: "Бесплатная консультация, выезд специалиста на объект, оценка объема работ и составление предварительной сметы."
                    },
                    {
                      number: "02",
                      title: "Проектирование и планирование",
                      description: "Разработка дизайн-проекта, составление подробной сметы и графика работ, согласование всех деталей с заказчиком."
                    },
                    {
                      number: "03",
                      title: "Выполнение работ",
                      description: "Поэтапное выполнение всех ремонтных работ согласно утвержденному графику и проекту с регулярной отчетностью."
                    },
                    {
                      number: "04",
                      title: "Контроль качества",
                      description: "Постоянный контроль качества выполнения работ на каждом этапе, внесение необходимых корректировок."
                    },
                    {
                      number: "05",
                      title: "Сдача объекта",
                      description: "Финальная уборка помещения, демонстрация выполненных работ заказчику, подписание акта приемки."
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-14 h-14 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
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

              <motion.div variants={fadeIn} className="order-1 md:order-2">
                <div className="sticky top-24 space-y-6">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-xl">
                    <img 
                      src="/lovable-uploads/32c3e8f6-2da4-474c-904f-fd321d91e87e.png" 
                      alt="Процесс ремонта TOWERUP"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">Гарантии качества</h3>
                    <ul className="space-y-3">
                      {[
                        "Официальный договор с четкими сроками и ответственностью",
                        "Гарантия до 3-х лет на все выполненные работы",
                        "Использование только сертифицированных материалов",
                        "Команда профессиональных мастеров с опытом от 10 лет"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-[#161616]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Отзывы наших клиентов</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Что говорят о нашей работе те, кто уже доверил нам свой ремонт
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Алексей Иванов",
                  position: "Владелец ресторана",
                  text: "Обратились в TOWERUP для ремонта нашего ресторана. Работу выполнили точно в срок и с отличным качеством. Особенно понравился профессиональный подход и внимание к деталям. Рекомендую!"
                },
                {
                  name: "Елена Сергеева",
                  position: "Владелец квартиры",
                  text: "Заказывала капитальный рем��нт квартиры. Очень довольна результатом! Команда работала слаженно, все мои пожелания были учтены. Ремонт закончили даже раньше запланированного срока."
                },
                {
                  name: "Дмитрий Новиков",
                  position: "Директор офиса",
                  text: "Необходимо было срочно сделать ремонт офиса без остановки работы компании. TOWERUP блестяще справились с задачей, минимизировав неудобства для сотрудников и выполнив все работы качественно."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex items-center space-x-1 text-primary">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 flex-grow">{testimonial.text}</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.position}</p>
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
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы обсудить ваш ремонт?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь с нами сегодня для бесплатной консультации и расчета стоимости ремонтных работ.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  Заказать ремонт
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  Рассчитать стоимость
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Renovation;
