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

const AdminFutureProjects: React.FC = () => {
  const { toast } = useToast();
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
        title: 'Please fill all required fields',
        description: 'Title, slug, and description are required.',
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
            title: 'Project updated',
            description: 'Future project has been updated successfully.',
          });
          loadProjects();
          closeModal();
        }
      } else {
        const added = await addFutureProject(projectData as Omit<FutureProject, 'id' | 'createdAt' | 'updatedAt'>);
        if (added) {
          toast({
            title: 'Project added',
            description: 'New future project has been added successfully.',
          });
          loadProjects();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const deleted = await deleteFutureProject(id);
      if (deleted) {
        toast({
          title: 'Project deleted',
          description: 'Future project has been deleted successfully.',
        });
        loadProjects();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete project. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Future Projects Management</h1>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <PlusCircle size={16} />
            Add New Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Future Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading projects...</p>
            ) : (
              <Table>
                <TableCaption>List of future projects</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No projects found</TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.slug}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell>{project.featured ? 'Yes' : 'No'}</TableCell>
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={handleTitleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input 
                      id="slug" 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={5} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Estimated Completion</Label>
                    <Input 
                      id="completionDate" 
                      value={completionDate} 
                      onChange={(e) => setCompletionDate(e.target.value)} 
                      placeholder="Q4 2025" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox 
                      id="featured" 
                      checked={featured} 
                      onCheckedChange={(checked) => setFeatured(checked === true)} 
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Cover Image</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        value={coverImage} 
                        onChange={(e) => setCoverImage(e.target.value)} 
                        placeholder="Image URL" 
                        className="flex-1"
                      />
                      <ImageUploader 
                        onImageUploaded={(url) => setCoverImage(url)}
                        defaultImage={coverImage}
                        className="w-auto"
                      />
                    </div>
                    {coverImage && (
                      <div className="mt-2 relative w-full max-w-xs">
                        <img 
                          src={coverImage} 
                          alt="Cover preview" 
                          className="rounded border object-cover h-40 w-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }} 
                        />
                        <Button
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
                  
                  <div>
                    <Label className="block mb-2">Gallery Images</Label>
                    <div className="flex gap-2 items-center mb-4">
                      <ImageUploader 
                        onImageUploaded={(url) => setGalleryImages([...galleryImages, url])}
                        className="w-auto"
                      />
                    </div>
                    
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={image} 
                              alt={`Gallery image ${index + 1}`} 
                              className="rounded border object-cover h-24 w-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }} 
                            />
                            <Button
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
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveFeature(index)}
                        disabled={features.length === 1}
                      >
                        <X size={16} />
                      </Button>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${index}`}>Feature Title</Label>
                          <Input 
                            id={`feature-title-${index}`}
                            value={feature.title} 
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`feature-desc-${index}`}>Feature Description</Label>
                          <Textarea 
                            id={`feature-desc-${index}`}
                            value={feature.description} 
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} 
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleAddFeature}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Another Feature
                  </Button>
                </div>
              </TabsContent>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Project' : 'Add Project'}
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
