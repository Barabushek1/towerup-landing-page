
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formatNumberWithSpaces } from "@/utils/format-utils";
import { Settings, Loader2, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define types for floor price data
interface FloorPrice {
  id: string;
  floor_number: number;
  room_count: number;
  price_per_sqm: number;
}

// All 16 floors
const floors = Array.from({ length: 16 }, (_, i) => ({
  id: (i + 1).toString(),
  label: `${i + 1} Этаж`,
  value: i + 1
})).reverse(); // Reverse to show highest floor first

// Room types
const roomTypes = [
  { id: "1", label: "1-комнатные", value: 1 },
  { id: "2", label: "2-комнатные", value: 2 },
  { id: "3", label: "3-комнатные", value: 3 },
];

const priceSchema = z.object({
  pricePerSqm: z.number().min(1000000, "Минимальная цена 1 млн сум").max(50000000, "Максимальная цена 50 млн сум"),
});

type PriceFormValues = z.infer<typeof priceSchema>;

const AdminFloorApartmentPrices = () => {
  const [currentFloor, setCurrentFloor] = useState("16");
  const [currentRoomType, setCurrentRoomType] = useState("1");
  const queryClient = useQueryClient();
  
  // Fetch all floor prices from Supabase
  const { data: floorPrices, isLoading, error } = useQuery({
    queryKey: ['floorApartmentPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('floor_apartment_prices')
        .select('*')
        .order('floor_number', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching floor prices: ${error.message}`);
      }
      
      return data as FloorPrice[];
    },
  });

  // Create a mutation to update floor prices
  const updatePriceMutation = useMutation({
    mutationFn: async ({ floor_number, room_count, price_per_sqm }: { floor_number: number, room_count: number, price_per_sqm: number }) => {
      const { data, error } = await supabase
        .from('floor_apartment_prices')
        .upsert({ floor_number, room_count, price_per_sqm })
        .select();
      
      if (error) {
        throw new Error(`Error updating floor price: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch the floor prices data
      queryClient.invalidateQueries({ queryKey: ['floorApartmentPrices'] });
      
      toast({
        title: "Цена обновлена",
        description: `Новая цена для ${currentFloor} этажа, ${currentRoomType}-комнатных квартир успешно сохранена`,
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

  // Create a form for price editing
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      pricePerSqm: 12000000, // Default value before loading
    },
  });

  // Update form values when floor/room type changes or data is loaded
  useEffect(() => {
    if (floorPrices) {
      const currentPrice = floorPrices.find(
        (price) => 
          price.floor_number === parseInt(currentFloor) && 
          price.room_count === parseInt(currentRoomType)
      );
      
      if (currentPrice) {
        form.reset({
          pricePerSqm: currentPrice.price_per_sqm,
        });
      } else {
        // Fallback default based on floor height and room count
        const basePrice = 12000000 + (parseInt(currentFloor) * 500000);
        form.reset({
          pricePerSqm: basePrice,
        });
      }
    }
  }, [currentFloor, currentRoomType, floorPrices, form]);

  const handleFloorChange = (value: string) => {
    setCurrentFloor(value);
  };

  const handleRoomTypeChange = (value: string) => {
    setCurrentRoomType(value);
  };

  const onSubmit = (data: PriceFormValues) => {
    updatePriceMutation.mutate({
      floor_number: parseInt(currentFloor),
      room_count: parseInt(currentRoomType),
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
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Управление ценами по этажам
            </h1>
            <p className="text-muted-foreground">Настройка цен для квартир разного типа на каждом этаже</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Цены за квадратный метр
            </CardTitle>
            <CardDescription>
              Установите цены за квадратный метр для разных типов квартир на каждом этаже
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentFloor} onValueChange={handleFloorChange} className="w-full">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Выберите этаж:</h3>
                <TabsList className="h-auto flex flex-wrap gap-2">
                  {floors.map((floor) => (
                    <TabsTrigger key={floor.id} value={floor.id} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      {floor.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Выберите тип квартиры:</h3>
                <div className="flex flex-wrap gap-2">
                  {roomTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={currentRoomType === type.id ? "default" : "outline"}
                      onClick={() => handleRoomTypeChange(type.id)}
                      className="min-w-[120px]"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  Установка цены для {currentFloor} этажа, {roomTypes.find(t => t.id === currentRoomType)?.label}
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="pricePerSqm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цена за м²</FormLabel>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="w-full"
                              />
                            </FormControl>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">сум</span>
                          </div>
                          <FormDescription>
                            С учетом форматирования: {formatNumberWithSpaces(field.value)} сум/м²
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-secondary/40 p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-3">Примеры расчета для выбранного этажа и типа квартиры:</h4>
                      <div className="space-y-2 text-sm">
                        {currentRoomType === "1" && (
                          <>
                            <p>31 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(31 * form.watch("pricePerSqm"))} сум</p>
                            <p>40 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(40 * form.watch("pricePerSqm"))} сум</p>
                          </>
                        )}
                        {currentRoomType === "2" && (
                          <>
                            <p>50 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(50 * form.watch("pricePerSqm"))} сум</p>
                            <p>55 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(55 * form.watch("pricePerSqm"))} сум</p>
                          </>
                        )}
                        {currentRoomType === "3" && (
                          <>
                            <p>67 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(67 * form.watch("pricePerSqm"))} сум</p>
                            <p>75 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(75 * form.watch("pricePerSqm"))} сум</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updatePriceMutation.isPending}
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
                    </div>
                  </form>
                </Form>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t pt-4">
            <p className="text-xs text-muted-foreground">
              * Цены автоматически обновляются в базе данных и применяются к квартирам на сайте
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFloorApartmentPrices;
