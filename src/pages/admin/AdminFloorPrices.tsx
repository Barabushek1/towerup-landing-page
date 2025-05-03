
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
import { Settings } from "lucide-react";

// Example floor plan types - these would typically come from a database
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
  
  // Example: In a real app, these would be loaded from and saved to a database
  const [prices, setPrices] = useState({
    "1-комнатные": 12000000,
    "2-комнатные": 12000000,
    "3-комнатные": 12000000,
  });

  // Create a form for each tab
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      pricePerSqm: prices[currentTab as keyof typeof prices],
    },
  });

  // Update form values when tab changes
  useEffect(() => {
    form.reset({
      pricePerSqm: prices[currentTab as keyof typeof prices],
    });
  }, [currentTab, form, prices]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const onSubmit = (data: PriceFormValues) => {
    // Update the price for the current floor plan type
    setPrices({
      ...prices,
      [currentTab]: data.pricePerSqm,
    });

    // In a real app, you would send this to a database or API
    // For example: supabase.from('prices').upsert({ type: currentTab, price_per_sqm: data.pricePerSqm })

    toast({
      title: "Цена обновлена",
      description: `Новая цена для ${currentTab}: ${formatPricePerSqm(data.pricePerSqm)}`,
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Управление ценами планировок</h1>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Настройки цен за квадратный метр
            </CardTitle>
            <CardDescription>
              Установите цены за квадратный метр для разных типов квартир
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6 bg-slate-700">
                {floorPlanTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id}>
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
                            <FormLabel>Цена за м² ({type.label})</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <Slider
                                  min={1000000}
                                  max={50000000}
                                  step={100000}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                  className="flex-1"
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value / 1000000}
                                  onChange={(e) => field.onChange(Number(e.target.value) * 1000000)}
                                  className="w-24 bg-slate-700 border-slate-600"
                                />
                              </FormControl>
                              <span className="text-sm text-slate-400">млн сум</span>
                            </div>
                            <FormDescription className="text-sm text-slate-400 mt-2">
                              Текущая цена: {formatPricePerSqm(field.value)}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-slate-700/50 p-4 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Примеры расчета стоимости:</h4>
                        <div className="space-y-2">
                          {type.id === "1-комнатные" && (
                            <>
                              <p className="text-sm">31 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(31 * form.watch("pricePerSqm"))} сум</p>
                              <p className="text-sm">39 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(39 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                          {type.id === "2-комнатные" && (
                            <>
                              <p className="text-sm">58 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(58 * form.watch("pricePerSqm"))} сум</p>
                              <p className="text-sm">65 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(65 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                          {type.id === "3-комнатные" && (
                            <>
                              <p className="text-sm">85 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(85 * form.watch("pricePerSqm"))} сум</p>
                              <p className="text-sm">95 м² × {formatNumberWithSpaces(form.watch("pricePerSqm"))} сум/м² = {formatNumberWithSpaces(95 * form.watch("pricePerSqm"))} сум</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button type="submit">Сохранить</Button>
                    </form>
                  </Form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t border-slate-700 pt-4">
            <p className="text-sm text-slate-400 mb-2">
              * В реальном приложении эти цены будут сохраняться в базе данных и применяться к планировкам на сайте
            </p>
            <p className="text-sm text-slate-400">
              * Для интеграции с реальной базой данных необходимо реализовать соответствующий API
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFloorPrices;
