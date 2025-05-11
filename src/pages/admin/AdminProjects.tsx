
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Project, fetchProjects, createProject, updateProject, deleteProject } from '@/utils/project-helpers';
import ImageUploader from '@/components/admin/ImageUploader';

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStatus('');
    setImageUrl('');
    setUrl('');
    setCurrentProject(null);
    setIsEditing(false);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setCurrentProject(project);
      setTitle(project.title);
      setDescription(project.description);
      setLocation(project.location);
      setStatus(project.status);
      setImageUrl(project.image_url || '');
      setUrl(project.url);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !status || !url) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const projectData = {
        title,
        description,
        location,
        status,
        image_url: imageUrl,
        url
      };

      let success;
      
      if (isEditing && currentProject?.id) {
        success = await updateProject(currentProject.id, projectData);
        if (success) {
          toast({
            title: 'Успешно',
            description: 'Проект успешно обновлен',
          });
        }
      } else {
        success = await createProject(projectData);
        if (success) {
          toast({
            title: 'Успешно',
            description: 'Новый проект добавлен',
          });
        }
      }

      if (success) {
        closeModal();
        loadProjects();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить проект',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при сохранении проекта',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      const success = await deleteProject(id);
      if (success) {
        toast({
          title: 'Успешно',
          description: 'Проект удален',
        });
        loadProjects();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить проект',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление Проектами</h1>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Добавить Проект
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Проекты</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Загрузка проектов...</p>
          ) : (
            <Table>
              <TableCaption>Список ваших проектов</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Местоположение</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[150px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Проектов не найдено</TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openModal(project)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать Проект' : 'Добавить Новый Проект'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название проекта"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание проекта"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Местоположение *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Введите местоположение"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус *</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Строится">Строится</SelectItem>
                  <SelectItem value="Завершен">Завершен</SelectItem>
                  <SelectItem value="Проектируется">Проектируется</SelectItem>
                  <SelectItem value="Приостановлен">Приостановлен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введите URL проекта"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Изображение</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL изображения"
                />
              </div>
              
              <ImageUploader
                onImageUploaded={(url) => setImageUrl(url)}
                defaultImage={imageUrl}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Отмена
              </Button>
              <Button type="submit">
                {isEditing ? 'Обновить' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
