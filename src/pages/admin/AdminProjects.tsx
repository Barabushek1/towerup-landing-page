
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
import { PlusCircle, Pencil, Trash2, Loader2, Star, Eye, Globe } from 'lucide-react';
import { Project, fetchProjects, createProject, updateProject, deleteProject } from '@/utils/project-helpers';
import ImageUploader from '@/components/admin/ImageUploader';
import { createStorageBucket } from '@/utils/create-storage-bucket';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { language } = useLanguage();

  // Form state
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [titleUz, setTitleUz] = useState('');
  
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [descriptionUz, setDescriptionUz] = useState('');
  
  const [location, setLocation] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationRu, setLocationRu] = useState('');
  const [locationUz, setLocationUz] = useState('');
  
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState('default');

  // Initialize the storage bucket when component loads
  useEffect(() => {
    const initializeStorage = async () => {
      await createStorageBucket();
    };
    
    initializeStorage();
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить проекты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setTitleEn('');
    setTitleRu('');
    setTitleUz('');
    
    setDescription('');
    setDescriptionEn('');
    setDescriptionRu('');
    setDescriptionUz('');
    
    setLocation('');
    setLocationEn('');
    setLocationRu('');
    setLocationUz('');
    
    setStatus('');
    setImageUrl('');
    setUrl('');
    setIsFeatured(false);
    setIsActive(true);
    setCurrentProject(null);
    setIsEditing(false);
    setActiveTab('default');
  };

  const openModal = (project?: Project) => {
    if (project) {
      setCurrentProject(project);
      
      // Set default values
      setTitle(project.title || '');
      setDescription(project.description || '');
      setLocation(project.location || '');
      setStatus(project.status || '');
      setImageUrl(project.image_url || '');
      setUrl(project.url || '');
      setIsFeatured(project.is_featured || false);
      setIsActive(project.is_active !== false); // Default to true if undefined
      
      // Set multilingual values
      setTitleEn(project.title_en || '');
      setTitleRu(project.title_ru || '');
      setTitleUz(project.title_uz || '');
      
      setDescriptionEn(project.description_en || '');
      setDescriptionRu(project.description_ru || '');
      setDescriptionUz(project.description_uz || '');
      
      setLocationEn(project.location_en || '');
      setLocationRu(project.location_ru || '');
      setLocationUz(project.location_uz || '');
      
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
      setSubmitting(true);
      const projectData = {
        title,
        description,
        location,
        status,
        image_url: imageUrl,
        url,
        is_featured: isFeatured,
        is_active: isActive,
        // Multilingual fields
        title_en: titleEn || null,
        title_ru: titleRu || null,
        title_uz: titleUz || null,
        description_en: descriptionEn || null,
        description_ru: descriptionRu || null,
        description_uz: descriptionUz || null,
        location_en: locationEn || null,
        location_ru: locationRu || null,
        location_uz: locationUz || null
      };

      let success;
      
      if (isEditing && currentProject?.id) {
        console.log(`Updating project ${currentProject.id} with:`, projectData);
        success = await updateProject(currentProject.id, projectData);
        if (success) {
          toast({
            title: 'Успешно',
            description: 'Проект успешно обновлен',
          });
        }
      } else {
        console.log('Creating new project with:', projectData);
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
    } finally {
      setSubmitting(false);
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

  const toggleFeature = async (project: Project) => {
    const updated = await updateProject(project.id, { 
      is_featured: !project.is_featured
    });
    if (updated) {
      loadProjects();
    }
  };

  const toggleActive = async (project: Project) => {
    const updated = await updateProject(project.id, { 
      is_active: !project.is_active
    });
    if (updated) {
      loadProjects();
    }
  };

  // Helper function to get the display title in the current language
  const getLocalizedTitle = (project: Project) => {
    if (language === 'en' && project.title_en) return project.title_en;
    if (language === 'ru' && project.title_ru) return project.title_ru;
    if (language === 'uz' && project.title_uz) return project.title_uz;
    return project.title;
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
                  <TableHead className="text-center">Избранное</TableHead>
                  <TableHead className="text-center">Активный</TableHead>
                  <TableHead className="w-[150px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Проектов не найдено</TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{getLocalizedTitle(project)}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={project.is_featured ? "text-yellow-500" : "text-gray-400"}
                          onClick={() => toggleFeature(project)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={project.is_active !== false ? "text-green-500" : "text-gray-400"}
                          onClick={() => toggleActive(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать Проект' : 'Добавить Новый Проект'}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="default">Основная информация</TabsTrigger>
              <TabsTrigger value="en" className="flex items-center gap-1">
                <Globe className="h-4 w-4" /> English
              </TabsTrigger>
              <TabsTrigger value="ru" className="flex items-center gap-1">
                <Globe className="h-4 w-4" /> Русский
              </TabsTrigger>
              <TabsTrigger value="uz" className="flex items-center gap-1">
                <Globe className="h-4 w-4" /> O'zbek
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="default" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название (основное) *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название проекта"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание (основное) *</Label>
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
                  <Label htmlFor="location">Местоположение (основное) *</Label>
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
                  <ImageUploader
                    onImageUploaded={(url) => {
                      console.log("Image uploaded:", url);
                      setImageUrl(url);
                    }}
                    defaultImage={imageUrl}
                    className="mb-2"
                  />
                  {imageUrl && (
                    <Input
                      id="image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL изображения"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_featured" 
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="is_featured">Избранный проект</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">Активный проект</Label>
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Название (English)</Label>
                  <Input
                    id="title_en"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter project name in English"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">Описание (English)</Label>
                  <Textarea
                    id="description_en"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Enter project description in English"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_en">Местоположение (English)</Label>
                  <Input
                    id="location_en"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    placeholder="Enter project location in English"
                  />
                </div>
              </TabsContent>

              <TabsContent value="ru" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ru">Название (Русский)</Label>
                  <Input
                    id="title_ru"
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    placeholder="Введите название проекта на русском"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ru">Описание (Русский)</Label>
                  <Textarea
                    id="description_ru"
                    value={descriptionRu}
                    onChange={(e) => setDescriptionRu(e.target.value)}
                    placeholder="Введите описание проекта на русском"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_ru">Местоположение (Русский)</Label>
                  <Input
                    id="location_ru"
                    value={locationRu}
                    onChange={(e) => setLocationRu(e.target.value)}
                    placeholder="Введите местоположение на русском"
                  />
                </div>
              </TabsContent>

              <TabsContent value="uz" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_uz">Название (O'zbek)</Label>
                  <Input
                    id="title_uz"
                    value={titleUz}
                    onChange={(e) => setTitleUz(e.target.value)}
                    placeholder="O'zbek tilida loyiha nomini kiriting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_uz">Описание (O'zbek)</Label>
                  <Textarea
                    id="description_uz"
                    value={descriptionUz}
                    onChange={(e) => setDescriptionUz(e.target.value)}
                    placeholder="O'zbek tilida loyiha tavsifini kiriting"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_uz">Местоположение (O'zbek)</Label>
                  <Input
                    id="location_uz"
                    value={locationUz}
                    onChange={(e) => setLocationUz(e.target.value)}
                    placeholder="O'zbek tilida loyiha manzilini kiriting"
                  />
                </div>
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
                  Отмена
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Обновление...' : 'Создание...'}
                    </>
                  ) : (
                    isEditing ? 'Обновить' : 'Создать'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
