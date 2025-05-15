
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumberWithSpaces } from "@/utils/format-utils";

// Import Shadcn Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Mock data for the apartments
const mockApartments: ApartmentUnit[] = [
  {
    id: "1",
    floor_number: 5,
    area: 35.5,
    room_count: 1,
    price_per_sqm: 10000000,
    total_price: 35.5 * 10000000,
    initial_payment_30p: 35.5 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (35.5 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 35.5 * 10000000 * 0.4
  },
  {
    id: "2",
    floor_number: 5,
    area: 42.3,
    room_count: 1,
    price_per_sqm: 10000000,
    total_price: 42.3 * 10000000,
    initial_payment_30p: 42.3 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (42.3 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 42.3 * 10000000 * 0.4
  },
  {
    id: "3",
    floor_number: 8,
    area: 55.8,
    room_count: 2,
    price_per_sqm: 10000000,
    total_price: 55.8 * 10000000,
    initial_payment_30p: 55.8 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (55.8 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 55.8 * 10000000 * 0.4
  },
  {
    id: "4",
    floor_number: 8,
    area: 60.2,
    room_count: 2,
    price_per_sqm: 10000000,
    total_price: 60.2 * 10000000,
    initial_payment_30p: 60.2 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (60.2 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 60.2 * 10000000 * 0.4
  },
  {
    id: "5",
    floor_number: 12,
    area: 78.4,
    room_count: 3,
    price_per_sqm: 10000000,
    total_price: 78.4 * 10000000,
    initial_payment_30p: 78.4 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (78.4 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 78.4 * 10000000 * 0.4
  },
  {
    id: "6",
    floor_number: 12,
    area: 85.6,
    room_count: 3,
    price_per_sqm: 10000000,
    total_price: 85.6 * 10000000,
    initial_payment_30p: 85.6 * 10000000 * 0.3,
    monthly_payment_8mo_30p: (85.6 * 10000000 * 0.3) / 8,
    cadastre_payment_40p: 85.6 * 10000000 * 0.4
  }
];

interface CostCalculatorSectionProps {
  className?: string;
}

const CostCalculatorSection: React.FC<CostCalculatorSectionProps> = ({
  className,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique floors sorted from highest to lowest
  const floors = Array.from(
    new Set(mockApartments.map(unit => unit.floor_number))
  ).sort((a, b) => b - a);
  
  // Filter units by selected floor and sort by area
  const unitsOnSelectedFloor = selectedFloor
    ? mockApartments
        .filter(unit => unit.floor_number === parseInt(selectedFloor))
        .sort((a, b) => a.area - b.area)
    : [];

  // Reset selected unit when floor changes
  React.useEffect(() => {
    setSelectedUnit(null);
  }, [selectedFloor]);

  const handleFloorChange = (value: string) => {
    setSelectedFloor(value);
  };

  const handleUnitChange = (unitId: string) => {
    const unit = unitsOnSelectedFloor.find(u => u.id === unitId);
    setSelectedUnit(unit || null);
  };

  return (
    <section id="cost-calculator" className="py-16 bg-[#111111]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-brand-primary">
            РАСЧЕТ СТОИМОСТИ
          </h2>
          <h3 className="text-xl sm:text-2xl font-medium mb-8 text-center text-white">
            МАССИВ УЗБЕКИСТАН
          </h3>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-slate-700/30 bg-[#1a1a1a] shadow-lg">
            <CardHeader className="bg-[#131313] border-b border-slate-700/30">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calculator className="text-brand-primary" />
                Калькулятор стоимости
              </CardTitle>
              <p className="text-sm text-slate-400">
                Цены и условия для квартир
              </p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Floor Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Выберите этаж
                </label>
                <Select
                  onValueChange={handleFloorChange}
                  value={selectedFloor || ""}
                >
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
                <label className="text-sm font-medium text-white">
                  Выберите квартиру (Площадь / Комнаты)
                </label>
                <Select
                  onValueChange={handleUnitChange}
                  value={selectedUnit?.id || ""}
                >
                  <SelectTrigger
                    className="w-full bg-[#222] border-slate-700/50 text-white"
                    disabled={!selectedFloor || unitsOnSelectedFloor.length === 0}
                  >
                    <SelectValue
                      placeholder={
                        selectedFloor
                          ? unitsOnSelectedFloor.length > 0
                            ? "Выберите квартиру"
                            : "Нет доступных квартир на этом этаже"
                          : "Сначала выберите этаж"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700">
                    {unitsOnSelectedFloor.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.area} м² ({unit.room_count}-комн.) -{" "}
                        {formatNumberWithSpaces(unit.price_per_sqm)} сум/м²
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
                  <h3 className="text-lg font-bold text-brand-primary mb-3">
                    Выбранная квартира
                  </h3>

                  <div className="space-y-2 text-white/90">
                    <p className="text-sm">
                      <span className="font-semibold">Этаж:</span>{" "}
                      {selectedUnit.floor_number}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Площадь:</span>{" "}
                      {selectedUnit.area} м²
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Комнат:</span>{" "}
                      {selectedUnit.room_count}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Цена за м²:</span>{" "}
                      {formatNumberWithSpaces(selectedUnit.price_per_sqm)} сум
                    </p>
                  </div>

                  <div className="border-t border-slate-700/50 pt-4 space-y-3">
                    <p className="text-md font-bold text-white">
                      Общая стоимость:{" "}
                      {formatNumberWithSpaces(selectedUnit.total_price)} сум
                    </p>

                    <div className="space-y-2 text-white/90">
                      <p className="text-sm">
                        <span className="font-semibold">
                          Первоначальный взнос (30%):
                        </span>{" "}
                        {formatNumberWithSpaces(selectedUnit.initial_payment_30p)}{" "}
                        сум
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">
                          Ежемесячно (8 мес, 30%):
                        </span>{" "}
                        {formatNumberWithSpaces(
                          selectedUnit.monthly_payment_8mo_30p
                        )}{" "}
                        сум
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">
                          Оплата после кадастра (40%):
                        </span>{" "}
                        {formatNumberWithSpaces(selectedUnit.cadastre_payment_40p)}{" "}
                        сум
                      </p>
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
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                disabled={!selectedUnit}
              >
                Оставить заявку
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CostCalculatorSection;
