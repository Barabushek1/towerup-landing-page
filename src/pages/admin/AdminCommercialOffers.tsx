
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Check, 
  Trash, 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Phone, 
  User,
  Building,
  FileText,
  Tags
} from 'lucide-react';
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
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommercialOffer {
  id: string;
  applicant_type: 'individual' | 'company';
  full_name: string;
  company_name?: string;
  email: string;
  phone: string;
  description: string;
  attachments?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminCommercialOffers: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<CommercialOffer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Fetch commercial offers
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['commercial-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commercial_offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as CommercialOffer[];
    }
  });

  // Update offer status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('commercial_offers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-offers'] });
      toast({
        title: "Статус обновлен",
        description: "Статус предложения был успешно обновлен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить статус: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete offer mutation
  const deleteOffer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('commercial_offers')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-offers'] });
      toast({
        title: "Предложение удалено",
        description: "Коммерческое предложение было успешно удалено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить предложение: ${error.message}`,
        variant: "destructive"
      });
    }
  });

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
        return <Badge className="bg-blue-500">Новое</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">В обработке</Badge>;
      case 'contacted':
        return <Badge className="bg-green-500">Связались</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонено</Badge>;
      case 'completed':
        return <Badge className="bg-green-700">Завершено</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle view details
  const handleViewDetails = (offer: CommercialOffer) => {
    setSelectedOffer(offer);
    setIsDetailsOpen(true);
  };

  // Handle status change
  const handleStatusChange = (offerId: string, newStatus: string) => {
    updateStatus.mutate({ id: offerId, status: newStatus });
  };

  // Handle delete
  const handleDelete = (offerId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это предложение? Это действие нельзя отменить.')) {
      deleteOffer.mutate(offerId);
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
        <h2 className="text-3xl font-bold tracking-tight">Коммерческие предложения</h2>
        <p className="text-muted-foreground">
          Управление коммерческими предложениями от потенциальных партнеров
        </p>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-mono">
                    {formatDate(offer.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{offer.full_name}</div>
                    <div className="text-sm text-muted-foreground">{offer.email}</div>
                  </TableCell>
                  <TableCell>
                    {offer.applicant_type === 'company' 
                      ? <Badge variant="outline" className="bg-blue-50">Компания</Badge> 
                      : <Badge variant="outline" className="bg-green-50">Физ. лицо</Badge>
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDetails(offer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Нет доступных коммерческих предложений
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      {selectedOffer && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Детали коммерческого предложения</DialogTitle>
              <DialogDescription>
                Отправлено {formatDate(selectedOffer.created_at)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Status Select */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Статус:</span>
                <Select
                  value={selectedOffer.status}
                  onValueChange={(value) => handleStatusChange(selectedOffer.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новое</SelectItem>
                    <SelectItem value="in_progress">В обработке</SelectItem>
                    <SelectItem value="contacted">Связались</SelectItem>
                    <SelectItem value="rejected">Отклонено</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>Полное имя</span>
                  </div>
                  <p className="font-medium">{selectedOffer.full_name}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Tags className="h-4 w-4 mr-2" />
                    <span>Тип заявителя</span>
                  </div>
                  <p className="font-medium">
                    {selectedOffer.applicant_type === 'company' ? 'Компания' : 'Физическое лицо'}
                  </p>
                </div>
                
                {selectedOffer.company_name && (
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-2" />
                      <span>Компания</span>
                    </div>
                    <p className="font-medium">{selectedOffer.company_name}</p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{selectedOffer.email}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Телефон</span>
                  </div>
                  <p className="font-medium">{selectedOffer.phone}</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Описание предложения</span>
                </div>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedOffer.description}
                </div>
              </div>
              
              {/* Attachments if any */}
              {selectedOffer.attachments && selectedOffer.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Прикрепленные файлы:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedOffer.attachments.map((file, index) => (
                        <a 
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-muted rounded-md hover:bg-muted/80"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-sm truncate">{file.split('/').pop()}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminCommercialOffers;
