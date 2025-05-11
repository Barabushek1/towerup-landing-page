
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { fetchProjects, addProject, updateProject, deleteProject } from '@/utils/project-helpers';
import { Project, ProjectFormData } from '@/types/project';

const projectStatusOptions = [
  { label: 'Активный', value: 'active' },
  { label: 'Завершен', value: 'completed' },
  { label: 'В разработке', value: 'in_progress' },
  { label: 'Строится', value: 'under_construction' },
  { label: 'Планируется', value: 'planned' }
];

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('active');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setIsLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStatus('active');
    setImageUrl('');
    setUrl('');
    setCurrentProject(null);
    setIsEditing(false);
  };

  const openProjectDialog = (project?: Project) => {
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
    setIsDialogOpen(true);
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !status || !url) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const projectData: ProjectFormData = {
        title,
        description,
        location,
        status,
        image_url: imageUrl,
        url
      };

      if (isEditing && currentProject) {
        const updated = await updateProject(currentProject.id, projectData);
        if (updated) {
          toast({
            title: 'Project updated',
            description: 'The project has been updated successfully'
          });
        }
      } else {
        const created = await addProject(projectData);
        if (created) {
          toast({
            title: 'Project created',
            description: 'The project has been created successfully'
          });
        }
      }

      await loadProjects();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(id);
      if (success) {
        toast({
          title: 'Project deleted',
          description: 'The project has been deleted successfully'
        });
        await loadProjects();
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Project Management</h1>
          <Button onClick={() => openProjectDialog()} className="flex items-center gap-2">
            <PlusCircle size={16} />
            Add Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableCaption>List of all projects</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No projects found</TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.location}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' : 
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            project.status === 'under_construction' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'planned' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'active' ? 'Active' :
                             project.status === 'completed' ? 'Completed' :
                             project.status === 'under_construction' ? 'Under Construction' :
                             project.status === 'planned' ? 'Planned' : 
                             project.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => openProjectDialog(project)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Project title" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Project description" 
                  rows={4} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Project location" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Project URL (e.g., /projects/project-name)" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Project Image</Label>
                <ImageUploader 
                  currentImageUrl={imageUrl} 
                  onImageUploaded={handleImageUploaded} 
                  bucketName="images"
                  folderName="projects"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProjects;
