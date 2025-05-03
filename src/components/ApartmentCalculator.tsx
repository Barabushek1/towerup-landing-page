
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumberWithSpaces } from "@/utils/format-utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApartmentCalculatorProps {
  defaultPricePerSqm?: number;
  defaultArea?: number;
  apartmentType?: string;
  className?: string;
}

const ApartmentCalculator: React.FC<ApartmentCalculatorProps> = ({
  defaultPricePerSqm = 12000000, // 12 million sum
  defaultArea = 50,
  apartmentType = "1-комнатные",
  className,
}) => {
  const [area, setArea] = useState(defaultArea);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Fetch prices from Supabase
  const { data: floorPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['floorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('floor_prices')
        .select('*');
      
      if (error) {
        console.error("Error fetching floor prices:", error);
        throw new Error(`Error fetching floor prices: ${error.message}`);
      }
      
      return data;
    }
  });
  
  // Get the current price per sqm for the specified apartment type
  const getPricePerSqm = () => {
    if (pricesLoading || !floorPrices) return defaultPricePerSqm;
    
    const priceData = floorPrices.find(price => price.apartment_type === apartmentType);
    return priceData ? priceData.price_per_sqm : defaultPricePerSqm;
  };
  
  const pricePerSqm = getPricePerSqm();
  
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

  return (
    <Card className={`border-slate-700/30 bg-[#1a1a1a] shadow-lg ${className}`}>
      <CardHeader className="bg-[#131313] border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="text-brand-primary" />
          Калькулятор стоимости
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {pricesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
            <span className="ml-2">Загрузка цен...</span>
          </div>
        ) : (
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
              <label className="text-sm font-medium text-white">Цена за м²</label>
              <div className="px-2 py-3 bg-[#222] border border-slate-700/50 rounded-md text-white">
                {formatNumberWithSpaces(pricePerSqm)} сум/м²
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
        )}
      </CardContent>
    </Card>
  );
};

export default ApartmentCalculator;
