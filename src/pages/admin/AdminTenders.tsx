import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Edit, FileText, Calendar, Tag, ExternalLink } from 'lucide-react';
import { formatDate } from '@/utils/tender-helpers';
import { Tender } from '@/types/tenders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ImageUploader from '@/components/admin/ImageUploader';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper component for displaying tender applications
const TenderApplicationsList = ({ tenderId }: { tenderId: string }) => {
  const { t } = useLanguage();
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['tenderApplications', tenderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tender_applications')
        .select('*')
        .eq('tender_id', tenderId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const queryClient = useQueryClient();
  
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('tender_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenderApplications', tenderId] });
      toast({
        title: "Status updated",
        description: "The application status has been updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateApplicationMutation.mutate({ id, status });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No applications received yet</div>;
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getStatusBadgeClass(app.status)}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
                <span className="font-medium">{app.company_name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(app.created_at)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-sm font-medium">Contact Person</div>
                <div>{app.contact_name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Contact Info</div>
                <div>{app.email} | {app.phone}</div>
              </div>
            </div>
            
            {expandedApp === app.id ? (
              <>
                {app.message && (
                  <div className="mb-3">
                    <div className="text-sm font-medium">Message</div>
                    <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{app.message}</div>
                  </div>
                )}
                
                {app.attachments && app.attachments.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium">Attachments</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {app.attachments.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          Attachment {idx + 1}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandedApp(null)}
                >
                  Show Less
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedApp(app.id)}
              >
                Show More
              </Button>
            )}

            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t">
              <Select
                defaultValue={app.status}
                onValueChange={(value) => handleStatusChange(app.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Application Status</SelectLabel>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminTenders = () => {
  const { admin } = useAdmin();
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTender, setCurrentTender] = useState<Tender | null>(null);
  const [viewApplications, setViewApplications] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Schema validation for tender form
  const tenderSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
    description: z.string().min(10, { message: "Description is required" }),
    requirements: z.string().optional(),
    category: z.string().optional(),
    status: z.string(),
    deadline: z.string().optional(),
    documents: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof tenderSchema>>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      category: 'other',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days
      documents: [],
    },
  });

  // Mutations for CRUD operations
  const createTenderMutation = useMutation({
    mutationFn: async (values: z.infer<typeof tenderSchema>) => {
      const { data, error } = await supabase
        .from('tenders')
        .insert({
          title: values.title,
          description: values.description,
          requirements: values.requirements || null,
          category: values.category || null,
          status: values.status,
          deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
          documents: values.documents || []
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: "Success",
        description: "Tender created successfully",
      });
      closeForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create tender: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateTenderMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: z.infer<typeof tenderSchema> }) => {
      const { data, error } = await supabase
        .from('tenders')
        .update({
          title: values.title,
          description: values.description,
          requirements: values.requirements || null,
          category: values.category || null,
          status: values.status,
          deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
          documents: values.documents || []
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: "Success",
        description: "Tender updated successfully",
      });
      closeForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update tender: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteTenderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tenders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast({
        title: "Success",
        description: "Tender deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete tender: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Form handlers
  const openNewTenderForm = () => {
    setIsEditMode(false);
    setCurrentTender(null);
    form.reset({
      title: '',
      description: '',
      requirements: '',
      category: 'other',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: [],
    });
    setIsFormOpen(true);
  };

  const openEditTenderForm = (tender: Tender) => {
    setIsEditMode(true);
    setCurrentTender(tender);
    form.reset({
      title: tender.title,
      description: tender.description,
      requirements: tender.requirements,
      category: tender.category || 'other',
      status: tender.status,
      deadline: tender.deadline ? new Date(tender.deadline).toISOString().split('T')[0] : undefined,
      documents: tender.documents || [],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setIsEditMode(false);
      setCurrentTender(null);
      form.reset();
    }, 300);
  };

  const openApplicationsView = (tenderId: string) => {
    setViewApplications(tenderId);
  };

  const closeApplicationsView = () => {
    setViewApplications(null);
  };

  const onSubmit = (values: z.infer<typeof tenderSchema>) => {
    if (isEditMode && currentTender) {
      updateTenderMutation.mutate({ id: currentTender.id, values });
    } else {
      createTenderMutation.mutate(values);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tender? This action cannot be undone.")) {
      deleteTenderMutation.mutate(id);
    }
  };

  const handleDocumentUpload = (urls: string[]) => {
    form.setValue('documents', [...(form.getValues('documents') || []), ...urls]);
  };

  const removeDocument = (index: number) => {
    const documents = form.getValues('documents') || [];
    documents.splice(index, 1);
    form.setValue('documents', documents);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Tenders</h1>
        <Button onClick={openNewTenderForm} className="gap-2">
          <PlusCircle size={18} />
          New Tender
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tenders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tenders found. Create your first tender.
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
            <Card key={tender.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStatusBadgeClass(tender.status)}>
                        {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                      </Badge>
                      
                      {tender.category && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Tag className="w-4 h-4 mr-1" />
                          {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
                        </div>
                      )}
                    </div>
                    
                    <CardTitle>{tender.title}</CardTitle>
                    
                    {tender.deadline && (
                      <div className="flex items-center mt-1 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Deadline: {formatDate(tender.deadline)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openApplicationsView(tender.id)}
                    >
                      Applications
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditTenderForm(tender)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(tender.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {tender.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tender Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Tender' : 'Create Tender'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Tender title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the tender" 
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Specific requirements for applicants" 
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="supply">Supply</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documents</FormLabel>
                      <FormDescription>
                        Upload any relevant documents for the tender
                      </FormDescription>
                      <div className="mt-2">
                        <ImageUploader 
                          onUpload={handleDocumentUpload} 
                          label="Add Document" 
                          accept=".pdf,.doc,.docx,.xls,.xlsx" 
                          maxFiles={5}
                        />
                      </div>
                      <div className="mt-2 space-y-2">
                        {field.value && field.value.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline truncate max-w-xs"
                            >
                              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{doc.split('/').pop()}</span>
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Tender'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog open={!!viewApplications} onOpenChange={(open) => !open && closeApplicationsView()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tender Applications</DialogTitle>
          </DialogHeader>
          
          {viewApplications && (
            <TenderApplicationsList tenderId={viewApplications} />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeApplicationsView}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTenders;
