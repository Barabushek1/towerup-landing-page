import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Pencil, Trash2, ImagePlus, X, Plus } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  fetchFutureProjects,
  addFutureProject,
  updateFutureProject,
  deleteFutureProject,
  generateSlug,
  type FutureProject
} from '@/utils/future-project-helpers';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminFutureProjects: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<FutureProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<FutureProject> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<{title: string, description: string}[]>([
    { title: '', description: '' }
  ]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchFutureProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (!isEditing || (isEditing && currentProject?.slug === slug)) {
      const generatedSlug = await generateSlug(newTitle);
      setSlug(generatedSlug);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, { title: '', description: '' }]);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedFeatures = features.map((feature, i) => {
      if (i === index) {
        return { ...feature, [field]: value };
      }
      return feature;
    });
    setFeatures(updatedFeatures);
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setLocation('');
    setCompletionDate('');
    setStatus('upcoming');
    setFeatured(false);
    setCoverImage('');
    setGalleryImages([]);
    setFeatures([{ title: '', description: '' }]);
    setCurrentProject(null);
    setIsEditing(false);
    setActiveTab('details');
  };

  const openModal = (project?: FutureProject) => {
    if (project) {
      setCurrentProject(project);
      setTitle(project.title);
      setSlug(project.slug);
      setDescription(project.description);
      setLocation(project.location || '');
      setCompletionDate(project.completionDate || '');
      setStatus(project.status);
      setFeatured(project.featured || false);
      setCoverImage(project.coverImage || '');
      setGalleryImages(project.galleryImages || []);
      setFeatures(project.features?.length
        ? project.features.map(f => typeof f === 'object' ? f : { title: '', description: '' })
        : [{ title: '', description: '' }]
      );
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

    if (!title || !slug || !description) {
      toast({
        title: t('admin.requiredFields'),
        description: t('admin.titleSlugDescriptionRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const projectData = {
        title,
        slug,
        description,
        location,
        completionDate,
        status,
        featured,
        coverImage,
        galleryImages,
        features: features.filter(f => f.title || f.description)
      };

      if (isEditing && currentProject?.id) {
        const updated = await updateFutureProject(currentProject.id, projectData);
        if (updated) {
          toast({
            title: t('admin.projectUpdated'),
            description: t('admin.futureProjectUpdatedSuccess'),
          });
          loadProjects();
          closeModal();
        }
      } else {
        const added = await addFutureProject(projectData as Omit<FutureProject, 'id' | 'createdAt' | 'updatedAt'>);
        if (added) {
          toast({
            title: t('admin.projectAdded'),
            description: t('admin.newFutureProjectAddedSuccess'),
          });
          loadProjects();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.failedToSaveProject'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm(t('admin.confirmDeleteProject'))) {
      const deleted = await deleteFutureProject(id);
      if (deleted) {
        toast({
          title: t('admin.projectDeleted'),
          description: t('admin.futureProjectDeletedSuccess'),
        });
        loadProjects();
      } else {
        toast({
          title: t('admin.error'),
          description: t('admin.failedToDeleteProject'),
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-50">Управление Будущими Проектами</h1>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <PlusCircle size={16} />
            Добавить Новый Проект
          </Button>
        </div>

        <Card className="bg-zinc-800 border-zinc-700 text-zinc-50">
          <CardHeader>
            <CardTitle>Будущие Проекты</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Загрузка проектов...</p>
            ) : (
              <Table>
                <TableCaption>Список будущих проектов</TableCaption>
                <TableHeader>
                  <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-400">Название</TableHead>
                    <TableHead className="text-zinc-400">URL-адрес</TableHead>
                    <TableHead className="text-zinc-400">Статус</TableHead>
                    <TableHead className="text-zinc-400">Рекомендуемый</TableHead>
                    <TableHead className="w-[150px] text-zinc-400">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                      <TableCell colSpan={5} className="text-center">Проектов не найдено</TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id} className="border-zinc-700 hover:bg-zinc-800/50">
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.slug}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'upcoming' ? 'Предстоящий' :
                             project.status === 'active' ? 'Активный' : 'Завершенный'}
                          </span>
                        </TableCell>
                        <TableCell>{project.featured ? 'Да' : 'Нет'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="border-zinc-700 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-700" onClick={() => openModal(project)}>
                              <Pencil size={16} />
                            </Button>
                            <Button variant="outline" size="icon" className="border-zinc-700 text-zinc-400 hover:text-red-500 hover:bg-zinc-700" onClick={() => handleDeleteProject(project.id)}>
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl bg-zinc-800 border-zinc-700 text-zinc-50">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать Проект' : 'Добавить Новый Проект'}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 bg-zinc-700">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary">Детали</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-primary">Медиа</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-primary">Особенности</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-300">Название *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      required
                      className="bg-zinc-700 border-zinc-600 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-zinc-300">URL-адрес *</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="bg-zinc-700 border-zinc-600 text-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-300">Описание *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                    className="bg-zinc-700 border-zinc-600 text-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-zinc-300">Местоположение</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completionDate" className="text-zinc-300">Ожидаемое завершение</Label>
                    <Input
                      id="completionDate"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      placeholder="Q4 2025"
                      className="bg-zinc-700 border-zinc-600 text-zinc-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-zinc-300">Статус</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-700 border-zinc-600 text-zinc-200">
                        <SelectItem value="upcoming">Предстоящий</SelectItem>
                        <SelectItem value="active">Активный</SelectItem>
                        <SelectItem value="completed">Завершенный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="featured"
                      checked={featured}
                      onCheckedChange={(checked) => setFeatured(checked === true)}
                      className="border-zinc-600 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="featured" className="text-zinc-300">Рекомендуемый Проект</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {/* --- Cover Image Section (Keep as is, added type="button") --- */}
                  <div>
                    <Label className="block mb-2 text-zinc-300">Обложка</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="URL изображения"
                        className="flex-1 bg-zinc-700 border-zinc-600 text-zinc-200"
                      />
                      <ImageUploader
                        onImageUploaded={(url) => setCoverImage(url)}
                        defaultImage={coverImage}
                        className="bg-primary hover:bg-primary/90"
                      />
                    </div>
                    {coverImage && (
                      <div className="mt-2 relative w-full max-w-xs">
                        <img
                          src={coverImage}
                          alt="Предпросмотр обложки"
                          className="rounded border object-cover h-40 w-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        <Button
                          type="button" // Added type button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => setCoverImage('')}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* --- End Cover Image Section --- */}

                  {/* --- Gallery Images Section (Revised UI) --- */}
                  <div>
                    <Label className="block mb-2 text-zinc-300">Галерея изображений</Label>

                    {/* Show initial upload area when no images */}
                    {galleryImages.length === 0 && (
                      <div className="border border-dashed border-zinc-600 rounded p-6 text-center space-y-2">
                        {/* This ImageUploader handles the first upload */}
                        <ImageUploader
                          onImageUploaded={(url) => setGalleryImages([...galleryImages, url])}
                          className="mx-auto flex items-center justify-center bg-primary hover:bg-primary/90"
                        >
                          <ImagePlus size={24} className="mr-2"/>
                          Загрузить изображения
                        </ImageUploader>
                        <p className="text-zinc-400 text-sm">
                          JPG, PNG, GIF до 5МБ.
                        </p>
                      </div>
                    )}

                    {/* Show grid of images and 'Add More' button when there are images */}
                    {galleryImages.length > 0 && (
                      <div className="space-y-4"> {/* Container for grid + add button */}
                        <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2"> {/* Scrollable grid */}
                          {galleryImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Изображение галереи ${index + 1}`}
                                className="rounded border border-zinc-700 object-cover h-24 w-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                              <Button
                                type="button" // Added type button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                                onClick={() => {
                                  const filtered = galleryImages.filter((_, i) => i !== index);
                                  setGalleryImages(filtered);
                                }}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Button to add more images, shown below the grid */}
                        <ImageUploader
                          onImageUploaded={(url) => setGalleryImages([...galleryImages, url])}
                          className="w-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
                        >
                           <Plus size={16} />
                           Добавить еще изображения
                        </ImageUploader>
                      </div>
                    )}
                  </div>
                  {/* --- End Gallery Images Section --- */}

                </div> {/* End container for cover and gallery sections */}
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded border-zinc-700 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                        onClick={() => handleRemoveFeature(index)}
                        disabled={features.length === 1}
                      >
                        <X size={16} />
                      </Button>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${index}`} className="text-zinc-300">Название особенности</Label>
                          <Input
                            id={`feature-title-${index}`}
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            className="bg-zinc-700 border-zinc-600 text-zinc-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`feature-desc-${index}`} className="text-zinc-300">Описание особенности</Label>
                          <Textarea
                            id={`feature-desc-${index}`}
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            rows={2}
                            className="bg-zinc-700 border-zinc-600 text-zinc-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddFeature}
                    className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Добавить Еще Одну Особенность
                  </Button>
                </div>
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={closeModal} className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                  Отмена
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {isEditing ? 'Обновить Проект' : 'Добавить Проект'}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFutureProjects;