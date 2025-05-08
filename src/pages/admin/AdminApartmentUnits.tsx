
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatNumberWithSpaces } from "@/utils/format-utils";

// Define types for apartment unit
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
  created_at: string;
  updated_at: string;
}

// Validation schema for form
const apartmentUnitSchema = z.object({
  id: z.string().optional(),
  floor_number: z.number().int().min(1, "Минимальный этаж: 1").max(30, "Максимальный этаж: 30"),
  area: z.number().min(15, "Минимальная площадь: 15 м²"),
  room_count: z.number().int().min(1, "Минимум комнат: 1").max(6, "Максимум комнат: 6"),
  price_per_sqm: z.number().min(1000000, "Минимальная цена: 1000000 сум"),
  total_price: z.number().min(0),
  initial_payment_30p: z.number().min(0),
  monthly_payment_8mo_30p: z.number().min(0),
  cadastre_payment_40p: z.number().min(0)
});

type ApartmentUnitFormValues = z.infer<typeof apartmentUnitSchema>;

const AdminApartmentUnits: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentApartmentUnit, setCurrentApartmentUnit] = useState<ApartmentUnit | null>(null);

  // Form setup
  const form = useForm<ApartmentUnitFormValues>({
    resolver: zodResolver(apartmentUnitSchema),
    defaultValues: {
      floor_number: 1,
      area: 30,
      room_count: 1,
      price_per_sqm: 10000000,
      total_price: 0,
      initial_payment_30p: 0,
      monthly_payment_8mo_30p: 0,
      cadastre_payment_40p: 0
    }
  });

  // Auto-calculate other prices when area or price_per_sqm changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if ((name === 'area' || name === 'price_per_sqm') && value.area && value.price_per_sqm) {
        const area = value.area;
        const pricePerSqm = value.price_per_sqm;
        const totalPrice = Math.round(area * pricePerSqm);
        
        form.setValue('total_price', totalPrice);
        form.setValue('initial_payment_30p', Math.round(totalPrice * 0.3));
        form.setValue('cadastre_payment_40p', Math.round(totalPrice * 0.4));
        form.setValue('monthly_payment_8mo_30p', Math.round((totalPrice * 0.3) / 8));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Fetch apartment units
  const { data: apartmentUnits, isLoading } = useQuery({
    queryKey: ['apartmentUnits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .order('floor_number', { ascending: false })
        .order('area', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as ApartmentUnit[];
    }
  });

  // Create apartment unit
  const createApartmentUnitMutation = useMutation({
    mutationFn: async (values: Omit<ApartmentUnitFormValues, 'id'>) => {
      const { data, error } = await supabase
        .from('apartment_units')
        .insert(values)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartmentUnits'] });
      toast({ title: 'Квартира создана' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ 
        title: 'Ошибка', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update apartment unit
  const updateApartmentUnitMutation = useMutation({
    mutationFn: async (values: ApartmentUnitFormValues) => {
      const { id, ...updateData } = values;
      const { data, error } = await supabase
        .from('apartment_units')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartmentUnits'] });
      toast({ title: 'Квартира обновлена' });
      setIsDialogOpen(false);
      setCurrentApartmentUnit(null);
      form.reset();
    },
    onError: (error) => {
      toast({ 
        title: 'Ошибка', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Delete apartment unit
  const deleteApartmentUnitMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('apartment_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartmentUnits'] });
      toast({ title: 'Квартира удалена' });
      setIsDeleteDialogOpen(false);
      setCurrentApartmentUnit(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Ошибка', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Open the edit dialog
  const handleEdit = (unit: ApartmentUnit) => {
    setCurrentApartmentUnit(unit);
    form.reset({
      id: unit.id,
      floor_number: unit.floor_number,
      area: unit.area,
      room_count: unit.room_count,
      price_per_sqm: unit.price_per_sqm,
      total_price: unit.total_price,
      initial_payment_30p: unit.initial_payment_30p,
      monthly_payment_8mo_30p: unit.monthly_payment_8mo_30p,
      cadastre_payment_40p: unit.cadastre_payment_40p
    });
    setIsDialogOpen(true);
  };

  // Open the delete dialog
  const handleDelete = (unit: ApartmentUnit) => {
    setCurrentApartmentUnit(unit);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (values: ApartmentUnitFormValues) => {
    if (currentApartmentUnit) {
      // Update existing unit
      updateApartmentUnitMutation.mutate(values);
    } else {
      // Create new unit
      const { id, ...createData } = values;
      createApartmentUnitMutation.mutate(createData);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Управление квартирами</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setCurrentApartmentUnit(null);
                form.reset({
                  floor_number: 1,
                  area: 30,
                  room_count: 1,
                  price_per_sqm: 10000000,
                  total_price: 300000000,
                  initial_payment_30p: 90000000,
                  monthly_payment_8mo_30p: 11250000,
                  cadastre_payment_40p: 120000000
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Добавить квартиру
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {currentApartmentUnit ? 'Редактировать квартиру' : 'Добавить новую квартиру'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="floor_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Этаж</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Площадь (м²)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="room_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Количество комнат</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_per_sqm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цена за м² (сум)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="total_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Общая стоимость (сум)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="initial_payment_30p"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Первоначальный взнос 30% (сум)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthly_payment_8mo_30p"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ежемесячный платеж 8 мес. 30% (сум)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cadastre_payment_40p"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Кадастровый платеж 40% (сум)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createApartmentUnitMutation.isPending || updateApartmentUnitMutation.isPending}
                    >
                      {(createApartmentUnitMutation.isPending || updateApartmentUnitMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Сохранить
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Список квартир</CardTitle>
            <CardDescription>Всего квартир: {apartmentUnits?.length || 0}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Этаж</TableHead>
                      <TableHead>Площадь (м²)</TableHead>
                      <TableHead>Комнат</TableHead>
                      <TableHead>Цена за м²</TableHead>
                      <TableHead>Общая цена</TableHead>
                      <TableHead>Первый взнос</TableHead>
                      <TableHead>Ежемесячно</TableHead>
                      <TableHead>Кадастр</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apartmentUnits?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          Нет данных
                        </TableCell>
                      </TableRow>
                    )}
                    {apartmentUnits?.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell>{unit.floor_number}</TableCell>
                        <TableCell>{unit.area}</TableCell>
                        <TableCell>{unit.room_count}</TableCell>
                        <TableCell>{formatNumberWithSpaces(unit.price_per_sqm)}</TableCell>
                        <TableCell>{formatNumberWithSpaces(unit.total_price)}</TableCell>
                        <TableCell>{formatNumberWithSpaces(unit.initial_payment_30p)}</TableCell>
                        <TableCell>{formatNumberWithSpaces(unit.monthly_payment_8mo_30p)}</TableCell>
                        <TableCell>{formatNumberWithSpaces(unit.cadastre_payment_40p)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleEdit(unit)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleDelete(unit)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить квартиру</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Вы уверены, что хотите удалить эту квартиру?</p>
            {currentApartmentUnit && (
              <p className="mt-2 text-sm text-slate-500">
                Этаж: {currentApartmentUnit.floor_number}, 
                Площадь: {currentApartmentUnit.area} м², 
                Комнат: {currentApartmentUnit.room_count}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={() => currentApartmentUnit && deleteApartmentUnitMutation.mutate(currentApartmentUnit.id)}
              disabled={deleteApartmentUnitMutation.isPending}
            >
              {deleteApartmentUnitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminApartmentUnits;
