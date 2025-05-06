
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2, Search, Filter, Download, Mail, Phone, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface TenderSubmission {
  id: string;
  tender_id: string;
  tender: {
    title: string;
  } | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string | null;
  attachments: string[] | null;
  created_at: string;
}

const AdminTenderSubmissions: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<TenderSubmission | null>(null);
  
  // Fetch tender submissions
  const { data: submissions, isLoading, isError, refetch } = useQuery({
    queryKey: ['tender-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tender_applications')
        .select('*, tender:tender_id(title)')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching submissions",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as TenderSubmission[];
    },
  });
  
  // Filter submissions based on search query and status filter
  const filteredSubmissions = submissions?.filter(submission => {
    const matchesSearch = searchQuery === '' || 
      submission.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.tender?.title && submission.tender.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = !statusFilter || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Update submission status
  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('tender_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Submission status updated to ${status}`,
      });
      
      refetch();
      setSelectedSubmission(null);
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Delete submission
  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tender_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Submission deleted",
        description: "The submission has been deleted successfully",
      });
      
      refetch();
      setSelectedSubmission(null);
    } catch (error: any) {
      toast({
        title: "Error deleting submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">На рассмотрении</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Принята</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонена</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Заявки на тендеры</h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                type="search"
                placeholder="Поиск заявок..." 
                className="pl-9 bg-slate-800 border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-slate-800 border-slate-700">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                <DropdownMenuLabel>Фильтр по статусу</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className={!statusFilter ? "bg-slate-700" : ""}
                  onClick={() => setStatusFilter(null)}
                >
                  Все заявки
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === 'pending' ? "bg-slate-700" : ""}
                  onClick={() => setStatusFilter('pending')}
                >
                  На рассмотрении
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === 'approved' ? "bg-slate-700" : ""}
                  onClick={() => setStatusFilter('approved')}
                >
                  Принятые
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === 'rejected' ? "bg-slate-700" : ""}
                  onClick={() => setStatusFilter('rejected')}
                >
                  Отклоненные
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Произошла ошибка при загрузке данных
          </div>
        ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-900">
                    <TableHead>Компания</TableHead>
                    <TableHead>Тендер</TableHead>
                    <TableHead>Контактное лицо</TableHead>
                    <TableHead className="hidden md:table-cell">Дата заявки</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map(submission => (
                    <TableRow 
                      key={submission.id}
                      className="hover:bg-slate-700/50 cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {submission.company_name}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {submission.tender?.title || 'Неизвестный тендер'}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {submission.contact_name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell whitespace-nowrap">
                        {formatDate(submission.created_at)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(submission);
                          }}
                        >
                          Детали
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-center text-slate-400">
              {searchQuery || statusFilter ? 
                "Заявки с указанными критериями не найдены" :
                "Нет заявок на тендеры"}
            </div>
          </div>
        )}
      </div>
      
      {/* Submission details dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Детали заявки на тендер</DialogTitle>
              <DialogDescription className="text-slate-400">
                Подробная информация о заявке от компании {selectedSubmission.company_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Submission details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Название тендера</h3>
                    <p className="text-lg font-medium">{selectedSubmission.tender?.title || 'Неизвестный тендер'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Компания</h3>
                    <p className="text-lg font-medium">{selectedSubmission.company_name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Контактное лицо</h3>
                    <p>{selectedSubmission.contact_name}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${selectedSubmission.email}`} className="text-blue-400 hover:text-blue-300">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <a href={`tel:${selectedSubmission.phone}`} className="text-blue-400 hover:text-blue-300">
                      {selectedSubmission.phone}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Статус заявки</h3>
                    <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Дата подачи</h3>
                    <p>{formatDate(selectedSubmission.created_at)}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-500/20"
                      onClick={() => updateStatus(selectedSubmission.id, 'approved')}
                      disabled={selectedSubmission.status === 'approved'}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Принять заявку
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-500/20"
                      onClick={() => updateStatus(selectedSubmission.id, 'rejected')}
                      disabled={selectedSubmission.status === 'rejected'}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Отклонить заявку
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-slate-700" />
              
              {/* Message */}
              {selectedSubmission.message && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400">Сообщение</h3>
                  <div className="p-4 bg-slate-800 rounded-md">
                    {selectedSubmission.message.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Attachments */}
              {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400">Приложенные документы</h3>
                  <div className="space-y-2">
                    {selectedSubmission.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                        <span className="truncate max-w-xs">{attachment.split('/').pop()}</span>
                        <a 
                          href={attachment} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-blue-400 hover:text-blue-300"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Скачать
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Закрыть
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Удалить заявку
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Это действие нельзя отменить. Заявка будет навсегда удалена из базы данных.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                        Отмена
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteSubmission(selectedSubmission.id)}
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminTenderSubmissions;
