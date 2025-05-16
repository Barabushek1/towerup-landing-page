
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2, Plus, Trash2, Edit, Save, Check, X, Building, MapPin, Calendar, Clock, Users, Home, Store } from 'lucide-react';
import { toast } from 'sonner';

interface Characteristic {
  id: string;
  project_slug: string;
  characteristic_type: string;
  icon: string;
  value: string;
  value_ru: string | null;
  value_uz: string | null;
  value_en: string | null;
  label: string;
  label_ru: string | null;
  label_uz: string | null;
  label_en: string | null;
  display_order: number;
}

const iconOptions = [
  { value: 'MapPin', label: 'Map Pin', icon: <MapPin className="h-4 w-4" /> },
  { value: 'Building', label: 'Building', icon: <Building className="h-4 w-4" /> },
  { value: 'Calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> },
  { value: 'Clock', label: 'Clock', icon: <Clock className="h-4 w-4" /> },
  { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  { value: 'Home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { value: 'Store', label: 'Store', icon: <Store className="h-4 w-4" /> },
];

const projectOptions = [
  { value: 'pushkin', label: 'Пушкин' },
  { value: 'new-uzbekistan', label: 'Yangi Uzbekistan' },
];

const AdminProjectCharacteristics: React.FC = () => {
  const { toast: showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pushkinCharacteristics, setPushkinCharacteristics] = useState<Characteristic[]>([]);
  const [uzbekistanCharacteristics, setUzbekistanCharacteristics] = useState<Characteristic[]>([]);
  const [activeTab, setActiveTab] = useState('pushkin');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharacteristic, setEditingCharacteristic] = useState<Characteristic | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    project_slug: 'pushkin',
    characteristic_type: '',
    icon: 'Building',
    value: '',
    value_ru: '',
    value_uz: '',
    value_en: '',
    label: '',
    label_ru: '',
    label_uz: '',
    label_en: '',
    display_order: 0,
  });

  const fetchCharacteristics = async () => {
    setLoading(true);
    try {
      // Fetch Pushkin characteristics
      const { data: pushkinData, error: pushkinError } = await supabase
        .from('project_main_characteristics')
        .select('*')
        .eq('project_slug', 'pushkin')
        .order('display_order', { ascending: true });

      if (pushkinError) throw pushkinError;
      setPushkinCharacteristics(pushkinData || []);

      // Fetch Uzbekistan characteristics
      const { data: uzbekistanData, error: uzbekistanError } = await supabase
        .from('project_main_characteristics')
        .select('*')
        .eq('project_slug', 'new-uzbekistan')
        .order('display_order', { ascending: true });

      if (uzbekistanError) throw uzbekistanError;
      setUzbekistanCharacteristics(uzbekistanData || []);
    } catch (error) {
      console.error('Error fetching characteristics:', error);
      toast.error('Не удалось загрузить характеристики проектов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      project_slug: activeTab,
      characteristic_type: '',
      icon: 'Building',
      value: '',
      value_ru: '',
      value_uz: '',
      value_en: '',
      label: '',
      label_ru: '',
      label_uz: '',
      label_en: '',
      display_order: pushkinCharacteristics.length + uzbekistanCharacteristics.length + 1,
    });
    setEditingCharacteristic(null);
  };

  const openAddDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, project_slug: activeTab }));
    setDialogOpen(true);
  };

  const openEditDialog = (characteristic: Characteristic) => {
    setEditingCharacteristic(characteristic);
    setFormData({
      project_slug: characteristic.project_slug,
      characteristic_type: characteristic.characteristic_type,
      icon: characteristic.icon,
      value: characteristic.value,
      value_ru: characteristic.value_ru || '',
      value_uz: characteristic.value_uz || '',
      value_en: characteristic.value_en || '',
      label: characteristic.label,
      label_ru: characteristic.label_ru || '',
      label_uz: characteristic.label_uz || '',
      label_en: characteristic.label_en || '',
      display_order: characteristic.display_order,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCharacteristic) {
        // Update existing characteristic
        const { error } = await supabase
          .from('project_main_characteristics')
          .update({
            icon: formData.icon,
            value: formData.value,
            value_ru: formData.value_ru || null,
            value_uz: formData.value_uz || null,
            value_en: formData.value_en || null,
            label: formData.label,
            label_ru: formData.label_ru || null,
            label_uz: formData.label_uz || null,
            label_en: formData.label_en || null,
            display_order: formData.display_order,
          })
          .eq('id', editingCharacteristic.id);

        if (error) throw error;
        toast.success('Характеристика успешно обновлена');
      } else {
        // Add new characteristic
        const { error } = await supabase
          .from('project_main_characteristics')
          .insert([
            {
              project_slug: formData.project_slug,
              characteristic_type: formData.characteristic_type,
              icon: formData.icon,
              value: formData.value,
              value_ru: formData.value_ru || null,
              value_uz: formData.value_uz || null,
              value_en: formData.value_en || null,
              label: formData.label,
              label_ru: formData.label_ru || null,
              label_uz: formData.label_uz || null,
              label_en: formData.label_en || null,
              display_order: formData.display_order,
            },
          ]);

        if (error) throw error;
        toast.success('Новая характеристика успешно добавлена');
      }

      setDialogOpen(false);
      fetchCharacteristics();
      resetForm();
    } catch (error: any) {
      console.error('Error saving characteristic:', error);
      toast.error(error.message || 'Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту характеристику?')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('project_main_characteristics')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Характеристика успешно удалена');
        fetchCharacteristics();
      } catch (error) {
        console.error('Error deleting characteristic:', error);
        toast.error('Ошибка при удалении характеристики');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderIconComponent = (iconName: string) => {
    const foundIcon = iconOptions.find(icon => icon.value === iconName);
    return foundIcon ? foundIcon.icon : <Building className="h-4 w-4" />;
  };

  const renderCharacteristicsTable = (characteristics: Characteristic[]) => {
    if (loading && characteristics.length === 0) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (characteristics.length === 0) {
      return (
        <div className="py-16 text-center text-gray-500">
          Нет доступных характеристик для данного проекта
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Иконка</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Ярлык</TableHead>
            <TableHead>Значение</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characteristics.map((characteristic, index) => (
            <TableRow key={characteristic.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {renderIconComponent(characteristic.icon)}
                  <span>{characteristic.icon}</span>
                </div>
              </TableCell>
              <TableCell>{characteristic.characteristic_type}</TableCell>
              <TableCell>{characteristic.label}</TableCell>
              <TableCell>{characteristic.value}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(characteristic)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(characteristic.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Основные характеристики проектов</h1>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить характеристику
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="pushkin">ЖК "Пушкин"</TabsTrigger>
            <TabsTrigger value="new-uzbekistan">Yangi Uzbekistan</TabsTrigger>
          </TabsList>
          <TabsContent value="pushkin">
            <Card>
              <CardHeader>
                <CardTitle>Характеристики ЖК "Пушкин"</CardTitle>
                <CardDescription>
                  Управление основными характеристиками, которые отображаются на странице проекта.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCharacteristicsTable(pushkinCharacteristics)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="new-uzbekistan">
            <Card>
              <CardHeader>
                <CardTitle>Характеристики "Yangi Uzbekistan"</CardTitle>
                <CardDescription>
                  Управление основными характеристиками, которые отображаются на странице проекта.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCharacteristicsTable(uzbekistanCharacteristics)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingCharacteristic ? 'Редактировать характеристику' : 'Добавить новую характеристику'}
              </DialogTitle>
              <DialogDescription>
                Заполните все поля для {editingCharacteristic ? 'обновления' : 'создания'} характеристики проекта.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_slug">Проект</Label>
                    <Select
                      value={formData.project_slug}
                      onValueChange={(value) => handleSelectChange('project_slug', value)}
                      disabled={!!editingCharacteristic}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите проект" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="characteristic_type">Тип характеристики</Label>
                    <Input
                      id="characteristic_type"
                      name="characteristic_type"
                      value={formData.characteristic_type}
                      onChange={handleInputChange}
                      placeholder="location, year, area, etc."
                      disabled={!!editingCharacteristic}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Иконка</Label>
                    <Select 
                      value={formData.icon} 
                      onValueChange={(value) => handleSelectChange('icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите иконку" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Порядок отображения</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={handleInputChange}
                      min={0}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Ярлык (Label)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label" className="text-xs text-gray-500">Русский (основной)</Label>
                      <Input
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="Расположение"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="label_en" className="text-xs text-gray-500">English</Label>
                      <Input
                        id="label_en"
                        name="label_en"
                        value={formData.label_en}
                        onChange={handleInputChange}
                        placeholder="Location"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label_ru" className="text-xs text-gray-500">Русский</Label>
                      <Input
                        id="label_ru"
                        name="label_ru"
                        value={formData.label_ru}
                        onChange={handleInputChange}
                        placeholder="Расположение"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label_uz" className="text-xs text-gray-500">O'zbek</Label>
                      <Input
                        id="label_uz"
                        name="label_uz"
                        value={formData.label_uz}
                        onChange={handleInputChange}
                        placeholder="Joylashuv"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Значение (Value)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value" className="text-xs text-gray-500">Русский (основной)</Label>
                      <Input
                        id="value"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        placeholder="г. Ташкент, Янгихаётский район"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="value_en" className="text-xs text-gray-500">English</Label>
                      <Input
                        id="value_en"
                        name="value_en"
                        value={formData.value_en}
                        onChange={handleInputChange}
                        placeholder="Tashkent, Yangihayot district"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value_ru" className="text-xs text-gray-500">Русский</Label>
                      <Input
                        id="value_ru"
                        name="value_ru"
                        value={formData.value_ru}
                        onChange={handleInputChange}
                        placeholder="г. Ташкент, Янгихаётский район"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value_uz" className="text-xs text-gray-500">O'zbek</Label>
                      <Input
                        id="value_uz"
                        name="value_uz"
                        value={formData.value_uz}
                        onChange={handleInputChange}
                        placeholder="Toshkent, Yangihayot tumani"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
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
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProjectCharacteristics;
