
import React, { useState } from 'react';
import { useAdminData, PartnerItem } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Link as LinkIcon, Image } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const AdminPartners: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner } = useAdminData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<PartnerItem, 'id'>>({
    name: '',
    logo: '',
    url: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      url: '',
    });
    setCurrentPartnerId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (partnerItem: PartnerItem) => {
    setCurrentPartnerId(partnerItem.id);
    setFormData({
      name: partnerItem.name,
      logo: partnerItem.logo,
      url: partnerItem.url,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCurrentPartnerId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, logo: imageUrl }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.url) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentPartnerId) {
        updatePartner(currentPartnerId, formData);
        toast({
          title: "Партнер обновлен",
          description: "Информация о партнере успешно обновлена",
        });
      } else {
        addPartner(formData);
        toast({
          title: "Партнер добавлен",
          description: "Новый партнер успешно добавлен",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (currentPartnerId) {
      try {
        deletePartner(currentPartnerId);
        toast({
          title: "Партнер удален",
          description: "Партнер успешно удален",
        });
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при удалении партнера",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Управление партнерами</h1>
        <Button onClick={openAddDialog} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить партнера
        </Button>
      </div>

      {partners.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Логотип</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-700 flex items-center justify-center">
                      {item.logo ? (
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image className="h-6 w-6 text-slate-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate max-w-[250px] inline-block"
                    >
                      {item.url}
                    </a>
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
          <p className="text-slate-400 mb-4">Партнеры еще не добавлены</p>
          <Button onClick={openAddDialog}>Добавить первого партнера</Button>
        </div>
      )}

      {/* Add/Edit Partner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>{currentPartnerId ? 'Редактировать партнера' : 'Добавить партнера'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-700 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center mt-2">
                <Image className="mr-2 h-4 w-4" />
                Логотип
              </Label>
              <div className="col-span-3">
                <ImageUploader 
                  onImageUploaded={handleLogoUploaded}
                  defaultImage={formData.logo}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                Веб-сайт URL
              </Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="col-span-3 bg-slate-700 border-slate-600"
              />
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
          <p className="py-4">Вы уверены, что хотите удалить этого партнера? Это действие нельзя будет отменить.</p>
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

export default AdminPartners;
