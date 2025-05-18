
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

interface YangiUzbekistanPrice {
  id: string;
  apartment_type: string;
  price_per_sqm: number;
  created_at: string;
  updated_at: string;
}

const AdminYangiUzbekistanPrices: React.FC = () => {
  const [prices, setPrices] = useState<YangiUzbekistanPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<Partial<YangiUzbekistanPrice>>({
    apartment_type: '',
    price_per_sqm: 0
  });
  const [editForm, setEditForm] = useState<Partial<YangiUzbekistanPrice>>({});
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .select('*')
        .order('apartment_type', { ascending: true });
      
      if (error) throw error;
      setPrices(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить данные: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSave = async () => {
    try {
      if (!newPrice.apartment_type || !newPrice.price_per_sqm) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните все поля",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .insert([
          { 
            apartment_type: newPrice.apartment_type,
            price_per_sqm: newPrice.price_per_sqm 
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Цена добавлена успешно",
        variant: "default",
      });
      
      setPrices([...(data || []), ...prices]);
      setNewPrice({ apartment_type: '', price_per_sqm: 0 });
      setIsCreating(false);
      fetchPrices();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: `Не удалось добавить цену: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      if (!editForm.apartment_type || !editForm.price_per_sqm) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните все поля",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .update({ 
          apartment_type: editForm.apartment_type,
          price_per_sqm: editForm.price_per_sqm 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Цена обновлена успешно",
        variant: "default",
      });
      
      setEditingId(null);
      fetchPrices();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить цену: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту цену?')) return;
    
    try {
      const { error } = await supabase
        .from('yangi_uzbekistan_floor_prices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Цена удалена успешно",
        variant: "default",
      });
      
      setPrices(prices.filter(price => price.id !== id));
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить цену: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const startEdit = (price: YangiUzbekistanPrice) => {
    setEditingId(price.id);
    setEditForm({
      apartment_type: price.apartment_type,
      price_per_sqm: price.price_per_sqm
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление ценами - Yangi Uzbekistan</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Добавить цену
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="mb-6 border border-dashed border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Новая цена</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-type">Тип квартиры</Label>
                  <Input 
                    id="new-type" 
                    placeholder="Например: 1-комнатная" 
                    value={newPrice.apartment_type || ''}
                    onChange={(e) => setNewPrice({...newPrice, apartment_type: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-price">Цена за м² (сум)</Label>
                  <Input 
                    id="new-price" 
                    type="number"
                    placeholder="Цена за квадратный метр" 
                    value={newPrice.price_per_sqm || ''}
                    onChange={(e) => setNewPrice({...newPrice, price_per_sqm: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" /> Сохранить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10">Загрузка данных...</div>
      ) : prices.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">Нет данных о ценах. Добавьте первую цену.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Тип квартиры
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Цена за м²
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
              {prices.map((price) => (
                <tr key={price.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === price.id ? (
                      <Input 
                        value={editForm.apartment_type || ''}
                        onChange={(e) => setEditForm({...editForm, apartment_type: e.target.value})}
                      />
                    ) : (
                      <div className="text-sm font-medium">{price.apartment_type}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === price.id ? (
                      <Input 
                        type="number"
                        value={editForm.price_per_sqm || ''}
                        onChange={(e) => setEditForm({...editForm, price_per_sqm: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="text-sm">{new Intl.NumberFormat('ru-RU').format(price.price_per_sqm)} сум</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === price.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="default" onClick={() => handleUpdate(price.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(price)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(price.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminYangiUzbekistanPrices;
