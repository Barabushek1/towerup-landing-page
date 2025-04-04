
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, ChevronRight, Mail, Phone, MapPin, FileText, UserCircle2, Users, Target, Trophy } from 'lucide-react';
import ProjectGallery from '@/components/ProjectGallery';

const Management: React.FC = () => {
  // Management team data
  const executives = [
    { name: "Алексей Петров", position: "Генеральный директор", bio: "Более 20 лет опыта в строительной индустрии. Под его руководством компания успешно реализовала более 30 крупных проектов.", email: "petrov@towerup.ru", phone: "+7 (903) 123-45-67" },
    { name: "Елена Смирнова", position: "Финансовый директор", bio: "Магистр финансов МГУ. Отвечает за финансовую стратегию компании, управление рисками и оптимизацию затрат.", email: "smirnova@towerup.ru", phone: "+7 (903) 765-43-21" },
    { name: "Иван Соколов", position: "Технический директор", bio: "Инженер-строитель с международным опытом работы. Внедрил современные технологии строительства, повысившие эффективность на 35%.", email: "sokolov@towerup.ru", phone: "+7 (903) 222-33-44" },
    { name: "Мария Иванова", position: "Директор по персоналу", bio: "Кандидат психологических наук. Создала систему подбора и обучения персонала, позволившую снизить текучесть кадров на 40%.", email: "ivanova@towerup.ru", phone: "+7 (903) 555-66-77" }
  ];

  // Department heads
  const departmentHeads = [
    { name: "Дмитрий Волков", position: "Руководитель отдела продаж", bio: "10 лет опыта в сфере недвижимости. Под его руководством объем продаж вырос на 65% за последние 3 года." },
    { name: "Анна Кузнецова", position: "Руководитель юридического отдела", bio: "Более 15 лет юридической практики. Обеспечивает безупречную правовую поддержку всех проектов компании." },
    { name: "Сергей Новиков", position: "Главный архитектор", bio: "Обладатель международных наград в области архитектуры. Создал уникальный узнаваемый стиль проектов компании." },
    { name: "Ольга Морозова", position: "Руководитель отдела маркетинга", bio: "Разработала стратегию бренда, которая повысила узнаваемость компании на 78% за два года." }
  ];

  // Gallery images for the leadership team
  const managementImages = [
    { url: "/assets/Pushkin/20.jpg", alt: "Встреча руководства TOWER UP" },
    { url: "/assets/Pushkin/11.jpg", alt: "Совещание по проекту" },
    { url: "/assets/Pushkin/13.jpg", alt: "Разработка стратегии компании" },
    { url: "/assets/Pushkin/16.jpg", alt: "Обсуждение нового проекта" }
  ];

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="РУКОВОДСТВО" 
          breadcrumb="РУКОВОДСТВО"
          backgroundImage="/assets/Pushkin/5.jpg"
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white font-benzin text-center">О нашей команде</h2>
              <div className="bg-[#222] border border-gray-700/30 rounded-xl p-7 shadow-xl">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Команда TOWER UP – это высококвалифицированные профессионалы с многолетним опытом работы в строительной, финансовой и управленческой сферах. 
                  Мы объединены общей целью – создавать уникальные объекты, которые украшают городской ландшафт и делают жизнь людей комфортнее.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Наше руководство постоянно следит за инновациями в отрасли, внедряет современные технологии и подходы к управлению проектами. 
                  Благодаря этому, проекты TOWER UP всегда отличаются высоким качеством исполнения, соблюдением сроков и бюджета.
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-white mb-4">Наши принципы:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Trophy, text: "Неизменно высокое качество" },
                      { icon: Target, text: "Точность в деталях и сроках" },
                      { icon: Users, text: "Командная работа и синергия" },
                      { icon: UserCircle2, text: "Личная ответственность" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3 bg-[#2a2a2a] p-3 rounded-lg">
                        <div className="p-2 bg-brand-primary/20 rounded-lg">
                          <item.icon className="h-5 w-5 text-brand-primary" />
                        </div>
                        <span className="text-gray-200">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-16">
              <ProjectGallery images={managementImages} />
            </div>

            <div>
              <Tabs defaultValue="executives" className="max-w-5xl mx-auto">
                <div className="flex justify-center mb-8">
                  <TabsList className="bg-[#222] p-1">
                    <TabsTrigger value="executives" className="px-6 text-base">Руководство</TabsTrigger>
                    <TabsTrigger value="departments" className="px-6 text-base">Отделы</TabsTrigger>
                    <TabsTrigger value="careers" className="px-6 text-base">Карьера</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="executives" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {executives.map((person, index) => (
                      <Card key={index} className="border border-gray-700/30 bg-[#222] hover:bg-[#272727] transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/30 to-brand-primary/10 rounded-full flex items-center justify-center">
                              <UserCircle2 className="w-12 h-12 text-brand-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-medium text-white mb-1 font-benzin">{person.name}</h3>
                              <p className="text-brand-primary mb-3 font-benzin">{person.position}</p>
                              <p className="text-gray-400 text-sm mb-4">{person.bio}</p>
                              
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="contact" className="border-b-0">
                                  <AccordionTrigger className="py-2 text-sm text-white/80 hover:text-white no-underline">
                                    Контактная информация
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-2 pb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center text-sm text-gray-300">
                                        <Mail className="h-4 w-4 mr-2 text-brand-primary" />
                                        <span>{person.email}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-300">
                                        <Phone className="h-4 w-4 mr-2 text-brand-primary" />
                                        <span>{person.phone}</span>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="departments" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {departmentHeads.map((person, index) => (
                      <Card key={index} className="border border-gray-700/30 bg-[#222] hover:bg-[#272727] transition-all duration-300">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-1 font-benzin">{person.name}</h3>
                          <p className="text-brand-primary mb-3 font-benzin">{person.position}</p>
                          <p className="text-gray-400 text-sm">{person.bio}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="careers" className="mt-6">
                  <Card className="border border-gray-700/30 bg-[#222]">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-medium text-white mb-4">Присоединяйтесь к нашей команде</h3>
                      <p className="text-gray-300 mb-6">
                        TOWER UP предлагает уникальные возможности для профессионального и карьерного роста. Мы ценим инициативу, креативность и стремление к постоянному развитию.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#2a2a2a] p-5 rounded-lg">
                          <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-brand-primary" />
                            Преимущества работы у нас
                          </h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <ChevronRight className="h-4 w-4 mr-2 text-brand-primary" />
                              Конкурентная заработная плата
                            </li>
                            <li className="flex items-center">
                              <ChevronRight className="h-4 w-4 mr-2 text-brand-primary" />
                              Расширенный социальный пакет
                            </li>
                            <li className="flex items-center">
                              <ChevronRight className="h-4 w-4 mr-2 text-brand-primary" />
                              Программы обучения и развития
                            </li>
                            <li className="flex items-center">
                              <ChevronRight className="h-4 w-4 mr-2 text-brand-primary" />
                              Работа над интересными проектами
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-[#2a2a2a] p-5 rounded-lg">
                          <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-brand-primary" />
                            Как подать заявку
                          </h4>
                          <p className="text-gray-300 mb-3">
                            Отправьте ваше резюме на электронную почту hr@towerup.ru с указанием интересующей вас позиции в теме письма.
                          </p>
                          <p className="text-gray-300">
                            Также вы можете ознакомиться с текущими вакансиями в разделе "Вакансии" на нашем сайте.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                        <MapPin className="h-6 w-6 text-brand-primary mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Центральный офис</p>
                          <p className="text-gray-300">г. Ташкент, Узбекистан</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Management;
