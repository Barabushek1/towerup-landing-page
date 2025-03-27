
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, X, Image, Link as LinkIcon, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Update the type definitions for Vacancy
interface VacancyItem {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  description: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  image_url?: string;
  additional_images?: string[];
  created_at: string;
  updated_at: string;
}

type VacancyInput = {
  title: string;
  location: string;
  salary_range: string;
  description: string;
  requirements?: string;
  benefits?: string;
  is_active?: boolean;
  image_url?: string;
  additional_images?: string[];
};

const AdminVacancies: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVacancyId, setCurrentVacancyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VacancyInput>({
    title: '',
    location: '',
    salary_range: '',
    description: '',
    requirements: '',
    benefits: '',
    is_active: true,
    image_url: '',
    additional_images: []
  });
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [useUrlInput, setUseUrlInput] = useState<boolean>(false);

  // Update the fetch function
  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: ['vacancies'],
    queryFn: async () => {
      console.log('Fetching vacancies...');
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('title');
    
      if (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
      }
      
      console.log('Fetched vacancies:', data);
      return data as VacancyItem[];
    }
  });

  // Update mutation with the correct structure for Supabase
  const addVacancyMutation = useMutation({
    mutationFn: async (vacancyItem: VacancyInput) => {
      console.log('Adding vacancy with data:', vacancyItem);
      // Make sure all required fields are present for Supabase schema
      const dataToInsert = {
        title: vacancyItem.title,
        location: vacancyItem.location,
        salary_range: vacancyItem.salary_range,
        description: vacancyItem.description,
        requirements: vacancyItem.requirements || null,
        benefits: vacancyItem.benefits || null,
        is_active: vacancyItem.is_active !== undefined ? vacancyItem.is_active : true,
        image_url: vacancyItem.image_url || null,
        additional_images: vacancyItem.additional_images || []
      };
      
      const { data, error } = await supabase
        .from('vacancies')
        .insert(dataToInsert)
        .select();
    
      if (error) {
        console.error('Error adding vacancy:', error);
        throw error;
      }
    
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      toast({
        title: "Вакансия добавлена",
        description: "Вакансия успешно добавлена",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error during add mutation:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при сохранении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update mutation with the correct structure for Supabase
  const updateVacancyMutation = useMutation({
    mutationFn: async ({ id, vacancyItem }: { id: string; vacancyItem: VacancyInput }) => {
      console.log('Updating vacancy with id:', id, 'and data:', vacancyItem);
      // Make sure all required fields are present for Supabase schema
      const dataToUpdate = {
        title: vacancyItem.title,
        location: vacancyItem.location,
        salary_range: vacancyItem.salary_range,
        description: vacancyItem.description,
        requirements: vacancyItem.requirements || null,
        benefits: vacancyItem.benefits || null,
        is_active: vacancyItem.is_active !== undefined ? vacancyItem.is_active : true,
        image_url: vacancyItem.image_url || null,
        additional_images: vacancyItem.additional_images || []
      };
      
      const { data, error } = await supabase
        .from('vacancies')
        .update(dataToUpdate)
        .eq('id', id)
        .select();
    
      if (error) {
        console.error('Error updating vacancy:', error);
        throw error;
      }
    
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      toast({
        title: "Вакансия обновлена",
        description: "Вакансия успешно обновлена",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error during update mutation:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при обновлении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete vacancy mutation
  const deleteVacancyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting vacancy with id:', id);
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', id);
    
      if (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      toast({
        title: "Вакансия удалена",
        description: "Вакансия успешно удалена",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error during delete mutation:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при удалении вакансии: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      salary_range: '',
      description: '',
      requirements: '',
      benefits: '',
      is_active: true,
      image_url: '',
      additional_images: []
    });
    setNewImageUrl('');
    setCurrentVacancyId(null);
    setUseUrlInput(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Update form initialization
  const openEditDialog = (vacancyItem: VacancyItem) => {
    console.log('Opening edit dialog with vacancy:', vacancyItem);
    setCurrentVacancyId(vacancyItem.id);
    setFormData({
      title: vacancyItem.title,
      location: vacancyItem.location,
      salary_range: vacancyItem.salary_range,
      description: vacancyItem.description,
      requirements: vacancyItem.requirements,
      benefits: vacancyItem.benefits,
      is_active: vacancyItem.is_active,
      image_url: vacancyItem.image_url,
      additional_images: vacancyItem.additional_images || []
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
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleMainImageUploaded = (imageUrl: string) => {
    console.log('Main image uploaded:', imageUrl);
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.additional_images?.includes(newImageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additional_images: [...(prev.additional_images || []), newImageUrl]
      }));
      setNewImageUrl('');
    }
  };

  const handleAddUploadedImage = (imageUrl: string) => {
    console.log('Additional image uploaded:', imageUrl);
    if (imageUrl && !formData.additional_images?.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additional_images: [...(prev.additional_images || []), imageUrl]
      }));
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      additional_images: prev.additional_images?.filter(img => img !== imageUrl) || []
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.salary_range || !formData.description) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    if (currentVacancyId) {
      updateVacancyMutation.mutate({ id: currentVacancyId, vacancyItem: formData });
    } else {
      addVacancyMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (currentVacancyId) {
      deleteVacancyMutation.mutate(currentVacancyId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-red-400">Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Управление вакансиями</h1>
        <Button onClick={openAddDialog} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить вакансию
        </Button>
      </div>

      {vacancies.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Изображение</TableHead>
                <TableHead>Заголовок</TableHead>
                <TableHead>Локация</TableHead>
                <TableHead>Зарплата</TableHead>
                <TableHead className="w-[80px]">Активна</TableHead>
                <TableHead className="text-right w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-16 h-12 rounded overflow-hidden">
                      <img 
                        src={item.image_url || 'https://placehold.co/200x120?text=No+Image'}
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Error';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.salary_range}</TableCell>
                  <TableCell>
                    {item.is_active ? <Checkbox checked={true} disabled /> : <Checkbox checked={false} disabled />}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(item.id)}
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
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <p className="text-slate-400 mb-4">Вакансии еще не добавлены</p>
          <Button onClick={openAddDialog}>Добавить первую вакансию</Button>
        </div>
      )}

      {/* Add/Edit Vacancy Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentVacancyId ? 'Редактировать вакансию' : 'Добавить вакансию'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Заголовок
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Локация
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary_range" className="text-right">
                Зарплата
              </Label>
              <Input
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Активна
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox 
                  id="is_active" 
                  checked={formData.is_active || false} 
                  onCheckedChange={handleCheckboxChange}
                  className="mr-2 data-[state=checked]:bg-primary"
                />
                <Label htmlFor="is_active" className="text-sm text-slate-300">
                  Показывать вакансию
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center mt-2">
                <Image className="mr-2 h-4 w-4" />
                Главное изображение
              </Label>
              <div className="col-span-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      className={!useUrlInput ? "bg-primary/20" : ""}
                      onClick={() => setUseUrlInput(false)}
                    >
                      Загрузить
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      className={`ml-2 ${useUrlInput ? "bg-primary/20" : ""}`}
                      onClick={() => setUseUrlInput(true)}
                    >
                      URL
                    </Button>
                  </div>
                </div>

                {useUrlInput ? (
                  <div>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mb-2 bg-slate-700 border-slate-600"
                    />
                    {formData.image_url && (
                      <div className="w-full h-32 bg-slate-700 rounded-md overflow-hidden">
                        <img 
                          src={formData.image_url} 
                          alt="Предпросмотр изображения" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/640x320?text=Error';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <ImageUploader 
                    onImageUploaded={handleMainImageUploaded}
                    defaultImage={formData.image_url}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Описание
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="requirements" className="text-right mt-2">
                Требования
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements || ''}
                onChange={handleInputChange}
                rows={3}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="benefits" className="text-right mt-2">
                Преимущества
              </Label>
              <Textarea
                id="benefits"
                name="benefits"
                value={formData.benefits || ''}
                onChange={handleInputChange}
                rows={3}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center mt-2">
                <Image className="mr-2 h-4 w-4" />
                Галерея
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setUseUrlInput(!useUrlInput)}
                    >
                      {useUrlInput ? "Загрузить изображение" : "Ввести URL изображения"}
                    </Button>
                  </div>
                  
                  {useUrlInput ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="URL дополнительного изображения"
                        className="flex-1 bg-slate-700 border-slate-600"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAddImage}
                        disabled={!newImageUrl}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <ImageUploader
                      onImageUploaded={handleAddUploadedImage}
                      className="mt-2"
                    />
                  )}
                </div>
                
                {formData.additional_images && formData.additional_images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {formData.additional_images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-700">
                          <img 
                            src={image} 
                            alt={`Изображение ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=Error';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image)}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Добавьте изображения для создания галереи.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={addVacancyMutation.isPending || updateVacancyMutation.isPending}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={addVacancyMutation.isPending || updateVacancyMutation.isPending}
            >
              {(addVacancyMutation.isPending || updateVacancyMutation.isPending) ? (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p className="py-4">Вы уверены, что хотите удалить эту вакансию? Это действие нельзя будет отменить.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteVacancyMutation.isPending}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteVacancyMutation.isPending}
            >
              {deleteVacancyMutation.isPending ? (
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
