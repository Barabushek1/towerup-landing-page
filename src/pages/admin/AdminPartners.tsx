
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Link as LinkIcon, Image, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

type PartnerInput = Omit<Partner, 'id'>;

const AdminPartners: React.FC = () => {
  const { toast } = useToast();
  const { admin } = useAdmin();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PartnerInput>({
    name: '',
    logo_url: '',
    website_url: '',
  });

  // Log audit trail for partner actions
  const logAuditTrail = async (actionType: string, details?: any) => {
    try {
      // Collect system information
      const userAgent = navigator.userAgent;
      
      // Try to get IP address (this is a client-side approximation)
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      await supabase.from('admin_audit_logs').insert({
        action_type: actionType,
        admin_email: admin?.email || 'Unknown',
        ip_address: ip,
        user_agent: userAgent,
        details: details ? JSON.stringify(details) : null
      });
    } catch (error) {
      console.error('Failed to log audit trail:', error);
    }
  };

  // Fetch partners
  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data as Partner[];
    }
  });

  // Add partner mutation
  const addPartnerMutation = useMutation({
    mutationFn: async (partner: PartnerInput) => {
      const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Log audit trail for partner creation
      await logAuditTrail('PARTNER_CREATED', { partnerName: partner.name });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Партнер добавлен",
        description: "Новый партнер успешно добавлен",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при сохранении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update partner mutation
  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, partner }: { id: string; partner: PartnerInput }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(partner)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Log audit trail for partner update
      await logAuditTrail('PARTNER_UPDATED', { 
        partnerId: id, 
        partnerName: partner.name 
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Партнер обновлен",
        description: "Информация о партнере успешно обновлена",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при обновлении данных: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete partner mutation
  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Log audit trail for partner deletion
      await logAuditTrail('PARTNER_DELETED', { partnerId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Партнер удален",
        description: "Партнер успешно удален",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при удалении партнера: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
    });
    setCurrentPartnerId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (partner: Partner) => {
    setCurrentPartnerId(partner.id);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
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
    setFormData(prev => ({ ...prev, logo_url: imageUrl }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.website_url) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    if (currentPartnerId) {
      updatePartnerMutation.mutate({ id: currentPartnerId, partner: formData });
    } else {
      addPartnerMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (currentPartnerId) {
      deletePartnerMutation.mutate(currentPartnerId);
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
      </div>
    );
  }

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
                      {item.logo_url ? (
                        <img 
                          src={item.logo_url} 
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
                      href={item.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate max-w-[250px] inline-block"
                    >
                      {item.website_url}
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
                  defaultImage={formData.logo_url}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website_url" className="text-right flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                Веб-сайт URL
              </Label>
              <Input
                id="website_url"
                name="website_url"
                value={formData.website_url}
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
            <Button 
              onClick={handleSubmit}
              disabled={addPartnerMutation.isPending || updatePartnerMutation.isPending}
            >
              {(addPartnerMutation.isPending || updatePartnerMutation.isPending) ? (
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
          <p className="py-4">Вы уверены, что хотите удалить этого партнера? Это действие нельзя будет отменить.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deletePartnerMutation.isPending}
            >
              {deletePartnerMutation.isPending ? (
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

export default AdminPartners;
