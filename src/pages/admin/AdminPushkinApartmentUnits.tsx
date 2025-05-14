
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

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
}

const AdminPushkinApartmentUnits: React.FC = () => {
  const [apartmentUnits, setApartmentUnits] = useState<ApartmentUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Partial<ApartmentUnit>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchApartmentUnits();
  }, []);

  const fetchApartmentUnits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .order('floor_number')
        .order('room_count');

      if (error) {
        throw error;
      }

      setApartmentUnits(data || []);
    } catch (error) {
      console.error('Error fetching apartment units:', error);
      toast.error('Не удалось загрузить данные о квартирах');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (unit?: ApartmentUnit) => {
    if (unit) {
      setCurrentUnit(unit);
      setIsEditing(true);
    } else {
      setCurrentUnit({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentUnit({});
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number | string = value;
    
    // Convert to number for numeric fields
    if (['floor_number', 'area', 'room_count', 'price_per_sqm', 'total_price', 
         'initial_payment_30p', 'monthly_payment_8mo_30p', 'cadastre_payment_40p'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setCurrentUnit({
      ...currentUnit,
      [name]: parsedValue,
    });
  };

  const calculateDerivedValues = () => {
    // This function automatically calculates total price and other values based on area and price_per_sqm
    if (currentUnit.area && currentUnit.price_per_sqm) {
      const totalPrice = currentUnit.area * currentUnit.price_per_sqm;
      const initialPayment = Math.round(totalPrice * 0.3);
      const monthlyPayment = Math.round((totalPrice * 0.3) / 8);
      const cadastrePayment = Math.round(totalPrice * 0.4);
      
      setCurrentUnit({
        ...currentUnit,
        total_price: totalPrice,
        initial_payment_30p: initialPayment,
        monthly_payment_8mo_30p: monthlyPayment,
        cadastre_payment_40p: cadastrePayment,
      });
    }
  };

  // Call calculate function when area or price_per_sqm changes
  useEffect(() => {
    calculateDerivedValues();
  }, [currentUnit.area, currentUnit.price_per_sqm]);

  const handleSaveApartmentUnit = async () => {
    try {
      // Validate input
      if (!currentUnit.floor_number || !currentUnit.area || !currentUnit.room_count || !currentUnit.price_per_sqm) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      if (isEditing && currentUnit.id) {
        // Update existing apartment unit
        const { error } = await supabase
          .from('apartment_units')
          .update({
            floor_number: currentUnit.floor_number,
            area: currentUnit.area,
            room_count: currentUnit.room_count,
            price_per_sqm: currentUnit.price_per_sqm,
            total_price: currentUnit.total_price,
            initial_payment_30p: currentUnit.initial_payment_30p,
            monthly_payment_8mo_30p: currentUnit.monthly_payment_8mo_30p,
            cadastre_payment_40p: currentUnit.cadastre_payment_40p,
          })
          .eq('id', currentUnit.id);

        if (error) throw error;
        toast.success('Данные о квартире успешно обновлены');
      } else {
        // Create new apartment unit
        const { error } = await supabase
          .from('apartment_units')
          .insert({
            floor_number: currentUnit.floor_number,
            area: currentUnit.area,
            room_count: currentUnit.room_count,
            price_per_sqm: currentUnit.price_per_sqm,
            total_price: currentUnit.total_price,
            initial_payment_30p: currentUnit.initial_payment_30p,
            monthly_payment_8mo_30p: currentUnit.monthly_payment_8mo_30p,
            cadastre_payment_40p: currentUnit.cadastre_payment_40p,
          });

        if (error) throw error;
        toast.success('Данные о квартире успешно добавлены');
      }

      // Refresh the data
      fetchApartmentUnits();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving apartment unit:', error);
      toast.error('Не удалось сохранить данные о квартире');
    }
  };

  const handleDeleteApartmentUnit = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту квартиру?')) {
      try {
        const { error } = await supabase
          .from('apartment_units')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Данные о квартире успешно удалены');
        fetchApartmentUnits();
      } catch (error) {
        console.error('Error deleting apartment unit:', error);
        toast.error('Не удалось удалить данные о квартире');
      }
    }
  };

  return (
    <AdminLayout title="Квартиры (Пушкин)">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Квартиры (Пушкин)</h2>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Добавить
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Этаж</TableHead>
                  <TableHead>Площадь</TableHead>
                  <TableHead>Комнат</TableHead>
                  <TableHead>Цена за м²</TableHead>
                  <TableHead>Общая цена</TableHead>
                  <TableHead>Первый взнос 30%</TableHead>
                  <TableHead>Ежемес. плата (8 мес)</TableHead>
                  <TableHead>Кадастр 40%</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartmentUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Нет данных о квартирах
                    </TableCell>
                  </TableRow>
                ) : (
                  apartmentUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>{unit.floor_number}</TableCell>
                      <TableCell>{unit.area} м²</TableCell>
                      <TableCell>{unit.room_count}</TableCell>
                      <TableCell>{unit.price_per_sqm.toLocaleString()} сум</TableCell>
                      <TableCell>{unit.total_price.toLocaleString()} сум</TableCell>
                      <TableCell>{unit.initial_payment_30p.toLocaleString()} сум</TableCell>
                      <TableCell>{unit.monthly_payment_8mo_30p.toLocaleString()} сум</TableCell>
                      <TableCell>{unit.cadastre_payment_40p.toLocaleString()} сум</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(unit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteApartmentUnit(unit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Редактировать данные о квартире' : 'Добавить данные о квартире'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="floor_number">Этаж</Label>
                <Input
                  id="floor_number"
                  name="floor_number"
                  type="number"
                  value={currentUnit.floor_number || ''}
                  onChange={handleInputChange}
                  placeholder="Номер этажа"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_count">Количество комнат</Label>
                <Input
                  id="room_count"
                  name="room_count"
                  type="number"
                  value={currentUnit.room_count || ''}
                  onChange={handleInputChange}
                  placeholder="Количество комнат"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Площадь (м²)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  step="0.01"
                  value={currentUnit.area || ''}
                  onChange={handleInputChange}
                  placeholder="Площадь в м²"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_per_sqm">Цена за м² (сум)</Label>
                <Input
                  id="price_per_sqm"
                  name="price_per_sqm"
                  type="number"
                  value={currentUnit.price_per_sqm || ''}
                  onChange={handleInputChange}
                  placeholder="Цена за м²"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_price">Общая цена (сум)</Label>
                <Input
                  id="total_price"
                  name="total_price"
                  type="number"
                  value={currentUnit.total_price || ''}
                  onChange={handleInputChange}
                  placeholder="Автоматически рассчитывается"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial_payment_30p">Первый взнос 30% (сум)</Label>
                <Input
                  id="initial_payment_30p"
                  name="initial_payment_30p"
                  type="number"
                  value={currentUnit.initial_payment_30p || ''}
                  onChange={handleInputChange}
                  placeholder="Автоматически рассчитывается"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_payment_8mo_30p">Ежемесячный платеж (8 мес., сум)</Label>
                <Input
                  id="monthly_payment_8mo_30p"
                  name="monthly_payment_8mo_30p"
                  type="number"
                  value={currentUnit.monthly_payment_8mo_30p || ''}
                  onChange={handleInputChange}
                  placeholder="Автоматически рассчитывается"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cadastre_payment_40p">Кадастр 40% (сум)</Label>
                <Input
                  id="cadastre_payment_40p"
                  name="cadastre_payment_40p"
                  type="number"
                  value={currentUnit.cadastre_payment_40p || ''}
                  onChange={handleInputChange}
                  placeholder="Автоматически рассчитывается"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button onClick={handleSaveApartmentUnit}>
                <Save className="mr-2 h-4 w-4" /> Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPushkinApartmentUnits;
