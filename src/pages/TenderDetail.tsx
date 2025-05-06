
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import PageHeader from '@/components/PageHeader';
import { CalendarIcon, FileIcon, Clock, ChevronLeft, Download, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    attachments: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tender details
  const { data: tender, isLoading, error } = useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit tender application
      const { data, error } = await supabase
        .from('tender_applications')
        .insert({
          tender_id: id,
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          attachments: formData.attachments.length > 0 ? formData.attachments : null,
          status: 'pending'
        });

      if (error) throw new Error(error.message);

      toast({
        title: "Заявка отправлена",
        description: "Ваша заявка на участие в тендере успешно отправлена. Мы свяжемся с вами в ближайшее время.",
      });

      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: '',
        attachments: []
      });
    } catch (error: any) {
      console.error('Error submitting tender application:', error);
      toast({
        title: "Ошибка при отправке",
        description: error.message || "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <PageHeader 
          title="Тендер не найден" 
          breadcrumb="Тендеры / Ошибка" 
          backgroundImage="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg"
        />
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Тендер не найден</h2>
          <p className="text-gray-600 mb-8">
            Запрашиваемый тендер не существует или был удален.
          </p>
          <Link to="/collaboration/tenders">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Вернуться к списку тендеров
            </Button>
          </Link>
        </div>
        <Footer />
        <ScrollToTopButton />
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указан';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неверная дата';
    }
  };

  // Check if tender is active
  const isTenderActive = tender.status === 'active';
  const deadlinePassed = tender.deadline ? new Date(tender.deadline) < new Date() : false;
  const canApply = isTenderActive && !deadlinePassed;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{tender.title} | Тендеры TOWERUP</title>
        <meta name="description" content={tender.description.slice(0, 160)} />
      </Helmet>

      <NavBar />
      <PageHeader 
        title={tender.title} 
        breadcrumb={`Тендеры / ${tender.title}`}
        backgroundImage="/lovable-uploads/ace627fc-6648-4ecd-a50b-f62690da6a73.jpg"
      />

      <main className="container mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/collaboration/tenders" className="flex items-center text-blue-500 hover:underline mb-6">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к списку тендеров
          </Link>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{tender.title}</h1>
            <div className="flex items-center gap-2">
              {tender.status === 'active' ? (
                <Badge className="bg-green-500">Активный</Badge>
              ) : tender.status === 'completed' ? (
                <Badge className="bg-blue-500">Завершен</Badge>
              ) : (
                <Badge className="bg-gray-500">Закрыт</Badge>
              )}
              
              {deadlinePassed && isTenderActive && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  Срок подачи истек
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Описание тендера</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {tender.description.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {tender.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Требования к участникам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {tender.requirements.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tender.documents && tender.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Документы</CardTitle>
                    <CardDescription>Скачайте документы для ознакомления с деталями тендера</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tender.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <div className="flex items-center gap-3">
                            <FileIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium truncate max-w-xs">
                              {doc.split('/').pop()}
                            </span>
                          </div>
                          <a 
                            href={doc} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Скачать</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о тендере</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tender.category && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Категория:</h4>
                      <p>{tender.category}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Срок подачи заявок:
                    </h4>
                    <p>{tender.deadline ? formatDate(tender.deadline) : 'Не указан'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Опубликован:
                    </h4>
                    <p>{formatDate(tender.created_at)}</p>
                  </div>
                </CardContent>
                {canApply && (
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => document.getElementById('tender-form')?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Подать заявку
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </motion.div>

        {canApply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
            id="tender-form"
          >
            <Card>
              <CardHeader>
                <CardTitle>Подать заявку на участие</CardTitle>
                <CardDescription>
                  Заполните форму ниже для подачи заявки на участие в тендере
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Название компании *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Введите название вашей компании"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Контактное лицо *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="Введите имя контактного лица"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Введите ваш email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+998 XX XXX XX XX"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Дополнительная информация о вашей компании и предложении"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Отправка..." : "Отправить заявку"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default TenderDetail;
