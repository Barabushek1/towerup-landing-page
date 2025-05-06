
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, ChevronLeft, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

interface Tender {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  category?: string;
  deadline?: string;
  documents?: string[];
  status: string;
  created_at: string;
}

const applicationSchema = z.object({
  company_name: z.string().min(1, "Название компании обязательно"),
  contact_name: z.string().min(1, "Имя контактного лица обязательно"),
  email: z.string().email("Некорректный формат email"),
  phone: z.string().min(1, "Номер телефона обязателен"),
  message: z.string().optional(),
});

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Fetch tender details
  const { data: tender, isLoading, error } = useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      if (!id) throw new Error('No tender ID provided');
      
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Tender not found');
      
      return data as Tender;
    },
    enabled: !!id,
  });
  
  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async (applicationData: typeof formData) => {
      const { data, error } = await supabase
        .from('tender_applications')
        .insert({
          tender_id: id,
          ...applicationData,
        })
        .select('id');
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена",
        description: "Ваша заявка на участие в тендере успешно отправлена",
      });
      setApplicationDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Ошибка отправки заявки",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    }
  });
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle form submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      applicationSchema.parse(formData);
      
      // Submit application
      submitApplication.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Transform Zod errors into a more usable format
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setFormErrors(fieldErrors);
      } else {
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, проверьте правильность заполнения формы",
          variant: "destructive",
        });
      }
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      message: '',
    });
    setFormErrors({});
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указан';
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      return 'Неверная дата';
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активный</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Завершен</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Закрыт</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <PageHeader title="Загрузка..." subtitle="Пожалуйста, подождите" />
        <div className="container mx-auto py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !tender) {
    return (
      <>
        <NavBar />
        <PageHeader title="Тендер не найден" subtitle="Произошла ошибка при загрузке данных" />
        <div className="container mx-auto py-12">
          <div className="text-center">
            <p className="mb-6">
              Извините, запрашиваемый тендер не найден или произошла ошибка при его загрузке.
            </p>
            <Link to="/collaboration/tenders">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Вернуться к списку тендеров
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tender.title} | Тендеры</title>
      </Helmet>
      
      <NavBar />
      <PageHeader title={tender.title} subtitle={tender.category || 'Тендер'} />
      
      <div className="container mx-auto py-12">
        <div className="mb-6">
          <Link to="/collaboration/tenders" className="inline-flex items-center text-primary hover:underline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к списку тендеров
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{tender.title}</h1>
                {getStatusBadge(tender.status)}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Срок подачи заявок: {formatDate(tender.deadline)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Опубликован: {formatDate(tender.created_at)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-medium mb-4">Описание</h3>
                <div className="whitespace-pre-line">
                  {tender.description}
                </div>
                
                {tender.requirements && (
                  <>
                    <h3 className="text-xl font-medium mt-8 mb-4">Требования</h3>
                    <div className="whitespace-pre-line">
                      {tender.requirements}
                    </div>
                  </>
                )}
              </div>
              
              {tender.documents && tender.documents.length > 0 && (
                <>
                  <h3 className="text-xl font-medium mt-8 mb-4">Документы</h3>
                  <div className="space-y-2">
                    {tender.documents.map((doc, index) => (
                      <a 
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <span className="flex-1 truncate">{doc.split('/').pop()}</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Подать заявку</h3>
              
              {tender.status === 'active' ? (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Заполните форму заявки, чтобы принять участие в тендере. 
                    Наши специалисты свяжутся с вами в ближайшее время.
                  </p>
                  <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Отправить заявку
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Заявка на участие в тендере</DialogTitle>
                        <DialogDescription>
                          Заполните форму заявки для участия в тендере "{tender.title}"
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmitApplication} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="company_name">Название компании*</Label>
                          <Input
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            className={formErrors.company_name ? "border-red-500" : ""}
                          />
                          {formErrors.company_name && (
                            <p className="text-sm text-red-500">{formErrors.company_name}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contact_name">Контактное лицо*</Label>
                          <Input
                            id="contact_name"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleInputChange}
                            className={formErrors.contact_name ? "border-red-500" : ""}
                          />
                          {formErrors.contact_name && (
                            <p className="text-sm text-red-500">{formErrors.contact_name}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email*</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={formErrors.email ? "border-red-500" : ""}
                            />
                            {formErrors.email && (
                              <p className="text-sm text-red-500">{formErrors.email}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон*</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={formErrors.phone ? "border-red-500" : ""}
                            />
                            {formErrors.phone && (
                              <p className="text-sm text-red-500">{formErrors.phone}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Сообщение</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Опишите ваше предложение или вопросы по тендеру"
                          />
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={submitApplication.isPending}
                          >
                            {submitApplication.isPending ? 'Отправка...' : 'Отправить заявку'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-md text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {tender.status === 'completed' 
                      ? 'Тендер завершен. Прием заявок закрыт.'
                      : 'Тендер закрыт. Прием заявок не осуществляется.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default TenderDetail;
