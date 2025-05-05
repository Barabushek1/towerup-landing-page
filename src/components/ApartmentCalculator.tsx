
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react"; // Loader2 might still be useful if simulating load, but removed in this version
import { motion } from "framer-motion";
import { formatNumberWithSpaces } from "@/utils/format-utils"; // Assuming this utility exists

// Import Shadcn Select components (Assuming you have these installed)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for apartment unit data
interface ApartmentUnit {
  id: string; // Unique ID for each unit
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

// --- HARDCODED EXAMPLE DATA ---
// This replaces the database fetch. Data is based on your Excel snippet.
const EXAMPLE_APARTMENT_UNITS: ApartmentUnit[] = [
  // 16 ЭТАЖ
  { id: 'unit-16-31.14', floor: 16, area: 31.14, room_count: 1, price_per_sqm: 13000000, total_price: 404820000, initial_payment_30p: 121446000, monthly_payment_8mo_30p: 15180700, cadastre_payment_40p: 161928000 },
  { id: 'unit-16-40.47', floor: 16, area: 40.47, room_count: 1, price_per_sqm: 12220000, total_price: 494543000, initial_payment_30p: 148363000, monthly_payment_8mo_30p: 19729100, cadastre_payment_40p: 197818000 }, // Price/sqm estimated from total/area
  { id: 'unit-16-50.50', floor: 16, area: 50.50, room_count: 2, price_per_sqm: 13000000, total_price: 656500000, initial_payment_30p: 196950000, monthly_payment_8mo_30p: 24618700, cadastre_payment_40p: 262600000 }, // Price/sqm estimated
  { id: 'unit-16-67.30', floor: 16, area: 67.30, room_count: 3, price_per_sqm: 13000000, total_price: 874900000, initial_payment_30p: 262470000, monthly_payment_8mo_30p: 32808700, cadastre_payment_40p: 349960000 }, // Price/sqm estimated
  { id: 'unit-16-75.35', floor: 16, area: 75.35, room_count: 3, price_per_sqm: 13000000, total_price: 979550000, initial_payment_30p: 293865000, monthly_payment_8mo_30p: 36733100, cadastre_payment_40p: 391820000 }, // Price/sqm estimated

  // 15 ЭТАЖ
  { id: 'unit-15-31.14', floor: 15, area: 31.14, room_count: 1, price_per_sqm: 13390000, total_price: 416965000, initial_payment_30p: 125090000, monthly_payment_8mo_30p: 15636100, cadastre_payment_40p: 166786000 },
  { id: 'unit-15-40.47', floor: 15, area: 40.47, room_count: 1, price_per_sqm: 13390000, total_price: 541893000, initial_payment_30p: 162568000, monthly_payment_8mo_30p: 20320900, cadastre_payment_40p: 216758000 }, // Price/sqm estimated
  { id: 'unit-15-50.50', floor: 15, area: 50.50, room_count: 2, price_per_sqm: 13390000, total_price: 676195000, initial_payment_30p: 202859000, monthly_payment_8mo_30p: 25357300, cadastre_payment_40p: 270478000 }, // Price/sqm estimated
  // ... Add more units from other floors as needed ...

  // 1 ЭТАЖ (using price_per_sqm directly from Excel)
  { id: 'unit-1-31.14', floor: 1, area: 31.14, room_count: 1, price_per_sqm: 20800000, total_price: 647712000, initial_payment_30p: 194314000, monthly_payment_8mo_30p: 24289200, cadastre_payment_40p: 259085000 },
  { id: 'unit-1-40.47', floor: 1, area: 40.47, room_count: 1, price_per_sqm: 20800000, total_price: 841776000, initial_payment_30p: 252533000, monthly_payment_8mo_30p: 31566600, cadastre_payment_40p: 336711000 },
  { id: 'unit-1-50.50', floor: 1, area: 50.50, room_count: 2, price_per_sqm: 20800000, total_price: 1050400000, initial_payment_30p: 315120000, monthly_payment_8mo_30p: 39390000, cadastre_payment_40p: 420160000 },
  // ... add other units for floor 1 ...

];
// --- END OF EXAMPLE DATA ---


interface ApartmentCalculatorProps {
  className?: string;
  defaultPricePerSqm?: number; // Add this prop to fix the error
}

const ApartmentCalculator: React.FC<ApartmentCalculatorProps> = ({
  className,
  defaultPricePerSqm = 12000000, // Default value if not provided
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null);
  // We don't need loading/error states from database fetch anymore
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);

  // Use the example data directly
  const apartmentUnits = EXAMPLE_APARTMENT_UNITS;

  // Derive unique floors and units per floor from the example data
  // Sort floors descending as in Excel
  const floors = Array.from(new Set(apartmentUnits.map(unit => unit.floor))).sort((a, b) => b - a);

  const unitsOnSelectedFloor = selectedFloor
    ? apartmentUnits.filter(unit => unit.floor === parseInt(selectedFloor)).sort((a,b) => a.area - b.area) // Sort units by area
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

  // Remove loading state render
  // if (isLoading) { ... }

  // Remove error state render
  // if (error) { ... }


  // The main render function now uses the local data
  return (
    <Card className={`border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
      <CardHeader className="bg-[#131313] border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="text-brand-primary" />
          Калькулятор стоимости
        </CardTitle>
        {/* Clarify the data source is static/example */}
        <p className="text-sm text-slate-400">Цены и условия для квартир в блоках 9-16 (Пример данных)</p>
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
               {/* Update placeholder based on selection state */}
               <SelectValue placeholder={selectedFloor ? (unitsOnSelectedFloor.length > 0 ? "Выберите квартиру" : "Нет доступных квартир на этом этаже") : "Сначала выберите этаж"} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border-slate-700">
              {unitsOnSelectedFloor.map(unit => (
                // Use unit ID as value, display area and room count
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
                {/* Display price per sqm for the selected unit */}
                <p className="text-sm"><span className="font-semibold">Цена за м²:</span> {formatNumberWithSpaces(selectedUnit.price_per_sqm)} сум</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                 {/* Display total price for the selected unit */}
                 <p className="text-md font-bold text-white">Общая стоимость: {formatNumberWithSpaces(selectedUnit.total_price)} сум</p>

                 <div className="space-y-2 text-white/90">
                    {/* Display payment plan breakdown */}
                    <p className="text-sm"><span className="font-semibold">Первоначальный взнос (30%):</span> {formatNumberWithSpaces(selectedUnit.initial_payment_30p)} сум</p>
                    <p className="text-sm"><span className="font-semibold">Ежемесячно (8 мес, 30%):</span> {formatNumberWithSpaces(selectedUnit.monthly_payment_8mo_30p)} сум</p>
                     <p className="text-sm"><span className="font-semibold">Оплата после кадастра (40%):</span> {formatNumberWithSpaces(selectedUnit.cadastre_payment_40p)} сум</p>
                 </div>
            </div>
             {/* Note about calculations based on example data */}
             <p className="text-xs text-slate-500 mt-4">* Расчеты основаны на данных для конкретной квартиры, предоставленных в примере.</p>


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
                 На этом этаже нет доступных квартир в примере данных.
             </div>
        )}


        <Button className="w-full bg-brand-primary hover:bg-brand-primary/90" disabled={!selectedUnit}>
          Оставить заявку
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApartmentCalculator;
