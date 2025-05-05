import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Input and Slider are no longer directly used for calculation input, but maybe for display or future features
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumberWithSpaces } from "@/utils/format-utils"; // Assuming this utility exists
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // Assuming supabase client is set up

// Import Shadcn Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for apartment unit data
interface ApartmentUnit {
  id: string;
  floor: number;
  area: number;
  room_count: number;
  price_per_sqm: number;
  total_price: number;
  initial_payment_30p: number;
  monthly_payment_8mo_30p: number;
  cadastre_payment_40p: number;
  // Add phase, block if needed from Excel
}

interface ApartmentCalculatorProps {
  className?: string;
}

const ApartmentCalculator: React.FC<ApartmentCalculatorProps> = ({
  className,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null);

  // Fetch all apartment unit data from Supabase
  const { data: apartmentUnits, isLoading, error } = useQuery<ApartmentUnit[]>({
    queryKey: ['apartmentUnits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .order('floor', { ascending: false }) // Order by floor, maybe also area
        .order('area', { ascending: true });

      if (error) {
        console.error("Error fetching apartment units:", error);
        throw new Error(`Error fetching apartment units: ${error.message}`);
      }

      return data;
    },
  });

  // Derive unique floors and units per floor once data is loaded
  const floors = apartmentUnits ? Array.from(new Set(apartmentUnits.map(unit => unit.floor))).sort((a, b) => b - a) : []; // Sort floors descending
  const unitsOnSelectedFloor = selectedFloor && apartmentUnits
    ? apartmentUnits.filter(unit => unit.floor === parseInt(selectedFloor))
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

  if (isLoading) {
    return (
      <Card className={`border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
        <CardHeader className="bg-[#131313] border-b border-slate-700/30">
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="text-brand-primary" />
            Калькулятор стоимости
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="ml-2 text-slate-300">Загрузка данных...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
     return (
      <Card className={`border-slate-700/30 bg-red-900/20 shadow-lg ${className}`}>
        <CardHeader className="bg-red-900/30 border-b border-red-700/30">
          <CardTitle className="flex items-center gap-2 text-red-400">
             <Calculator className="text-red-600" />
            Ошибка загрузки
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-red-300">
          <p>Не удалось загрузить данные для калькулятора.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className={`border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
      <CardHeader className="bg-[#131313] border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="text-brand-primary" />
          Калькулятор стоимости
        </CardTitle>
        <p className="text-sm text-slate-400">Цены и условия для квартир в блоках 9-16</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">

        {/* Floor Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Выберите этаж</label>
          <Select onValueChange={handleFloorChange} value={selectedFloor || ""}>
            <SelectTrigger className="w-full bg-[#222] border-slate-700/50 text-white">
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
           <label className="text-sm font-medium text-white">Выберите квартиру (Площадь / Комнаты)</label>
           <Select onValueChange={handleUnitChange} value={selectedUnit?.id || ""}>
            <SelectTrigger className="w-full bg-[#222] border-slate-700/50 text-white" disabled={!selectedFloor || unitsOnSelectedFloor.length === 0}>
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
            className="bg-[#0f0f0f] p-5 rounded-lg border border-brand-primary/20 space-y-4"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-brand-primary mb-3">Выбранная квартира</h3>

            <div className="space-y-2 text-white/90">
                <p className="text-sm"><span className="font-semibold">Этаж:</span> {selectedUnit.floor}</p>
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

        <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
          Оставить заявку
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApartmentCalculator;