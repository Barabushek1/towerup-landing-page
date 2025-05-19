import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServicePageLayout, AnimatedSection, fadeIn } from '@/components/ServicePageLayout';
import { Microscope, FileCheck, ShieldCheck, LineChart, FileText, Clock } from 'lucide-react';
const Laboratory: React.FC = () => {
  return <ServicePageLayout title="Лаборатория" description="Профессиональные лабораторные исследования и испытания строительных материалов от TOWERUP" breadcrumb="Услуги / Лаборатория" headerImage="https://i.ibb.co/6RM3LrHX/Generated-Image-May-20-2025-12-55-AM.jpg">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#161616] to-[#1a1a1a] relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px] animate-pulse animation-delay-2000 opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Строительная лаборатория</h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                TOWERUP предлагает услуги аккредитованной строительной лаборатории, проводящей испытания и исследования строительных материалов, конструкций и грунтов.
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Наша лаборатория оснащена современным оборудованием и укомплектована высококвалифицированными специалистами, что обеспечивает точность и достоверность всех проводимых исследований.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                  Заказать исследование
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Каталог услуг
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                <img alt="Лаборатория TOWERUP" className="w-full h-full object-cover" src="/lovable-uploads/f43f7401-6fbf-4ea1-9b2d-82cf0642fd15.jpg" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши лабораторные услуги</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Комплексные исследования и испытания для строительной отрасли
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
              icon: <Microscope className="h-6 w-6 text-primary" />,
              title: "Испытания бетона",
              description: "Определение прочности, морозостойкости, водонепроницаемости и других характеристик бетона и бетонных конструкций."
            }, {
              icon: <Microscope className="h-6 w-6 text-primary" />,
              title: "Испытания металлоконструкций",
              description: "Проверка прочностных характеристик металлоконструкций, сварных соединений, оценка коррозионной стойкости."
            }, {
              icon: <Microscope className="h-6 w-6 text-primary" />,
              title: "Исследования грунтов",
              description: "Определение физико-механических свойств грунтов, анализ их состава, плотности и влажности."
            }, {
              icon: <Microscope className="h-6 w-6 text-primary" />,
              title: "Испытания отделочных материалов",
              description: "Проверка качества и соответствия стандартам различных отделочных материалов: краски, штукатурки, напольных покрытий."
            }, {
              icon: <FileCheck className="h-6 w-6 text-primary" />,
              title: "Экспертиза документации",
              description: "Анализ проектной и технической документации, оценка соответствия нормативным требованиям."
            }, {
              icon: <ShieldCheck className="h-6 w-6 text-primary" />,
              title: "Сертификация материалов",
              description: "Проведение испытаний для сертификации строительных материалов и изделий в соответствии с действующими стандартами."
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

      {/* Equipment Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1a1a] to-[#161616] relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[120px] -translate-x-1/2 opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наше оборудование</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Современная техника для точных исследований и испытаний
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div variants={fadeIn} className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                  <img alt="Лабораторное оборудование TOWERUP" className="w-full h-full object-cover" src="/lovable-uploads/69d54a3c-ac64-4fa6-9ff7-de5b28bc1310.jpg" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 backdrop-blur-sm rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-1">Современная лаборатория</h3>
                  <p className="text-sm text-gray-300">Оборудование ведущих мировых производителей</p>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Испытательные пресса</h3>
                    <p className="text-gray-300">
                      Высокоточные пресса для определения прочностных характеристик бетона, камня и других строительных материалов с возможностью испытания образцов различных размеров и форм.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Климатические камеры</h3>
                    <p className="text-gray-300">
                      Специализированные камеры для определения морозостойкости, влагостойкости и устойчивости материалов к другим климатическим воздействиям.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Аналитическое оборудование</h3>
                    <p className="text-gray-300">
                      Спектрометры, хроматографы и другое аналитическое оборудование для определения химического состава и свойств исследуемых материалов.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Неразрушающий контроль</h3>
                    <p className="text-gray-300">
                      Оборудование для проведения неразрушающего контроля: ультразвуковые дефектоскопы, склерометры, тепловизоры и другие приборы.
                    </p>
                  </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Почему выбирают нашу лабораторию</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Преимущества работы с лабораторией TOWERUP
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
              icon: <FileText className="h-8 w-8 text-primary" />,
              title: "Аккредитация",
              description: "Наша лаборатория имеет все необходимые сертификаты и аккредитации, что подтверждает качество и достоверность проводимых испытаний."
            }, {
              icon: <Microscope className="h-8 w-8 text-primary" />,
              title: "Современное оборудование",
              description: "Мы используем только современное и высокоточное оборудование ведущих мировых производителей."
            }, {
              icon: <Clock className="h-8 w-8 text-primary" />,
              title: "Оперативность",
              description: "Проводим испытания в кратчайшие сроки без потери качества, что особенно важно для строительных проектов."
            }, {
              icon: <ShieldCheck className="h-8 w-8 text-primary" />,
              title: "Полный комплекс испытаний",
              description: "Предоставляем широкий спектр лабораторных испытаний в одном месте, что экономит ваше время и ресурсы."
            }, {
              icon: <LineChart className="h-8 w-8 text-primary" />,
              title: "Точность результатов",
              description: "Гарантируем высокую точность и достоверность результатов испытаний благодаря квалификации персонала и калибровке оборудования."
            }, {
              icon: <FileCheck className="h-8 w-8 text-primary" />,
              title: "Официальные документы",
              description: "По результатам испытаний выдаем официальные документы, имеющие юридическую силу и принимаемые всеми контролирующими органами."
            }].map((benefit, index) => <motion.div key={index} variants={fadeIn} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300" whileHover={{
              scale: 1.03
            }} transition={{
              type: 'spring',
              stiffness: 300
            }}>
                  <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[120px] animate-pulse opacity-40 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы заказать исследование?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь с нами сегодня для консультации и расчета стоимости лабораторных испытаний.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-lg px-8">
                  Заказать исследование
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-lg px-8">
                  Скачать прайс-лист
                </Button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </ServicePageLayout>;
};
export default Laboratory;