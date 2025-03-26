
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Plus } from "lucide-react";

interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  salary_range: string | null;
  is_active: boolean;
  created_at: string;
}

const VacanciesManagement: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVacancy, setCurrentVacancy] = useState<Partial<Vacancy> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVacancies(data || []);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить вакансии",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Vacancy) => {
    if (item) {
      setCurrentVacancy(item);
    } else {
      setCurrentVacancy({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary_range: '',
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentVacancy(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleToggleActive = (checked: boolean) => {
    setCurrentVacancy(prev => prev ? { ...prev, is_active: checked } : null);
  };

  const handleSubmit = async () => {
    if (!currentVacancy?.title || !currentVacancy?.description) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentVacancy.id) {
        // Update existing vacancy
        const { error } = await supabase
          .from('vacancies')
          .update({
            title: currentVacancy.title,
            description: currentVacancy.description,
            requirements: currentVacancy.requirements,
            location: currentVacancy.location,
            salary_range: currentVacancy.salary_range,
            is_active: currentVacancy.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentVacancy.id);

        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Вакансия обновлена",
        });
      } else {
        // Create new vacancy
        const { error } = await supabase
          .from('vacancies')
          .insert([{
            title: currentVacancy.title,
            description: currentVacancy.description,
            requirements: currentVacancy.requirements,
            location: currentVacancy.location,
            salary_range: currentVacancy.salary_range,
            is_active: currentVacancy.is_active,
          }]);

        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Вакансия создана",
        });
      }

      setIsDialogOpen(false);
      fetchVacancies();
    } catch (error: any) {
      console.error('Error saving vacancy:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить вакансию",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Вакансия удалена",
      });
      
      setIsDeleteDialogOpen(false);
      fetchVacancies();
    } catch (error: any) {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить вакансию",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-slate-200 font-benzin">Управление вакансиями</h3>
        <Button 
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Добавить вакансию
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-8 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <p className="text-slate-300">Вакансии отсутствуют</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Название</TableHead>
                <TableHead className="text-slate-300 hidden md:table-cell">Локация</TableHead>
                <TableHead className="text-slate-300 hidden md:table-cell">Зарплата</TableHead>
                <TableHead className="text-slate-300 hidden lg:table-cell">Статус</TableHead>
                <TableHead className="text-slate-300 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-white">{item.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-300">{item.location || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-300">{item.salary_range || '—'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {item.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(item)}
                        title="Редактировать"
                      >
                        <Edit size={16} className="text-slate-300" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(item.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        title="Удалить"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-benzin">
              {currentVacancy?.id ? 'Редактировать вакансию' : 'Добавить вакансию'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                Название *
              </label>
              <Input
                id="title"
                name="title"
                value={currentVacancy?.title || ''}
                onChange={handleChange}
                placeholder="Введите название вакансии"
                className="bg-slate-700/50 border-slate-600/50 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                Описание *
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentVacancy?.description || ''}
                onChange={handleChange}
                placeholder="Введите описание вакансии"
                className="bg-slate-700/50 border-slate-600/50 text-white min-h-[100px]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-slate-300 mb-1">
                Требования
              </label>
              <Textarea
                id="requirements"
                name="requirements"
                value={currentVacancy?.requirements || ''}
                onChange={handleChange}
                placeholder="Введите требования к кандидату"
                className="bg-slate-700/50 border-slate-600/50 text-white min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">
                  Локация
                </label>
                <Input
                  id="location"
                  name="location"
                  value={currentVacancy?.location || ''}
                  onChange={handleChange}
                  placeholder="Введите местоположение"
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="salary_range" className="block text-sm font-medium text-slate-300 mb-1">
                  Зарплата
                </label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  value={currentVacancy?.salary_range || ''}
                  onChange={handleChange}
                  placeholder="Например: 100,000 - 150,000 руб."
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={currentVacancy?.is_active}
                onCheckedChange={handleToggleActive}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-300">
                Активна
              </label>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {currentVacancy?.id ? 'Обновить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-benzin">Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-300">
            Вы уверены, что хотите удалить эту вакансию? Это действие нельзя отменить.
          </p>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VacanciesManagement;
