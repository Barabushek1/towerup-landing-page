
import React, { useState } from 'react';
import { useAdminData, NewsItem } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, X, Calendar, Image, Link as LinkIcon, Home } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const AdminNews: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    imageUrl: '',
    additionalImages: [],
    featured: false
  });
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [useUrlInput, setUseUrlInput] = useState<boolean>(false);

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      imageUrl: '',
      additionalImages: [],
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
      date: newsItem.date,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
      additionalImages: newsItem.additionalImages || [],
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
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.additionalImages?.includes(newImageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), newImageUrl]
      }));
      setNewImageUrl('');
    }
  };

  const handleAddUploadedImage = (imageUrl: string) => {
    if (imageUrl && !formData.additionalImages?.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), imageUrl]
      }));
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages?.filter(img => img !== imageUrl) || []
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.imageUrl) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentNewsId) {
        updateNews(currentNewsId, formData);
        toast({
          title: "Новость обновлена",
          description: "Новость успешно обновлена",
        });
      } else {
        addNews(formData);
        toast({
          title: "Новость добавлена",
          description: "Новость успешно добавлена",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении новости",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (currentNewsId) {
      try {
        deleteNews(currentNewsId);
        toast({
          title: "Новость удалена",
          description: "Новость успешно удалена",
        });
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при удалении новости",
          variant: "destructive",
        });
      }
    }
  };

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
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Error';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.date}</TableCell>
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
              <Label htmlFor="date" className="text-right flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Дата
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
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
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mb-2 bg-slate-700 border-slate-600"
                    />
                    {formData.imageUrl && (
                      <div className="w-full h-32 bg-slate-700 rounded-md overflow-hidden">
                        <img 
                          src={formData.imageUrl} 
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
                    defaultImage={formData.imageUrl}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="excerpt" className="text-right mt-2">
                Короткое описание
              </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
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
                
                {formData.additionalImages && formData.additionalImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {formData.additionalImages.map((image, index) => (
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
          <p className="py-4">Вы уверены, что хотите удалить эту новость? Это действие нельзя будет отменить.</p>
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

export default AdminNews;
