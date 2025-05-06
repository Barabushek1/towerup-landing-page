
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Calendar, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

// Mock data for tender announcements
const mockTenders = [
  {
    id: 1,
    category: 'architecture',
    title: {
      ru: 'Архитектурное проектирование жилого комплекса',
      en: 'Architectural design of a residential complex',
      uz: 'Turar-joy majmuasining me\'moriy loyihasi'
    },
    description: {
      ru: 'Ищем архитектурную компанию для проектирования жилого комплекса из 4 зданий в Ташкенте.',
      en: 'Seeking an architectural company to design a residential complex consisting of 4 buildings in Tashkent.',
      uz: 'Toshkentda 4 ta binoli turar-joy majmuasini loyihalash uchun me\'moriy kompaniya qidirilmoqda.'
    },
    deadline: '2025-07-30',
    budget: '$150,000 - $200,000',
    requirements: {
      ru: 'Опыт проектирования аналогичных объектов не менее 5 лет.',
      en: 'Experience in designing similar facilities for at least 5 years.',
      uz: 'Kamida 5 yil davomida shunga o\'xshash inshootlarni loyihalash tajribasi.'
    },
    location: {
      ru: 'Ташкент, Мирзо-Улугбекский район',
      en: 'Tashkent, Mirzo Ulugbek district',
      uz: 'Toshkent, Mirzo Ulug\'bek tumani'
    },
    status: 'active'
  },
  {
    id: 2,
    category: 'construction',
    title: {
      ru: 'Строительство офисного центра',
      en: 'Construction of an office center',
      uz: 'Ofis markazini qurish'
    },
    description: {
      ru: 'Тендер на генерального подрядчика для строительства бизнес-центра класса А.',
      en: 'Tender for a general contractor for the construction of a Class A business center.',
      uz: 'A sinf biznes markazi qurilishi uchun bosh pudratchi bo\'yicha tender.'
    },
    deadline: '2025-06-15',
    budget: '$2,000,000 - $2,500,000',
    requirements: {
      ru: 'Наличие необходимых лицензий и технического оснащения.',
      en: 'Possession of necessary licenses and technical equipment.',
      uz: 'Zarur litsenziya va texnik jihozlarga ega bo\'lish.'
    },
    location: {
      ru: 'Ташкент, Яккасарайский район',
      en: 'Tashkent, Yakkasaray district',
      uz: 'Toshkent, Yakkasaroy tumani'
    },
    status: 'active'
  },
  {
    id: 3,
    category: 'technology',
    title: {
      ru: 'Системы умного дома для ЖК',
      en: 'Smart home systems for RC',
      uz: 'Turar-joy majmuasi uchun aqlli uy tizimlari'
    },
    description: {
      ru: 'Поставка и монтаж систем умного дома для премиального жилого комплекса.',
      en: 'Supply and installation of smart home systems for a premium residential complex.',
      uz: 'Premium turar-joy majmuasi uchun aqlli uy tizimlarini yetkazib berish va o\'rnatish.'
    },
    deadline: '2025-08-10',
    budget: '$500,000 - $700,000',
    requirements: {
      ru: 'Сертификация и гарантийное обслуживание не менее 2 лет.',
      en: 'Certification and warranty service for at least 2 years.',
      uz: 'Kamida 2 yil davomida sertifikatlash va kafolat xizmati.'
    },
    location: {
      ru: 'Ташкент, Юнусабадский район',
      en: 'Tashkent, Yunusabad district',
      uz: 'Toshkent, Yunusobod tumani'
    },
    status: 'completed'
  },
  {
    id: 4,
    category: 'landscaping',
    title: {
      ru: 'Благоустройство территории жилого комплекса',
      en: 'Landscaping of a residential complex territory',
      uz: 'Turar-joy majmuasi hududini obodonlashtirish'
    },
    description: {
      ru: 'Разработка и реализация проекта благоустройства территории жилого комплекса, включая озеленение, обустройство детских и спортивных площадок.',
      en: 'Development and implementation of a landscaping project for a residential complex territory, including greenery, arrangement of children\'s and sports grounds.',
      uz: 'Ko\'kalamzorlashtirish, bolalar va sport maydonchalarini joylashtirish bilan birga turar-joy majmuasi uchun landshaft loyihasini ishlab chiqish va amalga oshirish.'
    },
    deadline: '2025-07-01',
    budget: '$300,000 - $400,000',
    requirements: {
      ru: 'Опыт с проектами аналогичного масштаба не менее 3 лет.',
      en: 'Experience with projects of similar scale for at least 3 years.',
      uz: 'Kamida 3 yil davomida shunga o\'xshash masshtabdagi loyihalar bo\'yicha tajriba.'
    },
    location: {
      ru: 'Ташкент, Чиланзарский район',
      en: 'Tashkent, Chilanzar district',
      uz: 'Toshkent, Chilonzor tumani'
    },
    status: 'active'
  }
];

