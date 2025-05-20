
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, Calculator } from 'lucide-react';
import { formatNumberWithSpaces } from '@/utils/format-utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ApartmentType {
  value: string;
  label: string;
}

const apartmentTypes: ApartmentType[] = [
  { value: '1-комнатные', label: '1-комнатные' },
  { value: '2-комнатные', label: '2-комнатные' },
  { value: '3-комнатные', label: '3-комнатные' },
];

const paymentPlans = [
  { id: 'full', name: 'Единовременная оплата', discount: 0 },
  { id: 'installment', name: 'Рассрочка', discount: 0 },
];

interface FloorPrices {
  [key: string]: number;
}

const PriceCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(apartmentTypes[0].value);
  const [area, setArea] = useState<number>(35);
  const [pricePerSqm, setPricePerSqm] = useState<number>(12000000);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [cadastrePayment, setCadastrePayment] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0].id);

  // Fetch prices from database
  const { data: floorPrices } = useQuery({
    queryKey: ['yangiUzbekistanFloorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*');

      if (error) throw new Error(`Error fetching prices: ${error.message}`);

      const priceMap: FloorPrices = {};
      if (data) {
        data.forEach((item) => {
          priceMap[item.apartment_type] = item.price_per_sqm;
        });
      }

      return priceMap;
    },
    initialData: {
      '1-комнатные': 12000000,
      '2-комнатные': 11500000,
      '3-комнатные': 11000000,
    },
  });

  // Handle apartment type change
  useEffect(() => {
    if (floorPrices && floorPrices[activeTab]) {
      setPricePerSqm(floorPrices[activeTab]);
    }
  }, [activeTab, floorPrices]);

  // Calculate prices
  useEffect(() => {
    const calculatedTotal = area * pricePerSqm;
    setTotalPrice(calculatedTotal);

    // Calculate installment payments (30% initial, 30% in 8 months, 40% cadastre)
    const initialPaymentAmount = calculatedTotal * 0.3;
    setInitialPayment(initialPaymentAmount);

    const monthlyPaymentAmount = (calculatedTotal * 0.3) / 8;
    setMonthlyPayment(monthlyPaymentAmount);

    const cadastrePaymentAmount = calculatedTotal * 0.4;
    setCadastrePayment(cadastrePaymentAmount);
  }, [area, pricePerSqm]);

  return (
    <section className="py-16 bg-opacity-80 backdrop-blur-sm relative z-10" id="calculator">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
            Расчет стоимости
          </h2>

          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl text-white gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                Калькулятор стоимости квартиры
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Apartment Type Selection */}
              <Tabs
                defaultValue={apartmentTypes[0].value}
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  {apartmentTypes.map((type) => (
                    <TabsTrigger key={type.value} value={type.value}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {apartmentTypes.map((type) => (
                  <TabsContent key={type.value} value={type.value} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="area" className="text-base mb-2 block">
                          Площадь (м²)
                        </Label>
                        <Input
                          id="area"
                          type="number"
                          value={area}
                          onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                          className="bg-slate-700"
                        />
                        <p className="text-sm text-slate-400 mt-1">
                          Цена за м²: {formatNumberWithSpaces(pricePerSqm)} сум
                        </p>
                      </div>

                      <div className="bg-slate-700/50 p-4 rounded-md flex flex-col h-full">
                        <span className="text-sm text-slate-300 mb-1">Итоговая стоимость:</span>
                        <span className="text-2xl font-bold text-white">
                          от {formatNumberWithSpaces(totalPrice)} сум
                        </span>
                        <span className="text-sm text-slate-400 mt-auto">
                          *окончательная цена может отличаться в зависимости от этажа и особенностей квартиры
                        </span>
                      </div>
                    </div>

                    {/* Payment Plans */}
                    <div className="bg-slate-700/30 p-4 rounded-md mt-8">
                      <h4 className="font-medium mb-4 text-lg">Рассчитать рассрочку</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-4">
                            {paymentPlans.map((plan) => (
                              <div key={plan.id} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={plan.id}
                                  name="paymentPlan"
                                  checked={selectedPlan === plan.id}
                                  onChange={() => setSelectedPlan(plan.id)}
                                  className="text-primary"
                                />
                                <Label htmlFor={plan.id} className="text-base cursor-pointer">
                                  {plan.name}
                                  {plan.discount > 0 && (
                                    <span className="text-primary ml-1">(-{plan.discount}%)</span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-700/50 p-4 rounded-md">
                          {selectedPlan === 'installment' ? (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-300">Первоначальный взнос (30%):</span>
                                <span className="font-medium">
                                  {formatNumberWithSpaces(initialPayment)} сум
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-300">8 платежей по (30%):</span>
                                <span className="font-medium">
                                  {formatNumberWithSpaces(monthlyPayment)} сум
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-300">При получении кадастра (40%):</span>
                                <span className="font-medium">
                                  {formatNumberWithSpaces(cadastrePayment)} сум
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center h-full">
                              <span className="text-slate-300">Полная стоимость:</span>
                              <span className="text-xl font-semibold">
                                от {formatNumberWithSpaces(totalPrice)} сум
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto mt-4">
                      Связаться с менеджером <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
