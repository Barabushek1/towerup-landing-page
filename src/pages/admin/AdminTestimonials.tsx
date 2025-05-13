
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Edit, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Testimonial {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
    author: '',
    position: '',
    content: '',
    rating: 5,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить отзывы'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTestimonial(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setCurrentTestimonial(prev => ({ ...prev, is_active: checked }));
  };
  
  const handleRatingChange = (value: string) => {
    setCurrentTestimonial(prev => ({ ...prev, rating: parseInt(value) }));
  };
  
  const resetForm = () => {
    setCurrentTestimonial({
      author: '',
      position: '',
      content: '',
      rating: 5,
      is_active: true
    });
    setIsEditing(false);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 300); // Reset form after dialog close animation
  };
  
  const handleOpenEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTestimonial.author || !currentTestimonial.position || !currentTestimonial.content) {
      toast({
        variant: 'destructive',
        title: 'Ошибка валидации',
        description: 'Пожалуйста, заполните все обязательные поля'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && currentTestimonial.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            author: currentTestimonial.author,
            position: currentTestimonial.position,
            content: currentTestimonial.content,
            rating: currentTestimonial.rating,
            is_active: currentTestimonial.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTestimonial.id);
          
        if (error) throw error;
        
        toast({
          title: 'Отзыв обновлен',
          description: 'Отзыв успешно обновлен'
        });
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert({
            author: currentTestimonial.author,
            position: currentTestimonial.position,
            content: currentTestimonial.content,
            rating: currentTestimonial.rating || 5,
            is_active: currentTestimonial.is_active !== undefined ? currentTestimonial.is_active : true
          });
          
        if (error) throw error;
        
        toast({
          title: 'Отзыв добавлен',
          description: 'Новый отзыв успешно добавлен'
        });
      }
      
      // Refresh testimonials list
      await fetchTestimonials();
      handleCloseDialog();
      
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить отзыв'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Отзыв удален',
        description: 'Отзыв успешно удален'
      });
      
      setTestimonials(testimonials.filter(t => t.id !== id));
      
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: 'Не удалось удалить отзыв'
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление отзывами</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить отзыв
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Редактировать отзыв' : 'Добавить новый отзыв'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Автор *</Label>
                  <Input
                    id="author"
                    name="author"
                    value={currentTestimonial.author || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Должность *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={currentTestimonial.position || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Содержание отзыва *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={currentTestimonial.content || ''}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Рейтинг</Label>
                  <Select
                    value={String(currentTestimonial.rating || 5)}
                    onValueChange={handleRatingChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите рейтинг" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={String(rating)}>
                          {rating} {rating === 1 ? 'звезда' : rating < 5 ? 'звезды' : 'звезд'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={currentTestimonial.is_active !== false}
                    onCheckedChange={handleSwitchChange}
                    id="is-active"
                  />
                  <Label htmlFor="is-active">Активный</Label>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : isEditing ? 'Обновить' : 'Создать'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <div className="rounded-md border">
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
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Нет отзывов
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>{testimonial.author}</TableCell>
                      <TableCell>{testimonial.position}</TableCell>
                      <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: testimonial.rating }, (_, i) => (
                            <Star key={i} className="h-4 w-4 text-primary fill-primary mr-0.5" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          testimonial.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {testimonial.is_active ? 'Активен' : 'Неактивен'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(testimonial.id)}
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
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
