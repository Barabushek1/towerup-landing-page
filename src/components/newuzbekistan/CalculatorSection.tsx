
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Calculator, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FloorPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
}

interface ApartmentUnit {
  id: string;
  floor_number: number;
  area: number;
  room_count: number;
  price_per_sqm: number;
  total_price: number;
  initial_payment_30p: number;
  monthly_payment_8mo_30p: number;
  cadastre_payment_40p: number;
}

const CalculatorSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  const [floorPrices, setFloorPrices] = useState<FloorPrice[]>([]);
  const [apartmentUnits, setApartmentUnits] = useState<ApartmentUnit[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<ApartmentUnit[]>([]);
  
  const [activeTab, setActiveTab] = useState('ready-apartments');
  
  // Form state for ready apartments
  const [selectedApartment, setSelectedApartment] = useState<string>('');
  const [selectedApartmentData, setSelectedApartmentData] = useState<ApartmentUnit | null>(null);
  
  // Form state for custom calculation
  const [apartmentType, setApartmentType] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [floorNumber, setFloorNumber] = useState<string>('');
  const [pricePerSqm, setPricePerSqm] = useState<string>('');
  
  // Calculation results state
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [cadastrePayment, setCadastrePayment] = useState<number>(0);
  
  // Form state for contact info (displayed after calculation)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Fetch price data on component mount
  useEffect(() => {
    fetchFloorPrices();
    fetchApartmentUnits();
  }, []);
  
  const fetchFloorPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*')
        .order('apartment_type');

      if (error) throw error;
      setFloorPrices(data || []);
    } catch (error) {
      console.error('Error fetching floor prices:', error);
    }
  };
  
  const fetchApartmentUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_apartment_units')
        .select('*')
        .order('floor_number')
        .order('room_count');

      if (error) throw error;
      setApartmentUnits(data || []);
      setFilteredApartments(data || []);
    } catch (error) {
      console.error('Error fetching apartment units:', error);
    }
  };
  
  const handleApartmentTypeChange = (type: string) => {
    setApartmentType(type);
    // Find the price for this apartment type
    const priceData = floorPrices.find(p => p.apartment_type === type);
    if (priceData) {
      setPricePerSqm(priceData.price_per_sqm.toString());
    }
  };
  
  const handleFilterChange = (key: string, value: string) => {
    if (value === "all") {
      setFilteredApartments(apartmentUnits);
      return;
    }
    
    const filtered = apartmentUnits.filter(apartment => {
      if (key === 'room_count') return apartment.room_count === parseInt(value);
      if (key === 'floor_number') return apartment.floor_number === parseInt(value);
      return true;
    });
    
    setFilteredApartments(filtered);
  };
  
  const handleSelectedApartmentChange = (apartmentId: string) => {
    setSelectedApartment(apartmentId);
    const selected = apartmentUnits.find(a => a.id === apartmentId);
    if (selected) {
      setSelectedApartmentData(selected);
      setShowResults(true);
      setTotalPrice(selected.total_price);
      setInitialPayment(selected.initial_payment_30p);
      setMonthlyPayment(selected.monthly_payment_8mo_30p);
      setCadastrePayment(selected.cadastre_payment_40p);
    }
  };
  
  const calculateCustomPrice = () => {
    if (!area || !pricePerSqm) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    const areaValue = parseFloat(area);
    const pricePerSqmValue = parseFloat(pricePerSqm);
    
    const total = areaValue * pricePerSqmValue;
    const initial = total * 0.3;
    const monthly = initial / 8;
    const cadastre = total * 0.4;
    
    setTotalPrice(total);
    setInitialPayment(initial);
    setMonthlyPayment(monthly);
    setCadastrePayment(cadastre);
    setShowResults(true);
  };
  
  const handleRequestCall = async () => {
    if (!name || !phone) {
      toast.error('Пожалуйста, заполните ваше имя и номер телефона');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const calculationDetails = activeTab === 'ready-apartments'
        ? {
          apartment_id: selectedApartment,
          floor_number: selectedApartmentData?.floor_number,
          area: selectedApartmentData?.area,
          room_count: selectedApartmentData?.room_count,
          price_per_sqm: selectedApartmentData?.price_per_sqm,
        }
        : {
          apartment_type: apartmentType,
          floor_number: floorNumber,
          area: parseFloat(area),
          price_per_sqm: parseFloat(pricePerSqm),
        };
      
      const { error } = await supabase.from('messages').insert({
        name: name,
        email: phone, // Using phone field as the "email" as we don't have a separate phone field
        message: `Запрос на расчет стоимости квартиры (Янги Узбекистан):\n${JSON.stringify(calculationDetails)}\nИтого: ${totalPrice.toLocaleString()} сум`,
      });
      
      if (error) throw error;
      
      toast.success('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      setName('');
      setPhone('');
      setShowContactForm(false);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get unique room counts and floor numbers for filters
  const uniqueRoomCounts = [...new Set(apartmentUnits.map(a => a.room_count))].sort();
  const uniqueFloors = [...new Set(apartmentUnits.map(a => a.floor_number))].sort();
  
  return (
    <section 
      id="calculator" 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-[#0c0c0c] text-white"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Расчет стоимости
          </h2>
          
          <p className="text-xl text-primary">
            Используйте наш калькулятор для расчета стоимости квартиры
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/40 rounded-xl p-6 md:p-8 border border-slate-700/50"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="ready-apartments">Готовые квартиры</TabsTrigger>
                <TabsTrigger value="custom">Индивидуальный расчет</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ready-apartments" className="space-y-6">
                {/* Filters for ready apartments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomCount">Количество комнат</Label>
                    <Select onValueChange={(value) => handleFilterChange('room_count', value)}>
                      <SelectTrigger id="roomCount" className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Выберите количество комнат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все варианты</SelectItem>
                        {uniqueRoomCounts.map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} {count === 1 ? 'комната' : count < 5 ? 'комнаты' : 'комнат'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="floorNumber">Этаж</Label>
                    <Select onValueChange={(value) => handleFilterChange('floor_number', value)}>
                      <SelectTrigger id="floorNumber" className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Выберите этаж" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все этажи</SelectItem>
                        {uniqueFloors.map((floor) => (
                          <SelectItem key={floor} value={floor.toString()}>
                            {floor}-й этаж
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Apartment selector */}
                <div>
                  <Label htmlFor="apartment">Выберите квартиру</Label>
                  <Select value={selectedApartment} onValueChange={handleSelectedApartmentChange}>
                    <SelectTrigger id="apartment" className="bg-slate-700/50 border-slate-600">
                      <SelectValue placeholder="Выберите квартиру" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredApartments.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Нет доступных квартир
                        </SelectItem>
                      ) : (
                        filteredApartments.map((apartment) => (
                          <SelectItem key={apartment.id} value={apartment.id}>
                            {apartment.room_count} комн. | {apartment.area} м² | {apartment.floor_number} этаж
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-6">
                {/* Custom calculation form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apartmentType">Тип квартиры</Label>
                    <Select value={apartmentType} onValueChange={handleApartmentTypeChange}>
                      <SelectTrigger id="apartmentType" className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Выберите тип квартиры" />
                      </SelectTrigger>
                      <SelectContent>
                        {floorPrices.map((price) => (
                          <SelectItem key={price.id} value={price.apartment_type}>
                            {price.apartment_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="area">Площадь (м²)</Label>
                    <Input
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Введите площадь"
                      className="bg-slate-700/50 border-slate-600"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="floorNumberCustom">Этаж</Label>
                    <Input
                      id="floorNumberCustom"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      placeholder="Введите этаж"
                      className="bg-slate-700/50 border-slate-600"
                      type="number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pricePerSqm">Цена за м² (сум)</Label>
                    <Input
                      id="pricePerSqm"
                      value={pricePerSqm}
                      onChange={(e) => setPricePerSqm(e.target.value)}
                      placeholder="Цена за м²"
                      className="bg-slate-700/50 border-slate-600"
                      type="number"
                      readOnly={!!apartmentType} // Make readonly if apartment type is selected
                    />
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={calculateCustomPrice}
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Рассчитать стоимость
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Results section */}
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 border-t border-slate-700 pt-6"
              >
                <h3 className="text-xl font-bold mb-4 text-center">
                  Результаты расчета
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/40 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400 mb-1">Общая стоимость:</div>
                    <div className="text-xl font-bold">{totalPrice.toLocaleString()} сум</div>
                  </div>
                  
                  <div className="bg-slate-700/40 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400 mb-1">Первый взнос (30%):</div>
                    <div className="text-xl font-bold">{initialPayment.toLocaleString()} сум</div>
                  </div>
                  
                  <div className="bg-slate-700/40 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400 mb-1">Ежемесячный платеж:</div>
                    <div className="text-xl font-bold">{monthlyPayment.toLocaleString()} сум</div>
                    <div className="text-xs text-slate-500">на 8 месяцев</div>
                  </div>
                  
                  <div className="bg-slate-700/40 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400 mb-1">Кадастр (40%):</div>
                    <div className="text-xl font-bold">{cadastrePayment.toLocaleString()} сум</div>
                  </div>
                </div>
                
                {!showContactForm ? (
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setShowContactForm(true)}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Получить консультацию
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md mx-auto space-y-4"
                  >
                    <h4 className="font-bold text-center">
                      Оставьте свои контакты для консультации
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Ваше имя</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Введите ваше имя"
                          className="bg-slate-700/50 border-slate-600"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Номер телефона</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Введите номер телефона"
                          className="bg-slate-700/50 border-slate-600"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleRequestCall}
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Отправка...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Check className="mr-2 h-4 w-4" />
                            Отправить заявку
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-slate-400 max-w-3xl mx-auto"
          >
            <p>
              Окончательная стоимость может отличаться от расчётной. Для получения точной информации, 
              пожалуйста, свяжитесь с нашими консультантами по телефону 
              <a href="tel:+998712038888" className="text-primary hover:underline mx-1">+99871 203-88-88</a> 
              или посетите наш офис продаж.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
