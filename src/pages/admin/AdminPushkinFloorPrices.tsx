
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

interface FloorPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
}

const AdminPushkinFloorPrices: React.FC = () => {
  const [floorPrices, setFloorPrices] = useState<FloorPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFloorPrice, setCurrentFloorPrice] = useState<Partial<FloorPrice>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFloorPrices();
  }, []);

  const fetchFloorPrices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_prices')
        .select('*')
        .order('apartment_type');

      if (error) {
        throw error;
      }

      setFloorPrices(data || []);
    } catch (error) {
      console.error('Error fetching floor prices:', error);
      toast.error('Не удалось загрузить цены за м²');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (floorPrice?: FloorPrice) => {
    if (floorPrice) {
      setCurrentFloorPrice(floorPrice);
      setIsEditing(true);
    } else {
      setCurrentFloorPrice({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentFloorPrice({});
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFloorPrice({
      ...currentFloorPrice,
      [name]: name === 'price_per_sqm' ? parseInt(value) || 0 : value,
    });
  };

  const handleSaveFloorPrice = async () => {
    try {
      // Validate input
      if (!currentFloorPrice.apartment_type || !currentFloorPrice.price_per_sqm) {
        toast.error('Пожалуйста, заполните все поля');
        return;
      }

      if (isEditing && currentFloorPrice.id) {
        // Update existing floor price
        const { error } = await supabase
          .from('floor_prices')
          .update({
            apartment_type: currentFloorPrice.apartment_type,
            price_per_sqm: currentFloorPrice.price_per_sqm,
          })
          .eq('id', currentFloorPrice.id);

        if (error) throw error;
        toast.success('Цена за м² успешно обновлена');
      } else {
        // Create new floor price
        const { error } = await supabase
          .from('floor_prices')
          .insert({
            apartment_type: currentFloorPrice.apartment_type,
            price_per_sqm: currentFloorPrice.price_per_sqm,
          });

        if (error) throw error;
        toast.success('Цена за м² успешно добавлена');
      }

      // Refresh the data
      fetchFloorPrices();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving floor price:', error);
      toast.error('Не удалось сохранить цену за м²');
    }
  };

  const handleDeleteFloorPrice = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту цену?')) {
      try {
        const { error } = await supabase
          .from('floor_prices')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Цена за м² успешно удалена');
        fetchFloorPrices();
      } catch (error) {
        console.error('Error deleting floor price:', error);
        toast.error('Не удалось удалить цену за м²');
      }
    }
  };

  return (
    <AdminLayout title="Цены за м² (Пушкин)">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Цены за м² (Пушкин)</h2>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Добавить
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
              {floorPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Нет данных о ценах
                  </TableCell>
                </TableRow>
              ) : (
                floorPrices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell>{price.apartment_type}</TableCell>
                    <TableCell>{price.price_per_sqm.toLocaleString()} сум</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenDialog(price)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteFloorPrice(price.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Редактировать цену за м²' : 'Добавить цену за м²'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="apartment_type">Тип квартиры</Label>
                <Input
                  id="apartment_type"
                  name="apartment_type"
                  value={currentFloorPrice.apartment_type || ''}
                  onChange={handleInputChange}
                  placeholder="Например: 1-комнатная"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_per_sqm">Цена за м² (в сумах)</Label>
                <Input
                  id="price_per_sqm"
                  name="price_per_sqm"
                  type="number"
                  value={currentFloorPrice.price_per_sqm || ''}
                  onChange={handleInputChange}
                  placeholder="Например: 8000000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button onClick={handleSaveFloorPrice}>
                <Save className="mr-2 h-4 w-4" /> Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPushkinFloorPrices;
