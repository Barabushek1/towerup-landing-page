
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Mail, MailOpen, User, Calendar, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MessageItem | null>(null);

  // Fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as MessageItem[];
    }
  });

  // Update message mutation (mark as read)
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ read })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при обновлении сообщения: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Сообщение удалено",
        description: "Сообщение успешно удалено",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при удалении сообщения: ${error}`,
        variant: "destructive",
      });
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const markMessageAsRead = (id: string) => {
    updateMessageMutation.mutate({ id, read: true });
  };

  const openViewDialog = (message: MessageItem) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
    
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };

  const openDeleteDialog = (message: MessageItem) => {
    setCurrentMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (currentMessage) {
      deleteMessageMutation.mutate(currentMessage.id);
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
        <h1 className="text-3xl font-bold text-white">Сообщения от клиентов</h1>
      </div>

      {messages.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]"></TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Содержание</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((item) => (
                <TableRow 
                  key={item.id} 
                  className={!item.read ? "bg-slate-700/30" : ""}
                >
                  <TableCell>
                    {!item.read ? (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate">{item.message}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openViewDialog(item)}
                      >
                        {item.read ? (
                          <MailOpen className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(item)}
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
          <p className="text-slate-400">Пока нет сообщений</p>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Детали сообщения</DialogTitle>
          </DialogHeader>
          {currentMessage && (
            <div className="py-4">
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">От:</span>
                  <span>{currentMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email:</span>
                  <span>{currentMessage.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Дата:</span>
                  <span>{formatDate(currentMessage.date)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Сообщение:</h3>
                <div className="p-4 bg-slate-700/30 rounded-lg min-h-[100px] whitespace-pre-line">
                  {currentMessage.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Закрыть
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
          <p className="py-4">Вы уверены, что хотите удалить это сообщение? Это действие нельзя будет отменить.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMessageMutation.isPending}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMessageMutation.isPending}
            >
              {deleteMessageMutation.isPending ? (
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

export default AdminMessages;
