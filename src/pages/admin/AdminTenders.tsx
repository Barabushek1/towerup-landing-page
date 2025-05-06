
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Search, Pencil, Trash2, FileText, Calendar, Check, X, Users } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/admin/ImageUploader';
import TenderApplicationsModal from '@/components/admin/TenderApplicationsModal';

interface TenderItem {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  category?: string;
  deadline?: string;
  documents?: string[];
  status: string;
  created_at: string;
}

const AdminTenders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [currentTenderId, setCurrentTenderId] = useState<string | null>(null);
  const [currentTender, setCurrentTender] = useState<TenderItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    category: '',
    deadline: '',
    status: 'active',
    documents: [] as string[],
  });

  const queryClient = useQueryClient();

  // Fetch tenders
  const { data: tenders, isLoading } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tenders:', error);
        throw new Error(error.message);
      }
      
      return data as TenderItem[];
    }
  });

  // Fetch applications count
  const { data: applicationsCount } = useQuery({
    queryKey: ['tender-applications-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tender_applications')
        .select('tender_id, count(*)', { count: 'exact', head: false })
        .throwOnError()
        .then(({ data }) => {
          // Process the data to create a map of tender_id -> count
          const counts: Record<string, number> = {};
          if (data) {
            data.forEach((item: any) => {
              if (item.tender_id) {
                counts[item.tender_id] = (counts[item.tender_id] || 0) + 1;
              }
            });
          }
          return counts;
        });
      
      return data;
    }
  });

  // Create tender mutation
  const createTenderMutation = useMutation({
    mutationFn: async (newTender: Omit<TenderItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('tenders')
        .insert(newTender)
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: 'Тендер создан',
        description: 'Тендер успешно добавлен в систему',
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Ошибка при создании тендера',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update tender mutation
  const updateTenderMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Omit<TenderItem, 'id' | 'created_at'>>) => {
      const { data, error } = await supabase
        .from('tenders')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: 'Тендер обновлен',
        description: 'Изменения успешно сохранены',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка при обновлении тендера',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete tender mutation
  const deleteTenderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tenders')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: 'Тендер удален',
        description: 'Тендер был успешно удален из системы',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка при удалении тендера',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle document upload
  const handleDocumentUpload = (url: string) => {
    const updatedDocuments = [...formData.documents, url];
    setFormData({ ...formData, documents: updatedDocuments });
  };

  // Remove document
  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    setFormData({ ...formData, documents: updatedDocuments });
  };

  // Open applications modal
  const openApplicationsModal = (tenderId: string) => {
    setCurrentTenderId(tenderId);
    setIsApplicationsModalOpen(true);
  };

  // Create tender
  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    createTenderMutation.mutate({
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || null,
      category: formData.category || null,
      status: formData.status,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      documents: formData.documents.length > 0 ? formData.documents : null,
    });
  };

  // Edit tender
  const handleEditTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTender?.id) return;

    updateTenderMutation.mutate({
      id: currentTender.id,
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || null,
      category: formData.category || null,
      status: formData.status,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      documents: formData.documents.length > 0 ? formData.documents : null,
    });
  };

  // Open edit dialog
  const openEditDialog = (tender: TenderItem) => {
    setCurrentTender(tender);
    setFormData({
      title: tender.title,
      description: tender.description,
      requirements: tender.requirements || '',
      category: tender.category || '',
      status: tender.status,
      deadline: tender.deadline ? new Date(tender.deadline).toISOString().split('T')[0] : '',
      documents: tender.documents || [],
    });
    setIsEditDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      category: '',
      deadline: '',
      status: 'active',
      documents: [],
    });
    setCurrentTender(null);
  };

  // Filter tenders based on search query
  const filteredTenders = tenders?.filter(tender => 
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tender.category && tender.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указан';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd.MM.yyyy') : 'Неверная дата';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активный</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Завершен</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Закрыт</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Define renderTendersTable function
  const renderTendersTable = (tendersData?: TenderItem[]) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-slate-700 p-4 rounded-md flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!tendersData || tendersData.length === 0) {
      return (
        <div className="text-center p-8 border border-dashed border-slate-700 rounded-md">
          <p className="text-slate-400">Нет тендеров для отображения</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tendersData.map(tender => (
          <div key={tender.id} className="border border-slate-700 p-4 rounded-md">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{tender.title}</h3>
                  {getStatusBadge(tender.status)}
                </div>
                {tender.category && (
                  <div className="text-sm text-slate-400">
                    Категория: {tender.category}
                  </div>
                )}
                <p className="text-sm text-slate-300 line-clamp-2">{tender.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Срок: {formatDate(tender.deadline)}
                  </span>
                  <span>Создан: {formatDate(tender.created_at)}</span>
                  
                  {/* Applications count badge */}
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 h-auto p-1"
                    onClick={() => openApplicationsModal(tender.id)}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      {applicationsCount && applicationsCount[tender.id] 
                        ? `${applicationsCount[tender.id]} заявок` 
                        : 'Нет заявок'}
                    </span>
                  </Button>
                </div>
                {tender.documents && tender.documents.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{tender.documents.length} документов</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(tender)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие нельзя отменить. Тендер будет удален навсегда.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTenderMutation.mutate(tender.id)}>
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Управление тендерами | Административная панель</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Управление тендерами</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Создать тендер
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать новый тендер</DialogTitle>
                <DialogDescription>
                  Заполните форму для создания нового тендера
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTender} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название тендера*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Введите название тендера"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Категория тендера (например, Строительство, Материалы и т.д.)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Подробное описание тендера"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Требования</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Требования к участникам тендера"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Срок подачи заявок</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select 
                      name="status" 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активный</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                        <SelectItem value="closed">Закрыт</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Документы</Label>
                    <div className="space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-800 p-2 rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate flex-1">{doc.split('/').pop()}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveDocument(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <ImageUploader onImageUploaded={handleDocumentUpload} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createTenderMutation.isPending}>
                    {createTenderMutation.isPending ? 'Создание...' : 'Создать тендер'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-slate-400" />
          <Input
            placeholder="Поиск тендеров..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
            <TabsTrigger value="closed">Закрытые</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="w-full">
            {renderTendersTable(filteredTenders)}
          </TabsContent>
          <TabsContent value="active" className="w-full">
            {renderTendersTable(filteredTenders?.filter(t => t.status === 'active'))}
          </TabsContent>
          <TabsContent value="completed" className="w-full">
            {renderTendersTable(filteredTenders?.filter(t => t.status === 'completed'))}
          </TabsContent>
          <TabsContent value="closed" className="w-full">
            {renderTendersTable(filteredTenders?.filter(t => t.status === 'closed'))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать тендер</DialogTitle>
            <DialogDescription>
              Внесите изменения в данные тендера
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTender} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Название тендера*</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Введите название тендера"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Категория</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Категория тендера"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Описание*</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Подробное описание тендера"
                  rows={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-requirements">Требования</Label>
                <Textarea
                  id="edit-requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Требования к участникам тендера"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Срок подачи заявок</Label>
                <Input
                  id="edit-deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Статус</Label>
                <Select 
                  name="status" 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                    <SelectItem value="closed">Закрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Документы</Label>
                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-800 p-2 rounded">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate flex-1">{doc.split('/').pop()}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveDocument(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <ImageUploader onImageUploaded={handleDocumentUpload} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateTenderMutation.isPending}>
                {updateTenderMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Applications Modal */}
      <TenderApplicationsModal 
        tenderId={currentTenderId}
        isOpen={isApplicationsModalOpen}
        onClose={() => {
          setIsApplicationsModalOpen(false);
          setCurrentTenderId(null);
          // Refresh application counts
          queryClient.invalidateQueries({ queryKey: ['tender-applications-count'] });
        }}
      />
    </>
  );
};

export default AdminTenders;
