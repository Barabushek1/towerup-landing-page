
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formatNumberWithSpaces, formatPricePerSqm } from "@/utils/format-utils";
import { Settings, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define types for floor price data
interface FloorPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
}

// Floor plan types
const floorPlanTypes = [
  { id: "1-комнатные", label: "1-комнатные" },
  { id: "2-комнатные", label: "2-комнатные" },
  { id: "3-комнатные", label: "3-комнатные" },
];

const priceSchema = z.object({
  pricePerSqm: z.number().min(1000000, "Минимальная цена 1 млн сум").max(50000000, "Максимальная цена 50 млн сум"),
});

type PriceFormValues = z.infer<typeof priceSchema>;

const AdminFloorPrices = () => {
  const [currentTab, setCurrentTab] = useState("1-комнатные");
  const queryClient = useQueryClient();
  
  // Fetch floor prices from Supabase
  const { data: floorPrices, isLoading, error } = useQuery({
    queryKey: ['floorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('floor_prices')
        .select('*');
      
      if (error) {
        throw new Error(`Error fetching floor prices: ${error.message}`);
      }
      
      return data as FloorPrice[];
    },
  });

  // Create a mutation to update floor prices
  const updatePriceMutation = useMutation({
    mutationFn: async ({ apartment_type, price_per_sqm }: { apartment_type: string, price_per_sqm: number }) => {
      const { data, error } = await supabase
        .from('floor_prices')
        .update({ price_per_sqm })
        .eq('apartment_type', apartment_type)
        .select();
      
      if (error) {
        throw new Error(`Error updating floor price: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch the floor prices data
      queryClient.invalidateQueries({ queryKey: ['floorPrices'] });
      
      toast({
        title: "Цена обновлена",
        description: `Новая цена для ${currentTab} успешно сохранена`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create a form for each tab
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      pricePerSqm: 12000000, // Default value before loading
    },
  });

  // Update form values when tab changes or data is loaded
  useEffect(() => {
    if (floorPrices) {
      const currentPrice = floorPrices.find(
        (price) => price.apartment_type === currentTab
      );
      
      if (currentPrice) {
        form.reset({
          pricePerSqm: currentPrice.price_per_sqm,
        });
      }
    }
  }, [currentTab, floorPrices, form]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const onSubmit = (data: PriceFormValues) => {
    updatePriceMutation.mutate({
      apartment_type: currentTab,
      price_per_sqm: data.pricePerSqm,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Загрузка цен...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-500 text-red-700 p-4 rounded-md">
            <p>Ошибка загрузки данных: {error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl sm:text-2xl font-bold">Управление ценами планировок</h1>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="h-5 w-5 text-primary" />
              Настройки цен за квадратный метр
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Установите цены за квадратный метр для разных типов квартир
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 bg-slate-700 w-full flex justify-start overflow-x-auto">
                {floorPlanTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="flex-1 min-w-[120px]">
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {floorPlanTypes.map((type) => (
                <TabsContent key={type.id} value={type.id}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="pricePerSqm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base sm:text-lg">Цена за м² ({type.label})</FormLabel>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <FormControl className="w-full">
                                <Slider
                                  min={1000000}
                                  max={50000000}
                                  step={100000}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                  className="flex-1"
                                />
                              </FormControl>
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value / 1000000}
                                    onChange={(e) => field.onChange(Number(e.target.value) * 1000000)}
                                    className="w-24 bg-slate-700 border-slate-600"
                                  />
                                </FormControl>
                                <span className="text-sm text-slate-400 whitespace-nowrap">млн сум</span>
                              </div>
                            </div>
                            <FormDescription className="text-sm text-slate-400 mt-2">
                              Текущая цена: {formatPricePerSqm(field.value)}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-slate-700/50 p-4 rounded-md">
                        <h4 className="text-sm font-medium mb-3">Примеры расчета стоимости:</h4>
                        <div className="space-y-2 text-sm">
                          {type.id === "1-комнатные" && (
                            <>
                              <p>31 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(31 * form.watch("pricePerSqm"))} сум</p>
                              <p>39 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(39 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                          {type.id === "2-комнатные" && (
                            <>
                              <p>58 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(58 * form.watch("pricePerSqm"))} сум</p>
                              <p>65 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(65 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                          {type.id === "3-комнатные" && (
                            <>
                              <p>85 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(85 * form.watch("pricePerSqm"))} сум</p>
                              <p>95 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(95 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={updatePriceMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        {updatePriceMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Сохранение...
                          </>
                        ) : (
                          'Сохранить'
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t border-slate-700 pt-4">
            <p className="text-xs sm:text-sm text-slate-400 mb-2">
              * Цены автоматически обновляются в базе данных и применяются к планировкам на сайте
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFloorPrices;
