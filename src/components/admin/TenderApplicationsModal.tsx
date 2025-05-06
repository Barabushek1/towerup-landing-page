
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Check, X, Download, Mail, Phone } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TenderApplicationsModalProps {
  tenderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TenderApplication {
  id: string;
  tender_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string | null;
  attachments: string[] | null;
  status: string;
  created_at: string;
}

const TenderApplicationsModal: React.FC<TenderApplicationsModalProps> = ({ tenderId, isOpen, onClose }) => {
  const [selectedApplication, setSelectedApplication] = useState<TenderApplication | null>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch applications for the tender
  const { data: applications, isLoading } = useQuery({
    queryKey: ['tender-applications', tenderId],
    queryFn: async () => {
      if (!tenderId) return [];
      
      const { data, error } = await supabase
        .from('tender_applications')
        .select('*')
        .eq('tender_id', tenderId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as TenderApplication[];
    },
    enabled: isOpen && !!tenderId
  });
  
  // Update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({id, status}: {id: string, status: string}) => {
      const { data, error } = await supabase
        .from('tender_applications')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tender-applications', tenderId] });
      toast({
        title: "Статус заявки обновлен",
        description: "Изменения успешно сохранены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка при обновлении",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete application
  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tender_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tender-applications', tenderId] });
      toast({
        title: "Заявка удалена",
        description: "Заявка была успешно удалена",
      });
      setSelectedApplication(null);
    },
    onError: (error) => {
      toast({
        title: "Ошибка при удалении",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Неверная дата';
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">На рассмотрении</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Одобрена</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонена</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Заявки на участие в тендере</DialogTitle>
          <DialogDescription>
            Просмотр и управление заявками от компаний
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-slate-300 rounded-md">
            <p>Нет заявок на участие в этом тендере</p>
          </div>
        ) : selectedApplication ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Подробная информация о заявке</h3>
              <Button variant="outline" onClick={() => setSelectedApplication(null)}>Назад к списку</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Компания:</h4>
                  <p className="text-base">{selectedApplication.company_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Контактное лицо:</h4>
                  <p className="text-base">{selectedApplication.contact_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${selectedApplication.email}`} className="text-blue-500 hover:underline">
                    {selectedApplication.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${selectedApplication.phone}`} className="text-blue-500 hover:underline">
                    {selectedApplication.phone}
                  </a>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Статус:</h4>
                  <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Дата заявки:</h4>
                  <p className="text-base">{formatDate(selectedApplication.created_at)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => updateStatusMutation.mutate({id: selectedApplication.id, status: 'approved'})}
                    disabled={selectedApplication.status === 'approved'}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Одобрить
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => updateStatusMutation.mutate({id: selectedApplication.id, status: 'rejected'})}
                    disabled={selectedApplication.status === 'rejected'}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Отклонить
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {selectedApplication.message && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Сообщение:</h4>
                <div className="p-4 bg-gray-50 rounded-md">
                  {selectedApplication.message.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {selectedApplication.attachments && selectedApplication.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Приложенные документы:</h4>
                <div className="space-y-2">
                  {selectedApplication.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="truncate max-w-xs">{attachment.split('/').pop()}</span>
                      <a 
                        href={attachment} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-500 hover:text-blue-600"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Скачать
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Удалить заявку</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Заявка будет удалена навсегда.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteApplicationMutation.mutate(selectedApplication.id)}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <div 
                key={application.id} 
                className="p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{application.company_name}</h3>
                  {getStatusBadge(application.status)}
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>Контакт: {application.contact_name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Email: {application.email}</span>
                    <span>{formatDate(application.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TenderApplicationsModal;
