
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, MapPin, Briefcase, Loader2, Info, HelpCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/admin/ImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QUERY_KEYS, clearCache, invalidateCacheByPrefix } from '@/utils/cache-utils';

interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  salary_range?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  employment_type?: string; // Added employment type
  remote_status?: string; // Added remote status
}

interface VacancyInput {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  salary_range?: string;
  is_active: boolean;
  image_url?: string;
  employment_type?: string;
  remote_status?: string;
}

const AdminVacancies: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVacancyId, setCurrentVacancyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VacancyInput>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    salary_range: '',
    is_active: true,
    image_url: '',
    employment_type: 'Полная занятость',
    remote_status: 'Офис',
  });

  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.VACANCIES, 'admin'],
    queryFn: async () => {
      console.log('Admin: Fetching all vacancies...');
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
      }
      
      console.log('Admin: Fetched all vacancies:', data?.length);
      return data as Vacancy[];
    },
    staleTime: 1000 * 10, // Very short stale time - 10 seconds
    gcTime: 1000 * 30, // Keep in cache for 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const addVacancyMutation = useMutation({
    mutationFn: async (vacancy: VacancyInput) => {
      setIsSubmitting(true);
      try {
        console.log('Adding new vacancy:', vacancy.title);
        const { data, error } = await supabase
          .from('vacancies')
          .insert({
            title: vacancy.title,
            description: vacancy.description,
            requirements: vacancy.requirements || null,
            benefits: vacancy.benefits || null,
            location: vacancy.location || null,
            salary_range: vacancy.salary_range || null,
            is_active: vacancy.is_active,
            image_url: vacancy.image_url || null,
            employment_type: vacancy.employment_type || null,
            remote_status: vacancy.remote_status || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      // Invalidate all vacancy-related queries and clear cache
      console.log('Vacancy added successfully, invalidating related queries...');
      invalidateCacheByPrefix('vacancies');
      invalidateCacheByPrefix('vacancy');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES, 'admin'] });
      
      toast({
        title: "Вакансия добавлена",
        description: "Вакансия успешно добавлена в базу данных",
      });
      
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error adding vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить вакансию. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const updateVacancyMutation = useMutation({
    mutationFn: async ({ id, vacancy }: { id: string; vacancy: VacancyInput }) => {
      setIsSubmitting(true);
      try {
        console.log('Updating vacancy:', id, vacancy.title);
        const { data, error } = await supabase
          .from('vacancies')
          .update({
            title: vacancy.title,
            description: vacancy.description,
            requirements: vacancy.requirements || null,
            benefits: vacancy.benefits || null,
            location: vacancy.location || null,
            salary_range: vacancy.salary_range || null,
            is_active: vacancy.is_active,
            image_url: vacancy.image_url || null,
            employment_type: vacancy.employment_type || null,
            remote_status: vacancy.remote_status || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      console.log('Vacancy updated successfully, invalidating related queries...');
      // Invalidate all vacancy-related queries and clear cache
      invalidateCacheByPrefix('vacancies');
      invalidateCacheByPrefix('vacancy');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES, 'admin'] });
      
      toast({
        title: "Вакансия обновлена",
        description: "Вакансия успешно обновлена",
      });
      
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить вакансию. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const deleteVacancyMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsSubmitting(true);
      try {
        console.log('Deleting vacancy:', id);
        const { error } = await supabase
          .from('vacancies')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (data) => {
      console.log('Vacancy deleted successfully, invalidating related queries...', data);
      // Invalidate all vacancy-related queries and clear cache
      invalidateCacheByPrefix('vacancies');
      invalidateCacheByPrefix('vacancy');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES, 'admin'] });
      
      // Manually update the local data to reflect the deletion
      queryClient.setQueryData([QUERY_KEYS.VACANCIES, 'admin'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((vacancy: Vacancy) => vacancy.id !== currentVacancyId);
      });
      
      queryClient.setQueryData([QUERY_KEYS.VACANCIES], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((vacancy: Vacancy) => vacancy.id !== currentVacancyId);
      });
      
      toast({
        title: "Вакансия удалена",
        description: "Вакансия успешно удалена",
      });
      
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вакансию. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      benefits: '',
      location: '',
      salary_range: '',
      is_active: true,
      image_url: '',
      employment_type: 'Полная занятость',
      remote_status: 'Офис',
    });
    setCurrentVacancyId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (vacancy: Vacancy) => {
    setCurrentVacancyId(vacancy.id);
    setFormData({
      title: vacancy.title,
      description: vacancy.description,
      requirements: vacancy.requirements || '',
      benefits: vacancy.benefits || '',
      location: vacancy.location || '',
      salary_range: vacancy.salary_range || '',
      is_active: vacancy.is_active,
      image_url: vacancy.image_url || '',
      employment_type: vacancy.employment_type || 'Полная занятость',
      remote_status: vacancy.remote_status || 'Офис',
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCurrentVacancyId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля: название и описание",
        variant: "destructive",
      });
      return;
    }
    
    if (currentVacancyId) {
      updateVacancyMutation.mutate({ id: currentVacancyId, vacancy: formData });
    } else {
      addVacancyMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (currentVacancyId) {
      deleteVacancyMutation.mutate(currentVacancyId);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg border border-red-900">
        <h3 className="text-red-500">Ошибка загрузки данных</h3>
        <p className="text-slate-400 mt-2">Не удалось загрузить список вакансий. Пожалуйста, попробуйте позже.</p>
        <Button className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACANCIES, 'admin'] })}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Управление вакансиями</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить вакансию
        </Button>
      </div>

      {/* Field formatting instructions */}
      <Card className="mb-6 bg-slate-800 text-slate-100 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary" />
            Инструкции по форматированию
          </CardTitle>
          <CardDescription className="text-slate-400">
            Правила для создания вакансий, которые будут хорошо отображаться на сайте
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium text-slate-200 mb-1">Требования и Преимущества:</h3>
              <p className="text-sm text-slate-400">
                Используйте маркированные списки с дефисом для каждого пункта. Каждый пункт должен начинаться с новой строки со знаком "-".
              </p>
              <div className="mt-2 p-2 bg-slate-900 rounded-md text-slate-300">
                <pre className="text-xs">
                  {`- Опыт работы от 3-х лет\n- Высшее техническое образование\n- Знание AutoCAD, Revit`}
                </pre>
              </div>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium text-slate-200 mb-1">Описание вакансии:</h3>
              <p className="text-sm text-slate-400">
                Разделяйте абзацы пустой строкой. Можно использовать маркированные списки и подзаголовки.
              </p>
              <div className="mt-2 p-2 bg-slate-900 rounded-md text-slate-300">
                <pre className="text-xs">
                  {`Компания TOWERUP ищет опытного Архитектора для работы над проектами жилых комплексов.\n\nОБЯЗАННОСТИ:\n- Разработка архитектурных концепций\n- Подготовка проектной документации`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border border-slate-700 bg-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Локация</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacancies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                  Нет добавленных вакансий
                </TableCell>
              </TableRow>
            ) : (
              vacancies.map((vacancy) => (
                <TableRow key={vacancy.id}>
                  <TableCell className="font-medium">{vacancy.title}</TableCell>
                  <TableCell>{vacancy.location || '—'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${vacancy.is_active ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      {vacancy.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(vacancy.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(vacancy)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-500 hover:bg-red-950/30"
                        onClick={() => openDeleteDialog(vacancy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentVacancyId ? 'Редактировать вакансию' : 'Добавить вакансию'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Название вакансии *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Например: Архитектор"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="location" className="text-slate-300 mr-2">
                      Локация
                    </Label>
                    <MapPin className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    placeholder="Например: Ташкент"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary_range" className="text-slate-300">
                    Диапазон зарплаты
                  </Label>
                  <Input
                    id="salary_range"
                    name="salary_range"
                    value={formData.salary_range || ''}
                    onChange={handleInputChange}
                    placeholder="Например: от 16 000 000 сум"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* New field: Employment Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="employment_type" className="text-slate-300 mr-2">
                      Тип занятости
                    </Label>
                    <Briefcase className="h-4 w-4 text-slate-500" />
                  </div>
                  <Select 
                    value={formData.employment_type || 'Полная занятость'} 
                    onValueChange={(value) => handleSelectChange('employment_type', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Выберите тип занятости" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Полная занятость">Полная занятость</SelectItem>
                      <SelectItem value="Частичная занятость">Частичная занятость</SelectItem>
                      <SelectItem value="Проектная работа">Проектная работа</SelectItem>
                      <SelectItem value="Стажировка">Стажировка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* New field: Remote status */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="remote_status" className="text-slate-300 mr-2">
                      Формат работы
                    </Label>
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <Select 
                    value={formData.remote_status || 'Офис'} 
                    onValueChange={(value) => handleSelectChange('remote_status', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Выберите формат работы" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Офис">Офис</SelectItem>
                      <SelectItem value="Удаленно">Удаленно</SelectItem>
                      <SelectItem value="Гибрид">Гибрид</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Описание вакансии *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                        <HelpCircle className="h-3 w-3 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-slate-900 border-slate-700 text-slate-300 w-80">
                      <div className="space-y-2 text-xs">
                        <p>Используйте пустую строку для разделения абзацев. Для создания подзаголовков используйте ЗАГЛАВНЫЕ БУКВЫ.</p>
                        <pre className="bg-slate-800 p-2 rounded">{`ОБЯЗАННОСТИ:\n- Разработка проектной документации\n- Создание чертежей\n\nУСЛОВИЯ:\n- Комфортный офис`}</pre>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Подробное описание вакансии..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-slate-300">
                  Требования
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                        <HelpCircle className="h-3 w-3 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-slate-900 border-slate-700 text-slate-300 w-80">
                      <div className="space-y-2 text-xs">
                        <p>Каждый пункт с новой строки, начинающейся с дефиса:</p>
                        <pre className="bg-slate-800 p-2 rounded">{`- Высшее образование\n- Опыт работы от 3 лет\n- Знание AutoCAD, Revit`}</pre>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements || ''}
                  onChange={handleInputChange}
                  placeholder="Например: - Опыт работы от 3 лет&#10;- Высшее образование&#10;- Знание профессиональных программ"
                  className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits" className="text-slate-300">
                  Преимущества
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                        <HelpCircle className="h-3 w-3 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-slate-900 border-slate-700 text-slate-300 w-80">
                      <div className="space-y-2 text-xs">
                        <p>Каждый пункт с новой строки, начинающейся с дефиса:</p>
                        <pre className="bg-slate-800 p-2 rounded">{`- Гибкий график\n- Корпоративное обучение\n- Дружный коллектив`}</pre>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits || ''}
                  onChange={handleInputChange}
                  placeholder="Например: - Гибкий график&#10;- Современный офис&#10;- Профессиональное развитие"
                  className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-slate-300">
                  Изображение (необязательно)
                </Label>
                <ImageUploader 
                  onImageUploaded={handleImageUploaded} 
                  defaultImage={formData.image_url || ''}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_active" 
                  checked={formData.is_active} 
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="is_active" className="text-slate-300 cursor-pointer">
                  Активная вакансия
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-600 text-slate-300"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Удалить вакансию</DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            Вы уверены, что хотите удалить эту вакансию? Это действие нельзя будет отменить.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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

export default AdminVacancies;
