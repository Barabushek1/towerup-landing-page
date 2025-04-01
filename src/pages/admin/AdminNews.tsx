
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, X, Calendar, Image, Link as LinkIcon, Home, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { safelyFormatDate, validateImageUrl } from '@/utils/supabase-helpers';

interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  summary: string;
  content: string;
  image_url: string;
  additional_images?: string[];
  featured?: boolean;
}

type NewsInput = Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>;

const AdminNews: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewsInput>({
    title: '',
    published_at: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    image_url: '',
    additional_images: [],
    featured: false
  });
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [useUrlInput, setUseUrlInput] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper function to ensure the bucket exists before operations
  const ensureStorageBucketExists = async () => {
    try {
      await supabase.storage.getBucket('images');
      // Bucket exists
    } catch (error) {
      console.log('Bucket not found, attempting to create it');
      try {
        const { error: createError } = await supabase.storage.createBucket('images', {
          public: true
        });
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
      } catch (err) {
        console.error('Failed to create bucket:', err);
        // Continue execution even if bucket creation fails
        // as it might already exist but with limited permissions
      }
    }
  };

  // Fetch news data
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      // Ensure bucket exists
      await ensureStorageBucketExists();
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as NewsItem[];
    }
  });

  // Add news mutation
  const addNewsMutation = useMutation({
    mutationFn: async (newsItem: NewsInput) => {
      setIsSubmitting(true);
      try {
        // Format date properly to prevent date conversion issues
        const formattedDate = safelyFormatDate(newsItem.published_at || new Date().toISOString());

        // Filter out empty additional images
        const filteredAdditionalImages = (newsItem.additional_images || []).filter(url => url);

        const { data, error } = await supabase
          .from('news')
          .insert({
            title: newsItem.title,
            published_at: formattedDate,
            summary: newsItem.summary,
            content: newsItem.content,
            image_url: newsItem.image_url || null,
            additional_images: filteredAdditionalImages.length > 0 ? filteredAdditionalImages : null,
            featured: newsItem.featured || false
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Новость добавлена",
        description: "Новость успешно добавлена",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error adding news:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при сохранении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, newsItem }: { id: string; newsItem: NewsInput }) => {
      setIsSubmitting(true);
      try {
        // Format date properly to prevent date conversion issues
        const formattedDate = safelyFormatDate(newsItem.published_at || new Date().toISOString());

        // Filter out empty additional images
        const filteredAdditionalImages = (newsItem.additional_images || []).filter(url => url);

        const { data, error } = await supabase
          .from('news')
          .update({
            title: newsItem.title,
            published_at: formattedDate,
            summary: newsItem.summary,
            content: newsItem.content,
            image_url: newsItem.image_url || null,
            additional_images: filteredAdditionalImages.length > 0 ? filteredAdditionalImages : null,
            featured: newsItem.featured || false
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Новость обновлена",
        description: "Новость успешно обновлена",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating news:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при обновлении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Новость удалена",
        description: "Новость успешно удалена",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error deleting news:', error);
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при удалении новости: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      published_at: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      image_url: '',
      additional_images: [],
      featured: false
    });
    setNewImageUrl('');
    setCurrentNewsId(null);
    setUseUrlInput(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (newsItem: NewsItem) => {
    setCurrentNewsId(newsItem.id);
    setFormData({
      title: newsItem.title,
      published_at: newsItem.published_at.split('T')[0],
      summary: newsItem.summary,
      content: newsItem.content,
      image_url: newsItem.image_url || '',
      additional_images: newsItem.additional_images || [],
      featured: newsItem.featured || false
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCurrentNewsId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleMainImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.additional_images?.includes(newImageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additional_images: [...(prev.additional_images || []), newImageUrl]
      }));
      setNewImageUrl('');
    }
  };

  const handleAddUploadedImage = (imageUrl: string) => {
    if (imageUrl && !formData.additional_images?.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additional_images: [...(prev.additional_images || []), imageUrl]
      }));
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      additional_images: prev.additional_images?.filter(img => img !== imageUrl) || []
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.summary || !formData.content) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Check main image
    if (formData.image_url) {
      try {
        const isValid = await validateImageUrl(formData.image_url);
        if (!isValid) {
          toast({
            title: "Предупреждение",
            description: "Главное изображение может быть недоступно",
            variant: "warning",
          });
        }
      } catch (error) {
        console.error('Error validating image URL:', error);
        // Continue with submission despite validation error
      }
    }
    
    try {
      if (currentNewsId) {
        updateNewsMutation.mutate({ id: currentNewsId, newsItem: formData });
      } else {
        addNewsMutation.mutate(formData);
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      // Error handling is done in the mutation callbacks
    }
  };

  const handleDelete = () => {
    if (currentNewsId) {
      deleteNewsMutation.mutate(currentNewsId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-red-400">Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['news'] })}
          className="mt-4"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Управление новостями</h1>
        <Button onClick={openAddDialog} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить новость
        </Button>
      </div>

      {news.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Изображение</TableHead>
                <TableHead>Заголовок</TableHead>
                <TableHead className="w-[180px]">Дата</TableHead>
                <TableHead className="w-[80px]">На главной</TableHead>
                <TableHead className="text-right w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-16 h-12 rounded overflow-hidden">
                      <img 
                        src={item.image_url || 'https://placehold.co/200x120?text=No+Image'} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Error';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{formatDate(item.published_at)}</TableCell>
                  <TableCell>
                    {item.featured && <Home className="h-4 w-4 text-primary" />}
                  </TableCell>
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
          <p className="text-slate-400 mb-4">Новости еще не добавлены</p>
          <Button onClick={openAddDialog}>Добавить первую новость</Button>
        </div>
      )}

      {/* Add/Edit News Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentNewsId ? 'Редактировать новость' : 'Добавить новость'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Заголовок
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
              <Label htmlFor="published_at" className="text-right flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Дата
              </Label>
              <Input
                id="published_at"
                name="published_at"
                type="date"
                value={formData.published_at}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featured" className="text-right flex items-center">
                <Home className="mr-2 h-4 w-4" />
                На главной
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={handleCheckboxChange}
                  className="mr-2 data-[state=checked]:bg-primary"
                />
                <Label htmlFor="featured" className="text-sm text-slate-300">
                  Показывать новость на главной странице
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center mt-2">
                <Image className="mr-2 h-4 w-4" />
                Главное изображение
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
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mb-2 bg-slate-700 border-slate-600"
                    />
                    {formData.image_url && (
                      <div className="w-full h-32 bg-slate-700 rounded-md overflow-hidden">
                        <img 
                          src={formData.image_url} 
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
                    onImageUploaded={handleMainImageUploaded}
                    defaultImage={formData.image_url}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="summary" className="text-right mt-2">
                Короткое описание
              </Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={3}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Содержание
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="col-span-3 bg-slate-700 border-slate-600"
                placeholder="Введите подробный текст новости. Используйте двойную пустую строку для разделения параграфов."
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
                
                {formData.additional_images && formData.additional_images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {formData.additional_images.map((image, index) => (
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
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p className="py-4">Вы уверены, что хотите удалить эту новость? Это действие нельзя будет отменить.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;
