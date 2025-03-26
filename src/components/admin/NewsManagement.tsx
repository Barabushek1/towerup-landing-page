
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  published_at: string;
  created_at: string;
}

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<News> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: News) => {
    if (item) {
      setCurrentNews(item);
    } else {
      setCurrentNews({
        title: '',
        summary: '',
        content: '',
        image_url: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentNews(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async () => {
    if (!currentNews?.title || !currentNews?.summary || !currentNews?.content) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentNews.id) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update({
            title: currentNews.title,
            summary: currentNews.summary,
            content: currentNews.content,
            image_url: currentNews.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentNews.id);

        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Новость обновлена",
        });
      } else {
        // Create new news
        const { error } = await supabase
          .from('news')
          .insert([{
            title: currentNews.title,
            summary: currentNews.summary,
            content: currentNews.content,
            image_url: currentNews.image_url,
          }]);

        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Новость создана",
        });
      }

      setIsDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить новость",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Новость удалена",
      });
      
      setIsDeleteDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить новость",
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
        <h3 className="text-xl font-medium text-slate-200 font-benzin">Управление новостями</h3>
        <Button 
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Добавить новость
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-8 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <p className="text-slate-300">Новости отсутствуют</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Заголовок</TableHead>
                <TableHead className="text-slate-300 hidden md:table-cell">Краткое описание</TableHead>
                <TableHead className="text-slate-300 hidden lg:table-cell">Дата публикации</TableHead>
                <TableHead className="text-slate-300 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-white">{item.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-300">{item.summary.length > 50 ? `${item.summary.substring(0, 50)}...` : item.summary}</TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-400">{formatDate(item.published_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(item)}
                        title="Редактировать"
                      >
                        <Edit size={16} className="text-slate-300" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(item.id);
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-benzin">
              {currentNews?.id ? 'Редактировать новость' : 'Добавить новость'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                Заголовок *
              </label>
              <Input
                id="title"
                name="title"
                value={currentNews?.title || ''}
                onChange={handleChange}
                placeholder="Введите заголовок"
                className="bg-slate-700/50 border-slate-600/50 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-slate-300 mb-1">
                Краткое описание *
              </label>
              <Textarea
                id="summary"
                name="summary"
                value={currentNews?.summary || ''}
                onChange={handleChange}
                placeholder="Введите краткое описание"
                className="bg-slate-700/50 border-slate-600/50 text-white min-h-[80px]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">
                Содержание *
              </label>
              <Textarea
                id="content"
                name="content"
                value={currentNews?.content || ''}
                onChange={handleChange}
                placeholder="Введите содержание новости"
                className="bg-slate-700/50 border-slate-600/50 text-white min-h-[120px]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-slate-300 mb-1">
                URL изображения
              </label>
              <Input
                id="image_url"
                name="image_url"
                value={currentNews?.image_url || ''}
                onChange={handleChange}
                placeholder="Введите URL изображения"
                className="bg-slate-700/50 border-slate-600/50 text-white"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {currentNews?.id ? 'Обновить' : 'Создать'}
            </Button>
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
            Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.
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

export default NewsManagement;
