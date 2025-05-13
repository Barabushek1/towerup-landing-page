
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
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import ImageUploader from '@/components/admin/ImageUploader';

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminHeroImages = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentImage, setCurrentImage] = useState<Partial<HeroImage>>({
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchHeroImages();
  }, []);
  
  const fetchHeroImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить изображения'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentImage(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setCurrentImage(prev => ({ ...prev, is_active: checked }));
  };
  
  const handleImageSelected = (url: string) => {
    setCurrentImage(prev => ({ ...prev, image_url: url }));
  };
  
  const resetForm = () => {
    setCurrentImage({
      image_url: '',
      alt_text: '',
      display_order: getNextDisplayOrder(),
      is_active: true
    });
    setIsEditing(false);
  };
  
  const getNextDisplayOrder = () => {
    if (heroImages.length === 0) return 1;
    return Math.max(...heroImages.map(img => img.display_order)) + 1;
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 300); // Reset form after dialog close animation
  };
  
  const handleOpenEdit = (image: HeroImage) => {
    setCurrentImage(image);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentImage.image_url) {
      toast({
        variant: 'destructive',
        title: 'Ошибка валидации',
        description: 'Пожалуйста, выберите изображение'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && currentImage.id) {
        // Update existing image
        const { error } = await supabase
          .from('hero_images')
          .update({
            image_url: currentImage.image_url,
            alt_text: currentImage.alt_text || null,
            is_active: currentImage.is_active,
            display_order: currentImage.display_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentImage.id);
          
        if (error) throw error;
        
        toast({
          title: 'Изображение обновлено',
          description: 'Изображение успешно обновлено'
        });
      } else {
        // Create new image
        const { error } = await supabase
          .from('hero_images')
          .insert({
            image_url: currentImage.image_url,
            alt_text: currentImage.alt_text || null,
            display_order: currentImage.display_order || getNextDisplayOrder(),
            is_active: currentImage.is_active !== undefined ? currentImage.is_active : true
          });
          
        if (error) throw error;
        
        toast({
          title: 'Изображение добавлено',
          description: 'Новое изображение успешно добавлено'
        });
      }
      
      // Refresh images list
      await fetchHeroImages();
      handleCloseDialog();
      
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить изображение'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Изображение удалено',
        description: 'Изображение успешно удалено'
      });
      
      setHeroImages(heroImages.filter(img => img.id !== id));
      
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: 'Не удалось удалить изображение'
      });
    }
  };
  
  const handleMoveOrder = async (id: string, direction: 'up' | 'down') => {
    const currentImage = heroImages.find(img => img.id === id);
    if (!currentImage) return;
    
    const currentIndex = heroImages.findIndex(img => img.id === id);
    let targetIndex;
    
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < heroImages.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return;
    }
    
    const targetImage = heroImages[targetIndex];
    
    try {
      // Update current image order
      await supabase
        .from('hero_images')
        .update({ display_order: targetImage.display_order })
        .eq('id', currentImage.id);
      
      // Update target image order
      await supabase
        .from('hero_images')
        .update({ display_order: currentImage.display_order })
        .eq('id', targetImage.id);
      
      toast({
        title: 'Порядок изменен',
        description: 'Порядок изображений успешно изменен'
      });
      
      // Refresh the list
      await fetchHeroImages();
      
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось изменить порядок изображений'
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление изображениями главной страницы</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить изображение
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Редактировать изображение' : 'Добавить изображение'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Изображение *</Label>
                  <ImageUploader 
                    onChange={handleImageSelected} 
                    value={currentImage.image_url || ''} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alt_text">Альтернативный текст</Label>
                  <Input
                    id="alt_text"
                    name="alt_text"
                    value={currentImage.alt_text || ''}
                    onChange={handleChange}
                    placeholder="Описание изображения"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display_order">Порядок отображения</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    min={0}
                    value={currentImage.display_order || getNextDisplayOrder()}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={currentImage.is_active !== false}
                    onCheckedChange={handleSwitchChange}
                    id="is-active"
                  />
                  <Label htmlFor="is-active">Активное изображение</Label>
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
                  <TableHead>Порядок</TableHead>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroImages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Нет изображений
                    </TableCell>
                  </TableRow>
                ) : (
                  heroImages.map((image, index) => (
                    <TableRow key={image.id}>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold">{image.display_order}</span>
                          <div className="flex mt-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={index === 0}
                              onClick={() => handleMoveOrder(image.id, 'up')}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={index === heroImages.length - 1}
                              onClick={() => handleMoveOrder(image.id, 'down')}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {image.image_url ? (
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || "Hero image"} 
                            className="w-20 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{image.alt_text || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          image.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {image.is_active ? 'Активно' : 'Неактивно'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEdit(image)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(image.id)}
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
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Примечания:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Рекомендуемое соотношение сторон для изображений: 16:9</li>
            <li>Рекомендуемое разрешение: минимум 1920x1080 пикселей</li>
            <li>Активные изображения будут показаны на главной странице в указанном порядке</li>
            <li>Альтернативный текст важен для SEO и доступности</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroImages;
