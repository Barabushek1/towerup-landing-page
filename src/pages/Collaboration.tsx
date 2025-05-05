
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Users, FileText, CheckCircle, MapPin, Clock, Building, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Collaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tenders');
  const { toast } = useToast();

  // Hardcoded data for examples
  const tenders = [
    {
      id: '1',
      title: 'Архитектурное проектирование жилого комплекса',
      category: 'Архитектура',
      status: 'Активный',
      deadline: '2025-08-15',
      description: 'Поиск архитектурной компании для проектирования жилого комплекса из 4 зданий в Ташкенте.',
      requirements: 'Опыт проектирования аналогичных объектов не менее 5 лет.',
      budget: '$250,000 - $350,000',
      location: 'Ташкент, Мирзо-Улугбекский район'
    },
    {
      id: '2',
      title: 'Строительство офисного центра',
      category: 'Строительство',
      status: 'Активный',
      deadline: '2025-09-10',
      description: 'Тендер на генерального подрядчика для строительства бизнес-центра класса А.',
      requirements: 'Наличие необходимых лицензий и технического оснащения.',
      budget: '$5M - $7M',
      location: 'Ташкент, Яккасарайский район'
    },
    {
      id: '3',
      title: 'Системы умного дома для ЖК',
      category: 'Технологии',
      status: 'Завершен',
      deadline: '2025-06-01',
      description: 'Поставка и монтаж систем умного дома для жилого комплекса премиум-класса.',
      requirements: 'Сертификация и гарантийное обслуживание не менее 2 лет.',
      budget: '$800,000 - $1.2M',
      location: 'Ташкент, Юнусабадский район'
    },
    {
      id: '4',
      title: 'Благоустройство территории жилого комплекса',
      category: 'Ландшафтный дизайн',
      status: 'Активный',
      deadline: '2025-07-20',
      description: 'Разработка и реализация проекта благоустройства территории жилого комплекса, включая озеленение, обустройство детских и спортивных площадок.',
      requirements: 'Опыт работы с проектами аналогичного масштаба от 3 лет.',
      budget: '$300,000 - $450,000',
      location: 'Ташкент, Чиланзарский район'
    }
  ];

  const partners = [
    {
      id: '1',
      name: 'Строительная компания "Монолит"',
      category: 'Строительство',
      description: 'Многопрофильная строительная компания с полным циклом производства. Более 10 лет на рынке строительства жилой и коммерческой недвижимости.',
      logo: '/placeholder.svg',
      since: '2015',
      projects: 28,
      employees: '500+',
      achievements: ['Лучшая строительная компания 2023', 'Сертификат ISO 9001:2015']
    },
    {
      id: '2',
      name: 'Архитектурное бюро "Концепт"',
      category: 'Проектирование',
      description: 'Команда архитекторов и дизайнеров с международным опытом. Специализация на проектировании современных энергоэффективных зданий.',
      logo: '/placeholder.svg',
      since: '2012',
      projects: 45,
      employees: '80+',
      achievements: ['Премия "Инновационный проект года" 2024', 'Best Design Award 2022']
    },
    {
      id: '3',
      name: 'Поставщик "СтройМатериалы"',
      category: 'Материалы',
      description: 'Поставки качественных строительных материалов от ведущих производителей. Эксклюзивный представитель европейских брендов.',
      logo: '/placeholder.svg',
      since: '2018',
      projects: 120,
      employees: '200+',
      achievements: ['Лидер по объемам поставок 2023', 'Сертификат экологической безопасности']
    },
    {
      id: '4',
      name: 'Инженерные системы "ТехноПроект"',
      category: 'Инженерные системы',
      description: 'Проектирование и монтаж инженерных систем для объектов любой сложности. Комплексные решения для жилых комплексов и бизнес-центров.',
      logo: '/placeholder.svg',
      since: '2016',
      projects: 67,
      employees: '150+',
      achievements: ['Сертификат "Энергоэффективность+" 2023', 'Инновационная компания года']
    }
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Абдуллаев Камрон',
      position: 'Директор ООО "СтройИнвест"',
      text: 'Сотрудничество с TOWER UP позволило нам выйти на новый уровень в реализации строительных проектов. Профессиональный подход, четкое соблюдение сроков и высокое качество работы.',
      company: 'СтройИнвест',
      photo: '/placeholder.svg',
      rating: 5
    },
    {
      id: '2',
      name: 'Игнатова Елена',
      position: 'Главный архитектор "АртПроект"',
      text: 'За три года партнерства с TOWER UP мы реализовали более 10 совместных проектов. Ценим надежность, прозрачность и инновационный подход компании.',
      company: 'АртПроект',
      photo: '/placeholder.svg',
      rating: 5
    },
    {
      id: '3',
      name: 'Рахимов Бахтияр',
      position: 'Генеральный директор "ТехноСтрой"',
      text: 'Благодаря партнерству с TOWER UP наша компания получила доступ к крупным и престижным проектам. Взаимовыгодное сотрудничество, которым мы гордимся.',
      company: 'ТехноСтрой',
      photo: '/placeholder.svg',
      rating: 4
    }
  ];

  const partnershipTypes = [
    {
      title: 'Генеральный подрядчик',
      icon: <Building className="h-10 w-10 text-blue-500" />,
      description: 'Возможность выступить в качестве генерального подрядчика для строительства объектов TOWER UP',
      benefits: ['Крупные долгосрочные контракты', 'Стабильный объем работ', 'Привилегированные условия сотрудничества']
    },
    {
      title: 'Субподрядчик',
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      description: 'Выполнение специализированных работ в рамках проектов компании',
      benefits: ['Регулярные заказы', 'Гибкий график работ', 'Своевременная оплата']
    },
    {
      title: 'Поставщик',
      icon: <Star className="h-10 w-10 text-amber-500" />,
      description: 'Поставка строительных материалов и оборудования для проектов компании',
      benefits: ['Крупный объем заказов', 'Долгосрочные контракты', 'Прозрачные условия сотрудничества']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Активный':
        return 'bg-green-500 hover:bg-green-600';
      case 'Завершен':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const handleTenderClick = (tenderId: string) => {
    toast({
      title: "Запрос отправлен",
      description: "Детали тендера будут отправлены на вашу почту",
    });
  };

  const handlePartnershipRequest = () => {
    toast({
      title: "Заявка принята",
      description: "Наш менеджер свяжется с вами в ближайшее время",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Helmet>
        <title>Сотрудничество | TOWER UP</title>
        <meta name="description" content="Тендеры и партнерские программы TOWER UP - возможности для сотрудничества" />
      </Helmet>

      <PageHeader 
        title="Сотрудничество" 
        backgroundImages={['/lovable-uploads/d2bd2619-426f-4ab0-95ad-ed8b140aa758.png']}
        autoplay={true}
        interval={5000}
        breadcrumb="Сотрудничество"
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>Сотрудничество</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Станьте нашим партнером</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            Компания TOWER UP приглашает к сотрудничеству архитектурные бюро, строительные компании, 
            поставщиков и других участников строительного рынка. Мы предлагаем несколько вариантов для взаимовыгодного партнерства.
          </p>
        </div>

        <Tabs defaultValue="tenders" className="mb-16">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-200/60 p-1 h-auto">
            <TabsTrigger 
              value="tenders" 
              onClick={() => setActiveTab('tenders')}
              className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <FileText className="mr-2 h-5 w-5" />
              Текущие тендеры
            </TabsTrigger>
            <TabsTrigger 
              value="partners" 
              onClick={() => setActiveTab('partners')}
              className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <Users className="mr-2 h-5 w-5" />
              Партнерская программа
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenders" className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 mb-10">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Актуальные тендеры TOWER UP</h3>
                <p className="text-gray-700 mb-4 max-w-3xl">
                  Компания регулярно проводит тендеры на различные виды работ и услуг. Участие в тендерах дает возможность получить крупные заказы и установить долгосрочное сотрудничество.
                </p>
                <Alert className="bg-blue-50 border-blue-200 mb-0">
                  <AlertDescription className="flex items-center text-blue-800">
                    <Calendar className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Регулярно проверяйте эту страницу для обновлений - новые тендеры публикуются каждую неделю</span>
                  </AlertDescription>
                </Alert>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-blue-500/5 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => (
                <Card key={tender.id} className={`${tender.status === 'Завершен' ? "opacity-75" : ""} hover:shadow-lg transition-all duration-300 overflow-hidden group border-slate-200 hover:border-slate-300`}>
                  <div className={`h-2 w-full ${getStatusColor(tender.status)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getStatusColor(tender.status)} text-white`}>
                        {tender.status}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">{tender.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mt-3 text-slate-800 group-hover:text-blue-700 transition-colors">
                      {tender.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-4">
                    <p className="text-sm text-gray-600">{tender.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Срок подачи: {new Date(tender.deadline).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 text-rose-500" />
                        <span>{tender.location}</span>
                      </div>
                      {tender.budget && (
                        <div className="flex items-start text-gray-600">
                          <p className="font-medium flex items-center">
                            <span className="inline-block h-4 w-4 rounded-full bg-green-500 mr-2" />
                            Бюджет: {tender.budget}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      disabled={tender.status === 'Завершен'} 
                      className="w-full group-hover:bg-blue-50 transition-colors"
                      onClick={() => handleTenderClick(tender.id)}
                    >
                      {tender.status === 'Завершен' ? 'Тендер завершен' : 'Подробнее о тендере'}
                      {tender.status !== 'Завершен' && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12 space-x-4">
              <Button variant="outline" className="bg-white shadow-sm hover:shadow">Все тендеры</Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                onClick={() => handlePartnershipRequest()}
              >
                Подать заявку на участие <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 mb-10">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Партнерская программа TOWER UP</h3>
                <p className="text-gray-700 mb-4 max-w-3xl">
                  Станьте частью нашей команды и получите доступ к эксклюзивным проектам. Мы ценим надежных партнеров и предлагаем выгодные условия сотрудничества.
                </p>
                <Alert className="bg-green-50 border-green-200 mb-0">
                  <AlertDescription className="flex items-center text-green-800">
                    <Users className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Станьте нашим партнером и получите доступ к эксклюзивным проектам и предложениям</span>
                  </AlertDescription>
                </Alert>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-purple-500/5 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {partnershipTypes.map((type, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-slate-300">
                  <div className="mb-4">{type.icon}</div>
                  <h4 className="text-xl font-semibold mb-2 text-slate-800">{type.title}</h4>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {partners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-all border-slate-200 hover:border-slate-300 group">
                  <div className="h-40 relative bg-gradient-to-br from-slate-50 to-slate-100">
                    <AspectRatio ratio={16/9}>
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="max-h-24 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </AspectRatio>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-slate-50">{partner.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>С {partner.since}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2 text-slate-800 group-hover:text-blue-700 transition-colors">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{partner.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-2 rounded-md">
                        <p className="text-xs text-slate-500">Проекты</p>
                        <p className="font-semibold text-slate-800">{partner.projects}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-md">
                        <p className="text-xs text-slate-500">Сотрудники</p>
                        <p className="font-semibold text-slate-800">{partner.employees}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50 transition-colors"
                    >
                      Подробнее о партнере
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-10" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-2xl shadow-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Станьте нашим партнером</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Предлагаем гибкие условия сотрудничества для компаний различного профиля. Заполните форму, 
                    и наш менеджер свяжется с вами для обсуждения деталей.
                  </p>
                </div>
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                    onClick={() => handlePartnershipRequest()}
                  >
                    Оставить заявку на партнерство
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-16" />

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Отзывы наших партнеров</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Узнайте, что говорят о сотрудничестве с TOWER UP наши текущие партнеры
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-slate-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-slate-100">
                    <img 
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 border-t pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Преимущества сотрудничества с TOWER UP</h3>
              <ul className="space-y-4">
                {[
                  'Долгосрочные партнерские отношения и стабильные заказы',
                  'Работа над крупными и престижными проектами',
                  'Прозрачные условия и своевременные выплаты',
                  'Возможность совместного развития и реализации инновационных идей',
                  'Расширение сети профессиональных контактов'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-5/12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                <h4 className="text-xl font-semibold mb-4 text-slate-800">Контакты для сотрудничества</h4>
                <p className="mb-4 text-gray-600">
                  По всем вопросам сотрудничества и участия в тендерах вы можете обратиться к нашим специалистам:
                </p>
                <div className="space-y-4">
                  <div className="flex">
                    <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800">Отдел закупок и тендеров:</p>
                      <p className="text-blue-600 hover:text-blue-800 transition-colors">tenders@towerup.uz</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800">Партнерская программа:</p>
                      <p className="text-blue-600 hover:text-blue-800 transition-colors">partners@towerup.uz</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Phone className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800">Телефон:</p>
                      <p className="text-blue-600 hover:text-blue-800 transition-colors">+998 71 123-45-67</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                    onClick={() => handlePartnershipRequest()}
                  >
                    Связаться с нами
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
