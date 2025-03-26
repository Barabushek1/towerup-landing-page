
import React, { useState } from 'react';
import { useAdminData, MessageItem } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Mail, MailOpen, User, Calendar } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const { messages, markMessageAsRead, deleteMessage } = useAdminData();
  const { toast } = useToast();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MessageItem | null>(null);

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

  const openViewDialog = (message: MessageItem) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
    
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
  };

  const openDeleteDialog = (message: MessageItem) => {
    setCurrentMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (currentMessage) {
      try {
        deleteMessage(currentMessage.id);
        toast({
          title: "Message Deleted",
          description: "The message has been deleted successfully",
        });
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while deleting the message",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
      </div>

      {messages.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((item) => (
                <TableRow 
                  key={item.id} 
                  className={!item.isRead ? "bg-slate-700/30" : ""}
                >
                  <TableCell>
                    {!item.isRead ? (
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
                        {item.isRead ? (
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
          <p className="text-slate-400">No messages yet</p>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {currentMessage && (
            <div className="py-4">
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">From:</span>
                  <span>{currentMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email:</span>
                  <span>{currentMessage.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Date:</span>
                  <span>{formatDate(currentMessage.date)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Message:</h3>
                <div className="p-4 bg-slate-700/30 rounded-lg min-h-[100px] whitespace-pre-line">
                  {currentMessage.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this message? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
