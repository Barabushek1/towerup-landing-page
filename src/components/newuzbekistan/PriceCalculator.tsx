
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PriceInfo {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
}

interface PriceCalculatorProps {
  className?: string;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ className }) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>("");
  const [area, setArea] = useState<number>(50);
  const [pricePerSqm, setPricePerSqm] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [priceInfo, setPriceInfo] = useState<PriceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch price data from Supabase
  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_prices')
          .select('*')
          .order('apartment_type', { ascending: true });
          
        if (error) throw error;
        
        setPriceInfo(data || []);
        if (data && data.length > 0) {
          setSelectedType(data[0].apartment_type);
          setPricePerSqm(data[0].price_per_sqm);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPriceData();
  }, []);
  
  // Calculate total price
  useEffect(() => {
    setTotalPrice(pricePerSqm * area);
  }, [pricePerSqm, area]);
  
  // Update price per sqm when apartment type changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    const selected = priceInfo.find(item => item.apartment_type === value);
    if (selected) {
      setPricePerSqm(selected.price_per_sqm);
    }
  };
  
  // Handle area input
  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setArea(value);
    } else {
      setArea(0);
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Калькулятор стоимости</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Загрузка данных...</div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apartment-type">Тип квартиры</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger id="apartment-type">
                  <SelectValue placeholder="Выберите тип квартиры" />
                </SelectTrigger>
                <SelectContent>
                  {priceInfo.map((item) => (
                    <SelectItem key={item.id} value={item.apartment_type}>
                      {item.apartment_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Площадь квартиры (м²)</Label>
              <div className="relative">
                <input
                  id="area"
                  type="number"
                  min="10"
                  value={area}
                  onChange={handleAreaChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">м²</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-500">Стоимость за м²</p>
                <p className="text-lg font-medium">{new Intl.NumberFormat('ru-RU').format(pricePerSqm)} сум</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Общая стоимость</p>
                <p className="text-xl font-semibold text-primary">{new Intl.NumberFormat('ru-RU').format(totalPrice)} сум</p>
              </div>
            </div>
            
            <div className="pt-4 text-sm text-gray-500">
              <p>Расчет является приблизительным и может отличаться от окончательной стоимости. Для получения точной информации обратитесь к нашим менеджерам.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
