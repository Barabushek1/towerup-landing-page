
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Users, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const Collaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tenders');

  // Hardcoded data for examples
  const tenders = [
    {
      id: '1',
      title: 'Архитектурное проектирование жилого комплекса',
      category: 'Архитектура',
      status: 'Активный',
      deadline: '2025-08-15',
      description: 'Поиск архитектурной компании для проектирования жилого комплекса из 4 зданий в Ташкенте.',
      requirements: 'Опыт проектирования аналогичных объектов не менее 5 лет.'
    },
    {
      id: '2',
      title: 'Строительство офисного центра',
      category: 'Строительство',
      status: 'Активный',
      deadline: '2025-09-10',
      description: 'Тендер на генерального подрядчика для строительства бизнес-центра класса А.',
      requirements: 'Наличие необходимых лицензий и технического оснащения.'
    },
    {
      id: '3',
      title: 'Системы умного дома для ЖК',
      category: 'Технологии',
      status: 'Завершен',
      deadline: '2025-06-01',
      description: 'Поставка и монтаж систем умного дома для жилого комплекса премиум-класса.',
      requirements: 'Сертификация и гарантийное обслуживание не менее 2 лет.'
    }
  ];

  const partners = [
    {
      id: '1',
      name: 'Строительная компания "Монолит"',
      category: 'Строительство',
      description: 'Многопрофильная строительная компания с полным циклом производства.',
      logo: '/placeholder.svg',
      since: '2015'
    },
    {
      id: '2',
      name: 'Архитектурное бюро "Концепт"',
      category: 'Проектирование',
      description: 'Команда архитекторов и дизайнеров с международным опытом.',
      logo: '/placeholder.svg',
      since: '2012'
    },
    {
      id: '3',
      name: 'Поставщик "СтройМатериалы"',
      category: 'Материалы',
      description: 'Поставки качественных строительных материалов от ведущих производителей.',
      logo: '/placeholder.svg',
      since: '2018'
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

  return (
    <div className="min-h-screen bg-gray-50">
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

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Варианты сотрудничества</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Компания TOWER UP приглашает к сотрудничеству архитектурные бюро, строительные компании, 
            поставщиков и других участников строительного рынка. Мы предлагаем несколько вариантов для взаимовыгодного партнерства.
          </p>
        </div>

        <Tabs defaultValue="tenders" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tenders" onClick={() => setActiveTab('tenders')}>
              <FileText className="mr-2 h-4 w-4" />
              Текущие тендеры
            </TabsTrigger>
            <TabsTrigger value="partners" onClick={() => setActiveTab('partners')}>
              <Users className="mr-2 h-4 w-4" />
              Партнерская программа
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenders" className="space-y-6">
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertDescription className="flex items-center text-blue-800">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Регулярно проверяйте эту страницу для обновлений - новые тендеры публикуются каждую неделю</span>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => (
                <Card key={tender.id} className={tender.status === 'Завершен' ? "opacity-75" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getStatusColor(tender.status)} text-white`}>
                        {tender.status}
                      </Badge>
                      <Badge variant="outline">{tender.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mt-3">{tender.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-gray-600 mb-3">{tender.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Срок подачи: {new Date(tender.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      disabled={tender.status === 'Завершен'} 
                      className="w-full"
                    >
                      Подробнее о тендере
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="mr-4">Все тендеры</Button>
              <Button>Подать заявку на участие</Button>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-8">
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="flex items-center text-green-800">
                <Users className="mr-2 h-5 w-5" />
                <span>Станьте нашим партнером и получите доступ к эксклюзивным проектам и предложениям</span>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden">
                  <div className="h-48 relative">
                    <AspectRatio ratio={16/9}>
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="max-h-24 max-w-[80%] object-contain" 
                        />
                      </div>
                    </AspectRatio>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{partner.category}</Badge>
                      <span className="text-sm text-gray-500">Партнер с {partner.since}</span>
                    </div>
                    <CardTitle className="text-xl mt-2">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{partner.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Подробнее о партнере
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="bg-gray-100 p-8 rounded-lg mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3">Станьте нашим партнером</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Предлагаем гибкие условия сотрудничества для компаний различного профиля. Заполните форму, 
                  и наш менеджер свяжется с вами для обсуждения деталей.
                </p>
              </div>
              <div className="text-center">
                <Button size="lg">
                  Оставить заявку на партнерство
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 border-t pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Преимущества сотрудничества с TOWER UP</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Долгосрочные партнерские отношения и стабильные заказы</li>
                <li>Работа над крупными и престижными проектами</li>
                <li>Прозрачные условия и своевременные выплаты</li>
                <li>Возможность совместного развития и реализации инновационных идей</li>
                <li>Расширение сети профессиональных контактов</li>
              </ul>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-4">Контакты для сотрудничества</h4>
                <p className="mb-4 text-gray-600">
                  По всем вопросам сотрудничества и участия в тендерах вы можете обратиться к нашим специалистам:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Отдел закупок и тендеров:</p>
                    <p className="text-gray-600">tenders@towerup.uz</p>
                  </div>
                  <div>
                    <p className="font-medium">Партнерская программа:</p>
                    <p className="text-gray-600">partners@towerup.uz</p>
                  </div>
                  <div>
                    <p className="font-medium">Телефон:</p>
                    <p className="text-gray-600">+998 71 123-45-67</p>
                  </div>
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