// Filter categories with their respective translations
const categories = [
  { id: 'all', label: { ru: 'Все', en: 'All', uz: 'Barchasi' } },
  { id: 'architecture', label: { ru: 'Архитектура', en: 'Architecture', uz: 'Me\'morchilik' } },
  { id: 'construction', label: { ru: 'Строительство', en: 'Construction', uz: 'Qurilish' } },
  { id: 'technology', label: { ru: 'Технологии', en: 'Technology', uz: 'Texnologiyalar' } },
  { id: 'landscaping', label: { ru: 'Ландшафт', en: 'Landscaping', uz: 'Landshaft' } }
];

const TendersSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showFilter, setShowFilter] = React.useState(false);

  const filteredTenders = React.useMemo(() => {
    return selectedCategory === 'all'
      ? mockTenders
      : mockTenders.filter(tender => tender.category === selectedCategory);
  }, [selectedCategory]);

  const handleShowDetails = (tenderId: number) => {
    toast({
      title: t('collaboration.tenders.toast.detailsSentTitle'),
      description: t('collaboration.tenders.toast.detailsSentDesc'),
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-slate-800/30 border border-slate-700/30 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-white mb-4">{t('collaboration.tenders.intro.title')}</h3>
        <p className="text-slate-300 mb-4">{t('collaboration.tenders.intro.description')}</p>
        
        <div className="bg-brand-primary/10 border border-brand-primary/30 rounded p-4 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-brand-primary text-sm">{t('collaboration.tenders.intro.alert')}</p>
        </div>
      </div>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm ${
              selectedCategory === category.id 
                ? "bg-brand-primary hover:bg-brand-primary/90" 
                : "hover:bg-slate-800"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label[language as keyof typeof category.label] || category.label.ru}
          </Badge>
        ))}
      </div>
      
      {/* Tender listings */}
      <div className="space-y-6">
        {filteredTenders.map(tender => (
          <Card key={tender.id} className="border-slate-700/50 bg-slate-800/20 overflow-hidden">
            <div className={`h-1 w-full ${tender.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <Badge className={`mb-2 ${
                    tender.category === 'architecture' ? 'bg-blue-600' :
                    tender.category === 'construction' ? 'bg-amber-600' :
                    tender.category === 'technology' ? 'bg-purple-600' :
                    'bg-green-600'
                  }`}>
                    {t(`collaboration.tenders.categories.${tender.category}`)}
                  </Badge>
                  
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {tender.title[language as keyof typeof tender.title] || tender.title.ru}
                  </h4>
                  
                  <p className="text-slate-300 mb-4">
                    {tender.description[language as keyof typeof tender.description] || tender.description.ru}
                  </p>
                </div>
                
                <Badge variant={tender.status === 'active' ? 'default' : 'secondary'} className={
                  tender.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                }>
                  {t(`collaboration.tenders.statuses.${tender.status}`)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">{t('collaboration.tenders.items.deadlineLabel')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-brand-primary" />
                    <p className="text-sm text-white">{new Date(tender.deadline).toLocaleDateString(
                      language === 'en' ? 'en-US' : 
                      language === 'uz' ? 'uz-UZ' : 
                      'ru-RU'
                    )}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">{t('collaboration.tenders.items.budgetLabel')}</p>
                  <p className="text-sm text-white mt-1">{tender.budget}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">{t('collaboration.tenders.items.requirementsLabel')}</p>
                  <p className="text-sm text-white mt-1">
                    {tender.requirements[language as keyof typeof tender.requirements] || tender.requirements.ru}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-brand-primary" />
                <p className="text-sm text-slate-300">
                  {tender.location[language as keyof typeof tender.location] || tender.location.ru}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {tender.status === 'active' ? (
                  <>
                    <Button 
                      onClick={() => handleShowDetails(tender.id)}
                      variant="secondary"
                    >
                      {t('collaboration.tenders.items.buttonDetails')}
                    </Button>
                    
                    <Button 
                      variant="default"
                      className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                      {t('collaboration.tenders.buttonApply')}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" disabled>
                    {t('collaboration.tenders.items.buttonCompleted')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredTenders.length === 0 && (
        <div className="text-center py-12 bg-slate-800/20 rounded-lg border border-slate-700/30">
          <p className="text-slate-400">{t('collaboration.tenders.noTenders')}</p>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg">
          {t('collaboration.tenders.buttonAll')}
        </Button>
      </div>
    </div>
  );
};

export default TendersSection;
