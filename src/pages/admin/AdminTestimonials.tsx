
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Trash2, Edit, Plus, Save, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [newTestimonial, setNewTestimonial] = useState({
    author: '',
    position: '',
    content: '',
    rating: 5,
    is_active: true
  });

  // Fetch testimonials
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewTestimonial(prev => ({ ...prev, is_active: checked }));
  };

  const handleRatingChange = (rating: number) => {
    setNewTestimonial(prev => ({ ...prev, rating }));
  };

  const handleAddTestimonial = async () => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([newTestimonial]);

      if (error) throw error;
      
      toast({
        title: 'Отзыв добавлен',
        description: 'Новый отзыв успешно добавлен',
        variant: 'default'
      });
      
      setIsAdding(false);
      setNewTestimonial({
        author: '',
        position: '',
        content: '',
        rating: 5,
        is_active: true
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить отзыв',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Отзыв удален',
        description: 'Отзыв успешно удален',
        variant: 'default'
      });
      
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive'
      });
    }
  };

  const startEditing = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setNewTestimonial({
      author: testimonial.author,
      position: testimonial.position,
      content: testimonial.content,
      rating: testimonial.rating,
      is_active: testimonial.is_active
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewTestimonial({
      author: '',
      position: '',
      content: '',
      rating: 5,
      is_active: true
    });
  };

  const handleUpdateTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(newTestimonial)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Отзыв обновлен',
        description: 'Отзыв успешно обновлен',
        variant: 'default'
      });
      
      setEditingId(null);
      setNewTestimonial({
        author: '',
        position: '',
        content: '',
        rating: 5,
        is_active: true
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв',
        variant: 'destructive'
      });
    }
  };

  const toggleTestimonialStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Статус изменен',
        description: `Отзыв ${!currentStatus ? 'активирован' : 'деактивирован'}`,
        variant: 'default'
      });
      
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус отзыва',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        onClick={() => editingId && handleRatingChange(i + 1)}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление отзывами</h1>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className="bg-primary hover:bg-primary/90"
          >
            {isAdding ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Отмена
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Добавить отзыв
              </>
            )}
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6 border border-primary/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Новый отзыв</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author">Автор</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={newTestimonial.author} 
                    onChange={handleInputChange} 
                    placeholder="Имя автора"
                  />
                </div>
                
                <div>
                  <Label htmlFor="position">Должность</Label>
                  <Input 
                    id="position" 
                    name="position" 
                    value={newTestimonial.position} 
                    onChange={handleInputChange} 
                    placeholder="Должность и компания"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Содержание отзыва</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={newTestimonial.content} 
                    onChange={handleInputChange} 
                    placeholder="Текст отзыва"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label>Рейтинг</Label>
                  <div className="flex space-x-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 cursor-pointer ${i < newTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        onClick={() => handleRatingChange(i + 1)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    checked={newTestimonial.is_active} 
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active">Активный</Label>
                </div>
                
                <Button 
                  onClick={handleAddTestimonial} 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить отзыв
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Автор</TableHead>
                    <TableHead>Должность</TableHead>
                    <TableHead>Отзыв</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map(testimonial => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        {editingId === testimonial.id ? (
                          <Input 
                            name="author" 
                            value={newTestimonial.author} 
                            onChange={handleInputChange} 
                          />
                        ) : testimonial.author}
                      </TableCell>
                      <TableCell>
                        {editingId === testimonial.id ? (
                          <Input 
                            name="position" 
                            value={newTestimonial.position} 
                            onChange={handleInputChange} 
                          />
                        ) : testimonial.position}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {editingId === testimonial.id ? (
                          <Textarea 
                            name="content" 
                            value={newTestimonial.content} 
                            onChange={handleInputChange} 
                            rows={3}
                          />
                        ) : (
                          <div className="max-h-20 overflow-hidden">
                            {testimonial.content}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {editingId === testimonial.id ? 
                            renderStars(newTestimonial.rating) : 
                            renderStars(testimonial.rating)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingId === testimonial.id ? (
                          <Switch 
                            checked={newTestimonial.is_active} 
                            onCheckedChange={handleSwitchChange}
                          />
                        ) : (
                          <Switch 
                            checked={testimonial.is_active} 
                            onCheckedChange={() => toggleTestimonialStatus(testimonial.id, testimonial.is_active)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === testimonial.id ? (
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUpdateTestimonial(testimonial.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => startEditing(testimonial)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <p>Отзывы отсутствуют. Добавьте первый отзыв.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
