
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { formatNumberWithSpaces } from '@/utils/format-utils';

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

interface PriceCalculatorProps {
  className?: string;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ className }) => {
  const { t } = useLanguage();
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null);
  const [apartmentUnits, setApartmentUnits] = useState<ApartmentUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch apartment units from the yangi_uzbekistan_apartment_units table
  useEffect(() => {
    const fetchApartmentUnits = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('yangi_uzbekistan_apartment_units')
          .select('*')
          .order('floor_number', { ascending: false });
          
        if (error) {
          throw new Error(`Error fetching apartment units: ${error.message}`);
        }
        
        if (data) {
          setApartmentUnits(data as ApartmentUnit[]);
        }
      } catch (err) {
        console.error("Failed to fetch apartment units:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApartmentUnits();
  }, []);

  // Get unique floors sorted from highest to lowest (descending order)
  const floors = Array.from(new Set(apartmentUnits.map(unit => unit.floor_number))).sort((a, b) => b - a);
  
  // Filter units by selected floor and sort by area
  const unitsOnSelectedFloor = selectedFloor
    ? apartmentUnits.filter(unit => unit.floor_number === parseInt(selectedFloor)).sort((a, b) => a.area - b.area)
    : [];

  // Reset selected unit when floor changes
  useEffect(() => {
    setSelectedUnit(null);
  }, [selectedFloor]);

  const handleFloorChange = (value: string) => {
    setSelectedFloor(value);
  };

  const handleUnitChange = (unitId: string) => {
    const unit = unitsOnSelectedFloor.find(u => u.id === unitId);
    setSelectedUnit(unit || null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={`overflow-hidden backdrop-blur-sm border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
        <CardHeader className="bg-[#131313] border-b border-slate-700/30">
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="text-primary" />
            Калькулятор стоимости
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-slate-300">Загрузка данных...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state with fallback
  if (error && apartmentUnits.length === 0) {
    return (
      <Card className={`overflow-hidden backdrop-blur-sm border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
        <CardHeader className="bg-[#131313] border-b border-slate-700/30">
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="text-primary" />
            Калькулятор стоимости
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md mb-4">
            <p>Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Main render
  return (
    <Card className={`overflow-hidden backdrop-blur-sm border-slate-700/30 bg-white/5 ${className}`}>
      <CardHeader className="bg-black/40 border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="text-primary" />
          Калькулятор стоимости
        </CardTitle>
        <p className="text-sm text-slate-400">Цены и условия для квартир</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Floor Selection */}
        <div className="space-y-2">
          <Label htmlFor="floor-select" className="text-white/70 mb-1 block">Выберите этаж</Label>
          <Select onValueChange={handleFloorChange} value={selectedFloor || ""}>
            <SelectTrigger id="floor-select" className="bg-slate-800/70 border-slate-700/50 text-white">
               <SelectValue placeholder="Выберите этаж" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border-slate-700">
              {floors.map(floor => (
                <SelectItem key={floor} value={floor.toString()}>
                  {floor} Этаж
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apartment Unit Selection */}
        <div className="space-y-2">
           <Label htmlFor="unit-select" className="text-white/70 mb-1 block">Выберите квартиру (Площадь / Комнаты)</Label>
           <Select onValueChange={handleUnitChange} value={selectedUnit?.id || ""}>
            <SelectTrigger 
              id="unit-select"
              className="bg-slate-800/70 border-slate-700/50 text-white" 
              disabled={!selectedFloor || unitsOnSelectedFloor.length === 0}
            >
               <SelectValue placeholder={selectedFloor ? (unitsOnSelectedFloor.length > 0 ? "Выберите квартиру" : "Нет доступных квартир на этом этаже") : "Сначала выберите этаж"} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border-slate-700">
              {unitsOnSelectedFloor.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.area} м² ({unit.room_count}-комн.) - {formatNumberWithSpaces(unit.price_per_sqm)} сум/м²
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display Results */}
        {selectedUnit && (
          <motion.div
            className="bg-slate-800/70 p-5 rounded-lg border border-primary/20 space-y-4"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-primary mb-3">Выбранная квартира</h3>

            <div className="space-y-2 text-white/90">
                <p className="text-sm"><span className="font-semibold">Этаж:</span> {selectedUnit.floor_number}</p>
                <p className="text-sm"><span className="font-semibold">Площадь:</span> {selectedUnit.area} м²</p>
                <p className="text-sm"><span className="font-semibold">Комнат:</span> {selectedUnit.room_count}</p>
                <p className="text-sm"><span className="font-semibold">Цена за м²:</span> {formatNumberWithSpaces(selectedUnit.price_per_sqm)} сум</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                 <p className="text-md font-bold text-white">Общая стоимость: {formatNumberWithSpaces(selectedUnit.total_price)} сум</p>

                 <div className="space-y-2 text-white/90">
                    <p className="text-sm"><span className="font-semibold">Первоначальный взнос (30%):</span> {formatNumberWithSpaces(selectedUnit.initial_payment_30p)} сум</p>
                    <p className="text-sm"><span className="font-semibold">Ежемесячно (8 мес, 30%):</span> {formatNumberWithSpaces(selectedUnit.monthly_payment_8mo_30p)} сум</p>
                    <p className="text-sm"><span className="font-semibold">Оплата после кадастра (40%):</span> {formatNumberWithSpaces(selectedUnit.cadastre_payment_40p)} сум</p>
                 </div>
            </div>
          </motion.div>
        )}
        
        {/* Message if no unit is selected after floor is chosen */}
        {selectedFloor && !selectedUnit && unitsOnSelectedFloor.length > 0 && (
             <div className="text-center text-slate-400 italic">
                 Выберите квартиру из списка выше для просмотра деталей.
             </div>
        )}
        {/* Message if a floor with no units is selected */}
        {selectedFloor && unitsOnSelectedFloor.length === 0 && (
             <div className="text-center text-slate-400 italic">
                 На этом этаже нет доступных квартир.
             </div>
        )}

        <Button 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={!selectedUnit}
        >
          Оставить заявку
        </Button>
        
        <div className="text-xs text-slate-400 pt-2 text-center">
          Для получения подробной информации свяжитесь с менеджером по телефону <span className="text-primary">+998 71 123-45-67</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
