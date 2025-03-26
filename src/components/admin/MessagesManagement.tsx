
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setCurrentMessage(message);
    setIsDialogOpen(true);
    
    // Mark as read if not already
    if (!message.is_read) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', message.id);
          
        if (error) throw error;
        
        // Update local state
        setMessages(messages => messages.map(msg => 
          msg.id === message.id ? { ...msg, is_read: true } : msg
        ));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setMessages(messages => messages.map(msg => 
        msg.id === id ? { ...msg, is_read: !currentStatus } : msg
      ));
      
      toast({
        title: "Успешно",
        description: `Сообщение отмечено как ${!currentStatus ? 'прочитанное' : 'непрочитанное'}`,
      });
    } catch (error: any) {
      console.error('Error toggling read status:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось изменить статус сообщения",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Сообщение удалено",
      });
      
      setIsDeleteDialogOpen(false);
      fetchMessages();
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить сообщение",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-slate-200 font-benzin">Управление сообщениями</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <p className="text-slate-300">Сообщения отсутствуют</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300 w-12">Статус</TableHead>
                <TableHead className="text-slate-300">Отправитель</TableHead>
                <TableHead className="text-slate-300 hidden md:table-cell">Тема</TableHead>
                <TableHead className="text-slate-300 hidden lg:table-cell">Дата</TableHead>
                <TableHead className="text-slate-300 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow 
                  key={message.id}
                  className={message.is_read ? '' : 'bg-slate-700/20'}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {message.is_read ? (
                        <MailOpen size={16} className="text-slate-400" />
                      ) : (
                        <Mail size={16} className="text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">{message.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-300">
                    <div className="flex items-center">
                      <span className="truncate max-w-[250px]">{message.subject}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-400">{formatDate(message.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMessage(message)}
                        className="text-slate-300 hover:text-white"
                      >
                        Просмотр
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(message.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        title="Удалить"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-benzin">
              Просмотр сообщения
            </DialogTitle>
          </DialogHeader>
          
          {currentMessage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Отправитель</h4>
                  <p className="text-white">{currentMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Email</h4>
                  <p className="text-white">{currentMessage.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400">Тема</h4>
                <p className="text-white">{currentMessage.subject}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400">Сообщение</h4>
                <div className="mt-2 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <p className="text-white whitespace-pre-wrap">{currentMessage.message}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400">Дата получения</h4>
                <p className="text-white">{formatDate(currentMessage.created_at)}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_read"
                  checked={currentMessage.is_read}
                  onCheckedChange={() => handleToggleRead(currentMessage.id, currentMessage.is_read)}
                />
                <label htmlFor="is_read" className="text-sm font-medium text-slate-300">
                  Отметить как прочитанное
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Закрыть
            </Button>
            <a 
              href={`mailto:${currentMessage?.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90"
              >
                Ответить
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-benzin">Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-300">
            Вы уверены, что хотите удалить это сообщение? Это действие нельзя отменить.
          </p>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesManagement;
