
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Schema for floor plan form
const floorPlanSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  subtitle: z.string().default('квартира'),
  area: z.coerce.number().min(1, 'Площадь должна быть больше 0'),
  room_type: z.string().min(1, 'Тип комнаты обязателен'),
  image_url: z.string().url('Должна быть допустимая ссылка на изображение'),
  display_order: z.coerce.number().int().default(0),
});

// Schema for price form
const priceSchema = z.object({
  apartment_type: z.string().min(1, 'Тип апартаментов обязателен'),
  price_per_sqm: z.coerce.number().min(1, 'Цена за м² должна быть больше 0'),
});

type FloorPlanFormValues = z.infer<typeof floorPlanSchema>;
type PriceFormValues = z.infer<typeof priceSchema>;

// Floor plan interface
interface FloorPlan {
  id: string;
  title: string;
  subtitle: string;
  area: number;
  room_type: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Floor price interface
interface FloorPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
  created_at: string;
  updated_at: string;
}

// Available room types
const roomTypes = ['1-комнатные', '2-комнатные', '3-комнатные', '4-комнатные'];

const AdminYangiUzbekistanFloorPlans: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('floorPlans');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Forms
  const floorPlanForm = useForm<FloorPlanFormValues>({
    resolver: zodResolver(floorPlanSchema),
    defaultValues: {
      title: '',
      subtitle: 'квартира',
      area: 0,
      room_type: '1-комнатные',
      image_url: '',
      display_order: 0,
    },
  });

  const priceForm = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      apartment_type: '1-комнатные',
      price_per_sqm: 0,
    },
  });

  // Fetch floor plans
  const { data: floorPlans, isLoading: isLoadingFloorPlans } = useQuery({
    queryKey: ['yangiUzbekistanFloorPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_plans')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw new Error(error.message);
      return data as FloorPlan[];
    },
  });

  // Fetch floor prices
  const { data: floorPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['yangiUzbekistanFloorPrices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*');

      if (error) throw new Error(error.message);
      return data as FloorPrice[];
    },
  });

  // Create/Update floor plan mutation
  const floorPlanMutation = useMutation({
    mutationFn: async (values: FloorPlanFormValues) => {
      if (isEditMode && selectedFloorPlan) {
        // Update existing floor plan
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_plans')
          .update(values)
          .eq('id', selectedFloorPlan.id)
          .select();

        if (error) throw new Error(error.message);
        return data;
      } else {
        // Create new floor plan
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_plans')
          .insert([values]) // Fixed: Wrap values in an array for insert
          .select();

        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yangiUzbekistanFloorPlans'] });
      toast({
        title: isEditMode ? 'Планировка обновлена' : 'Планировка создана',
        description: isEditMode
          ? 'Планировка успешно обновлена'
          : 'Новая планировка успешно добавлена',
      });
      resetFloorPlanForm();
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось ${isEditMode ? 'обновить' : 'создать'} планировку: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Create/Update price mutation
  const priceMutation = useMutation({
    mutationFn: async (values: PriceFormValues) => {
      const existingPrice = floorPrices?.find(
        (p) => p.apartment_type === values.apartment_type
      );

      if (existingPrice) {
        // Update existing price
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_prices')
          .update({ price_per_sqm: values.price_per_sqm })
          .eq('id', existingPrice.id)
          .select();

        if (error) throw new Error(error.message);
        return data;
      } else {
        // Create new price - Fixed: Wrap values in an array for insert
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_prices')
          .insert([values])
          .select();

        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yangiUzbekistanFloorPrices'] });
      toast({
        title: 'Цена обновлена',
        description: 'Цена за квадратный метр успешно обновлена',
      });
      priceForm.reset({
        apartment_type: '1-комнатные',
        price_per_sqm: 0,
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось обновить цену: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete floor plan mutation
  const deleteFloorPlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('yangi_uzbekistan_floor_plans')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yangiUzbekistanFloorPlans'] });
      toast({
        title: 'Планировка удалена',
        description: 'Планировка успешно удалена',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось удалить планировку: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Reorder floor plans mutation
  const reorderFloorPlanMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('yangi_uzbekistan_floor_plans')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { id, newOrder };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yangiUzbekistanFloorPlans'] });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось изменить порядок: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Edit floor plan
  const handleEditFloorPlan = (floorPlan: FloorPlan) => {
    setSelectedFloorPlan(floorPlan);
    setIsEditMode(true);
    floorPlanForm.reset({
      title: floorPlan.title,
      subtitle: floorPlan.subtitle || 'квартира',
      area: floorPlan.area,
      room_type: floorPlan.room_type,
      image_url: floorPlan.image_url,
      display_order: floorPlan.display_order,
    });
  };

  // Reset floor plan form
  const resetFloorPlanForm = () => {
    setIsEditMode(false);
    setSelectedFloorPlan(null);
    floorPlanForm.reset({
      title: '',
      subtitle: 'квартира',
      area: 0,
      room_type: '1-комнатные',
      image_url: '',
      display_order: 0,
    });
  };

  // Handle price change
  const handleEditPrice = (price: FloorPrice) => {
    priceForm.reset({
      apartment_type: price.apartment_type,
      price_per_sqm: price.price_per_sqm,
    });
  };

  // Move floor plan up/down in order
  const handleReorder = (floorPlan: FloorPlan, direction: 'up' | 'down') => {
    if (!floorPlans) return;

    const sameCategoryPlans = floorPlans.filter(
      (p) => p.room_type === floorPlan.room_type
    ).sort((a, b) => a.display_order - b.display_order);

    const currentIndex = sameCategoryPlans.findIndex((p) => p.id === floorPlan.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sameCategoryPlans.length - 1)
    ) {
      return; // Already at the top/bottom
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetPlan = sameCategoryPlans[targetIndex];

    // Swap display orders
    reorderFloorPlanMutation.mutate({ id: floorPlan.id, newOrder: targetPlan.display_order });
    reorderFloorPlanMutation.mutate({ id: targetPlan.id, newOrder: floorPlan.display_order });
  };

  // Get filtered floor plans by room type
  const getFilteredFloorPlans = (roomType: string) => {
    if (!floorPlans) return [];
    return floorPlans.filter((p) => p.room_type === roomType).sort((a, b) => a.display_order - b.display_order);
  };

  // Format price with spaces
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Управление планировками Yangi Uzbekistan</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="floorPlans">Планировки</TabsTrigger>
          <TabsTrigger value="prices">Цены</TabsTrigger>
        </TabsList>

        {/* Floor Plans Management */}
        <TabsContent value="floorPlans" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {isEditMode ? 'Редактировать планировку' : 'Добавить новую планировку'}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? 'Измените информацию о планировке и нажмите "Сохранить"'
                  : 'Заполните форму, чтобы добавить новую планировку'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...floorPlanForm}>
                <form
                  onSubmit={floorPlanForm.handleSubmit((data) => floorPlanMutation.mutate(data))}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={floorPlanForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Например: Квартира А"
                              className="bg-slate-700 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={floorPlanForm.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подзаголовок</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Например: квартира"
                              className="bg-slate-700 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={floorPlanForm.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Площадь (м²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Например: 35.5"
                              className="bg-slate-700 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={floorPlanForm.control}
                      name="room_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип комнаты</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue placeholder="Выберите тип комнаты" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={floorPlanForm.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>URL изображения</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 bg-slate-700 border-slate-600"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Укажите полную ссылку на изображение планировки
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={floorPlanForm.control}
                      name="display_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Порядок отображения</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-slate-700 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Определяет порядок отображения планировок (меньшее значение = первее)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetFloorPlanForm}
                      >
                        Отмена
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={floorPlanMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {floorPlanMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? 'Сохранение...' : 'Создание...'}
                        </>
                      ) : (
                        <>
                          {isEditMode ? 'Сохранить изменения' : 'Добавить планировку'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {roomTypes.map((roomType) => {
              const filteredPlans = getFilteredFloorPlans(roomType);
              if (filteredPlans.length === 0) return null;

              return (
                <Card key={roomType} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">{roomType}</CardTitle>
                    <CardDescription>
                      Список существующих планировок для {roomType.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingFloorPlans ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Порядок</TableHead>
                              <TableHead>Название</TableHead>
                              <TableHead>Площадь</TableHead>
                              <TableHead>Изображение</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPlans.map((plan) => (
                              <TableRow key={plan.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-1">
                                    <span>{plan.display_order}</span>
                                    <div className="flex flex-col ml-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => handleReorder(plan, 'up')}
                                        disabled={
                                          filteredPlans.indexOf(plan) === 0 ||
                                          reorderFloorPlanMutation.isPending
                                        }
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => handleReorder(plan, 'down')}
                                        disabled={
                                          filteredPlans.indexOf(plan) === filteredPlans.length - 1 ||
                                          reorderFloorPlanMutation.isPending
                                        }
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {plan.title}
                                  <span className="text-slate-400 text-xs ml-1">
                                    {plan.subtitle}
                                  </span>
                                </TableCell>
                                <TableCell>{plan.area} м²</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <img
                                      src={plan.image_url}
                                      alt={plan.title}
                                      className="h-12 w-12 object-contain bg-slate-900 rounded border border-slate-700"
                                    />
                                    <a
                                      href={plan.image_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-xs text-primary hover:underline"
                                    >
                                      Просмотр
                                    </a>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditFloorPlan(plan)}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      <span className="sr-only md:not-sr-only md:inline-block">
                                        Изменить
                                      </span>
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedFloorPlan(plan);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      <span className="sr-only md:not-sr-only md:inline-block">
                                        Удалить
                                      </span>
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
              );
            })}
          </div>
        </TabsContent>

        {/* Prices Management */}
        <TabsContent value="prices" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Управление ценами</CardTitle>
              <CardDescription>
                Установите цены за квадратный метр для разных типов квартир
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...priceForm}>
                <form
                  onSubmit={priceForm.handleSubmit((data) => priceMutation.mutate(data))}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={priceForm.control}
                      name="apartment_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип квартиры</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue placeholder="Выберите тип квартиры" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={priceForm.control}
                      name="price_per_sqm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цена за м²</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Например: 12000000"
                              className="bg-slate-700 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Введите цену в сумах за квадратный метр
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={priceMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {priceMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить цену'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <Separator className="my-6" />

              <div className="overflow-x-auto">
                <h3 className="text-lg font-medium mb-4">Текущие цены</h3>
                {isLoadingPrices ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тип квартиры</TableHead>
                        <TableHead>Цена за м²</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floorPrices && floorPrices.length > 0 ? (
                        floorPrices.map((price) => (
                          <TableRow key={price.id}>
                            <TableCell className="font-medium">{price.apartment_type}</TableCell>
                            <TableCell>{formatPrice(price.price_per_sqm)} сум/м²</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPrice(price)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Изменить
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            Цены еще не установлены
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Вы уверены?</DialogTitle>
            <DialogDescription>
              Вы собираетесь удалить планировку "{selectedFloorPlan?.title}". Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedFloorPlan && deleteFloorPlanMutation.mutate(selectedFloorPlan.id)}
              disabled={deleteFloorPlanMutation.isPending}
            >
              {deleteFloorPlanMutation.isPending ? (
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
    </div>
  );
};

export default AdminYangiUzbekistanFloorPlans;
