
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
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

type FloorPlanFormValues = z.infer<typeof floorPlanSchema>;

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
  is_active?: boolean;
}

// Available room types
const roomTypes = ['1-комнатные', '2-комнатные', '3-комнатные', '4-комнатные'];

const AdminYangiUzbekistanFloorPlans: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form
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

  // Create/Update floor plan mutation
  const floorPlanMutation = useMutation({
    mutationFn: async (values: FloorPlanFormValues) => {
      if (isEditMode && selectedFloorPlan) {
        // Update existing floor plan
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_plans')
          .update({
            title: values.title,
            subtitle: values.subtitle,
            area: values.area,
            room_type: values.room_type,
            image_url: values.image_url,
            display_order: values.display_order
          })
          .eq('id', selectedFloorPlan.id)
          .select();

        if (error) throw new Error(error.message);
        return data;
      } else {
        // Create new floor plan with all required fields
        const { data, error } = await supabase
          .from('yangi_uzbekistan_floor_plans')
          .insert({
            title: values.title,
            subtitle: values.subtitle,
            area: values.area,
            room_type: values.room_type,
            image_url: values.image_url,
            display_order: values.display_order,
            is_active: true,
            area_label: 'площадь'
          })
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

  // Update display order mutations
  const updateOrderMutation = useMutation({
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
        description: `Не удалось обновить порядок: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: FloorPlanFormValues) => {
    floorPlanMutation.mutate(values);
  };

  // Reset form and edit state
  const resetFloorPlanForm = () => {
    floorPlanForm.reset({
      title: '',
      subtitle: 'квартира',
      area: 0,
      room_type: '1-комнатные',
      image_url: '',
      display_order: floorPlans ? floorPlans.length : 0,
    });
    setIsEditMode(false);
    setSelectedFloorPlan(null);
  };

  // Set form values when editing
  useEffect(() => {
    if (selectedFloorPlan && isEditMode) {
      floorPlanForm.reset({
        title: selectedFloorPlan.title,
        subtitle: selectedFloorPlan.subtitle,
        area: selectedFloorPlan.area,
        room_type: selectedFloorPlan.room_type,
        image_url: selectedFloorPlan.image_url,
        display_order: selectedFloorPlan.display_order,
      });
    }
  }, [selectedFloorPlan, isEditMode, floorPlanForm]);

  // Handle move up/down
  const handleMove = (id: string, currentOrder: number, direction: 'up' | 'down') => {
    if (!floorPlans) return;
    
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the plan that currently has the target order
    const planToSwap = floorPlans.find(p => p.display_order === newOrder);
    
    if (planToSwap) {
      // Swap the orders
      updateOrderMutation.mutate({ id: planToSwap.id, newOrder: currentOrder });
    }
    
    updateOrderMutation.mutate({ id, newOrder });
  };

  // Render loading state
  if (isLoadingFloorPlans) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Загрузка данных...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Управление планировками - Yangi Uzbekistan</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plans Form */}
          <Card className="col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">
                {isEditMode ? 'Редактировать планировку' : 'Добавить новую планировку'}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? 'Обновите информацию о планировке'
                  : 'Заполните форму для добавления новой планировки'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...floorPlanForm}>
                <form onSubmit={floorPlanForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={floorPlanForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Квартира А" className="bg-slate-700 border-slate-600" />
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
                          <Input {...field} placeholder="квартира" className="bg-slate-700 border-slate-600" />
                        </FormControl>
                        <FormDescription>Обычно "квартира" или "апартаменты"</FormDescription>
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
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600"
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
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomTypes.map(type => (
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
                      <FormItem>
                        <FormLabel>URL изображения</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.png" className="bg-slate-700 border-slate-600" />
                        </FormControl>
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
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={floorPlanMutation.isPending}>
                      {floorPlanMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? 'Сохранение...' : 'Создание...'}
                        </>
                      ) : (
                        isEditMode ? 'Сохранить изменения' : 'Добавить планировку'
                      )}
                    </Button>
                    {isEditMode && (
                      <Button type="button" variant="outline" onClick={resetFloorPlanForm}>
                        Отменить
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Floor Plans List */}
          <Card className="col-span-1 lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">Существующие планировки</CardTitle>
              <CardDescription>
                Управление существующими планировками
              </CardDescription>
            </CardHeader>
            <CardContent>
              {floorPlans && floorPlans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Порядок</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Площадь</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {floorPlans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell className="flex items-center gap-2">
                          <span>{plan.display_order}</span>
                          <div className="flex flex-col">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleMove(plan.id, plan.display_order, 'up')}
                              disabled={plan.display_order === Math.min(...floorPlans.map(p => p.display_order))}
                              className="h-5 w-5"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleMove(plan.id, plan.display_order, 'down')}
                              disabled={plan.display_order === Math.max(...floorPlans.map(p => p.display_order))}
                              className="h-5 w-5"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{plan.title}</TableCell>
                        <TableCell>{plan.room_type}</TableCell>
                        <TableCell>{plan.area} м²</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setSelectedFloorPlan(plan);
                                setIsEditMode(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setSelectedFloorPlan(plan);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Нет доступных планировок</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Удалить планировку</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить "{selectedFloorPlan?.title}"? Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
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
    </AdminLayout>
  );
};

export default AdminYangiUzbekistanFloorPlans;
