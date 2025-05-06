
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2, Download, Mail, Phone, User, FileText, Trash, Eye, Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VacancyApplication {
  id: string;
  vacancy_id: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter?: string;
  attachments?: string[];
  status: string;
  created_at: string;
  vacancy?: {
    title: string;
  }
}

const AdminVacancyApplications: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<VacancyApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch applications with vacancy details
  const {
    data: applications,
    isLoading,
    error
  } = useQuery({
    queryKey: ['vacancy-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancy_applications')
        .select(`
          *,
          vacancy:vacancies(title)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      return data as VacancyApplication[];
    }
  });

  // Update application status mutation
  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from('vacancy_applications')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy-applications'] });
      toast({
        title: "Статус обновлен",
        description: "Статус заявки был успешно обновлен"
      });
    },
    onError: error => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить статус: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete application mutation
  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vacancy_applications').delete().eq('id', id);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy-applications'] });
      toast({
        title: "Заявка удалена",
        description: "Заявка на вакансию была успешно удалена"
      });
      setIsDeleteDialogOpen(false);
    },
    onError: error => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить заявку: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle file download
  const handleDownloadFile = async (fileUrl: string) => {
    try {
      // Extract the file name from the URL
      const fileName = fileUrl.split('/').pop() || 'download';
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Загрузка началась",
        description: `Файл ${fileName} загружается`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить файл",
        variant: "destructive"
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Новая</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">В обработке</Badge>;
      case 'contacted':
        return <Badge className="bg-green-500">Связались</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонена</Badge>;
      case 'hired':
        return <Badge className="bg-green-700">Принят</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle view details
  const handleViewDetails = (application: VacancyApplication) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };

  // Handle status change
  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatus.mutate({
      id: applicationId,
      status: newStatus
    });
  };

  // Handle delete
  const handleDelete = (applicationId: string) => {
    setSelectedApplication(applications?.find(app => app.id === applicationId) || null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplication?.id) {
      deleteApplication.mutate(selectedApplication.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="font-semibold">Ошибка загрузки данных:</p>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Заявки на вакансии</h2>
        <p className="text-muted-foreground">
          Управление заявками от соискателей
        </p>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Вакансия</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Файлы</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications && applications.length > 0 ? (
              applications.map(application => (
                <TableRow key={application.id}>
                  <TableCell className="font-mono">
                    {formatDate(application.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{application.full_name}</div>
                    <div className="text-sm text-muted-foreground">{application.email}</div>
                  </TableCell>
                  <TableCell>
                    {application.vacancy ? application.vacancy.title : "Неизвестная вакансия"}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {application.attachments && application.attachments.length > 0 ? (
                      <Badge variant="outline" className="bg-slate-700 text-white">
                        {application.attachments.length} {application.attachments.length === 1 ? 'файл' : 'файла'}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Нет файлов</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewDetails(application)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(application.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Нет доступных заявок
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      {selectedApplication && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Детали заявки</DialogTitle>
              <DialogDescription>
                Отправлено {formatDate(selectedApplication.created_at)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Status Select */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Статус:</span>
                <Select 
                  value={selectedApplication.status} 
                  onValueChange={value => handleStatusChange(selectedApplication.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in_progress">В обработке</SelectItem>
                    <SelectItem value="contacted">Связались</SelectItem>
                    <SelectItem value="rejected">Отклонено</SelectItem>
                    <SelectItem value="hired">Принят</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              {/* Vacancy */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2" />
                  <span>Вакансия</span>
                </div>
                <p className="font-medium">
                  {selectedApplication.vacancy ? selectedApplication.vacancy.title : "Неизвестная вакансия"}
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>Полное имя</span>
                  </div>
                  <p className="font-medium">{selectedApplication.full_name}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Телефон</span>
                  </div>
                  <p className="font-medium">{selectedApplication.phone}</p>
                </div>
              </div>
              
              {selectedApplication.cover_letter && (
                <>
                  <Separator />
                  
                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Сопроводительное письмо</span>
                    </div>
                    <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                      {selectedApplication.cover_letter}
                    </div>
                  </div>
                </>
              )}
              
              {/* Attachments if any */}
              {selectedApplication.attachments && selectedApplication.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Прикрепленные файлы:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedApplication.attachments.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-muted rounded-md hover:bg-muted/80"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="text-sm truncate">{file.split('/').pop()}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => handleDownloadFile(file)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            <span>Скачать</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту заявку? Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVacancyApplications;
