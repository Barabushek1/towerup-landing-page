
import React, { useState } from 'react';
import { useAdminData, VacancyItem } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, MapPin, Coins, Clock, Briefcase, Image, X } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const AdminVacancies: React.FC = () => {
  const { vacancies, addVacancy, updateVacancy, deleteVacancy } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVacancyId, setCurrentVacancyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<VacancyItem, 'id'>>({
    title: '',
    location: '',
    salary: '',
    type: '',
    description: '',
    requirements: '',
    benefits: '',
    imageUrl: '',
    additionalImages: []
  });
  const [useUrlInput, setUseUrlInput] = useState<boolean>(false);
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      salary: '',
      type: '',
      description: '',
      requirements: '',
      benefits: '',
      imageUrl: '',
      additionalImages: []
    });
    setCurrentVacancyId(null);
    setUseUrlInput(false);
    setNewImageUrl('');
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (vacancyItem: VacancyItem) => {
    setCurrentVacancyId(vacancyItem.id);
    setFormData({
      title: vacancyItem.title,
      location: vacancyItem.location,
      salary: vacancyItem.salary,
      type: vacancyItem.type,
      description: vacancyItem.description || '',
      requirements: vacancyItem.requirements || '',
      benefits: vacancyItem.benefits || '',
      imageUrl: vacancyItem.imageUrl || '',
      additionalImages: vacancyItem.additionalImages || []
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

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.additionalImages?.includes(newImageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), newImageUrl]
      }));
      setNewImageUrl('');
    }
  };

  const handleAddUploadedImage = (imageUrl: string) => {
    if (imageUrl && !formData.additionalImages?.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), imageUrl]
      }));
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages?.filter(img => img !== imageUrl) || []
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.salary || !formData.type) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentVacancyId) {
        updateVacancy(currentVacancyId, formData);
        toast({
          title: "Вакансия обновлена",
          description: "Вакансия успешно обновлена",
        });
      } else {
        addVacancy(formData);
        toast({
          title: "Вакансия добавлена",
          description: "Вакансия успешно добавлена",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении вакансии",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (currentVacancyId) {
      try {
        deleteVacancy(currentVacancyId);
        toast({
          title: "Вакансия удалена",
          description: "Вакансия успешно удалена",
        });
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при удалении вакансии",
          variant: "destructive",
        });
      }
    }
  };

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
                <TableHead>Должность</TableHead>
                <TableHead>Расположение</TableHead>
                <TableHead>Зарплата</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imageUrl ? (
                      <div className="w-16 h-12 rounded overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Error';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-12 bg-slate-700 rounded flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.salary}</TableCell>
                  <TableCell>{item.type}</TableCell>
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
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Основная информация</h3>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Должность
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
              <Label htmlFor="location" className="text-right flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Расположение
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
              <Label htmlFor="salary" className="text-right flex items-center">
                <Coins className="mr-2 h-4 w-4" />
                Зарплата
              </Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="например: от 15 000 000 сум"
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Тип занятости
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="например: Полная занятость"
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center mt-2">
                <Image className="mr-2 h-4 w-4" />
                Изображение вакансии
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
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mb-2 bg-slate-700 border-slate-600"
                    />
                    {formData.imageUrl && (
                      <div className="w-full h-32 bg-slate-700 rounded-md overflow-hidden">
                        <img 
                          src={formData.imageUrl} 
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
                    onImageUploaded={handleImageUploaded}
                    defaultImage={formData.imageUrl}
                  />
                )}
              </div>
            </div>
            
            <div className="h-px bg-slate-700 my-4"></div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Описание
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Введите подробное описание вакансии. Используйте двойную пустую строку для разделения параграфов."
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
                value={formData.requirements}
                onChange={handleInputChange}
                rows={5}
                placeholder="Введите требования к кандидату. Для создания списка каждый пункт размещайте на новой строке."
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
                value={formData.benefits}
                onChange={handleInputChange}
                rows={5}
                placeholder="Введите преимущества работы в компании. Для создания списка каждый пункт размещайте на новой строке."
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
                
                {formData.additionalImages && formData.additionalImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {formData.additionalImages.map((image, index) => (
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVacancies;
