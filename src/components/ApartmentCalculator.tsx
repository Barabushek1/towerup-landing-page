
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumberWithSpaces } from "@/utils/format-utils";

interface ApartmentCalculatorProps {
  defaultPricePerSqm?: number;
  defaultArea?: number;
  className?: string;
}

const ApartmentCalculator: React.FC<ApartmentCalculatorProps> = ({
  defaultPricePerSqm = 12000000, // 12 million sum
  defaultArea = 50,
  className,
}) => {
  const [pricePerSqm, setPricePerSqm] = useState(defaultPricePerSqm);
  const [area, setArea] = useState(defaultArea);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculatePrice();
  }, [pricePerSqm, area]);

  const calculatePrice = () => {
    const calculatedPrice = area * pricePerSqm;
    setTotalPrice(calculatedPrice);
  };

  const handleAreaChange = (newValue: number[]) => {
    setArea(newValue[0]);
  };

  const handleInputAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setArea(value);
    }
  };

  const handlePriceChange = (newValue: number[]) => {
    setPricePerSqm(newValue[0] * 1000000); // Convert to millions
  };

  const handleInputPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPricePerSqm(value * 1000000); // Convert to millions
    }
  };

  return (
    <Card className={`border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
      <CardHeader className="bg-[#131313] border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="text-brand-primary" />
          Калькулятор стоимости
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Площадь квартиры (м²)</label>
            <div className="flex items-center space-x-4">
              <Slider
                className="flex-grow"
                defaultValue={[area]}
                value={[area]}
                onValueChange={handleAreaChange}
                max={150}
                min={20}
                step={0.1}
              />
              <Input
                type="number"
                value={area}
                onChange={handleInputAreaChange}
                className="w-24 bg-[#222] border-slate-700/50 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Цена за м² (млн сум)</label>
            <div className="flex items-center space-x-4">
              <Slider
                className="flex-grow"
                defaultValue={[pricePerSqm / 1000000]}
                value={[pricePerSqm / 1000000]}
                onValueChange={handlePriceChange}
                max={25}
                min={5}
                step={0.1}
              />
              <Input
                type="number"
                value={pricePerSqm / 1000000}
                onChange={handleInputPriceChange}
                className="w-24 bg-[#222] border-slate-700/50 text-white"
              />
            </div>
          </div>

          <motion.div 
            className="bg-[#0f0f0f] p-5 rounded-lg border border-brand-primary/20"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-slate-300 mb-2">Итоговая стоимость:</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-bold text-brand-primary">
                {formatNumberWithSpaces(totalPrice)}
              </h3>
              <span className="text-white/70">сум</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {area} м² × {formatNumberWithSpaces(pricePerSqm)} сум/м²
            </p>
          </motion.div>

          <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
            Оставить заявку
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCalculator;
