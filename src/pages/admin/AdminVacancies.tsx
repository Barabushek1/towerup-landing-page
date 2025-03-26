
import React, { useState } from 'react';
import { useAdminData, VacancyItem } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, MapPin, Coins, Clock, Briefcase } from 'lucide-react';

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
  });

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      salary: '',
      type: '',
      description: '',
      requirements: '',
      benefits: '',
    });
    setCurrentVacancyId(null);
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
