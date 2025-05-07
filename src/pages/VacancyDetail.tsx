
import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Briefcase, Calendar, Clock, FilePlus, Loader2, MapPin, Upload, X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCachedData } from '@/utils/cache-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { uploadMultipleFiles } from '@/utils/file-utils';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface Vacancy {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  description: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  created_at: string;
  image_url?: string;
}

interface ApplicationFormData {
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  files: File[];
}

const VacancyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    files: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { data: vacancy, isLoading, error } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      return getCachedData(`vacancy_${id}`, async () => {
        if (!id) throw new Error('Vacancy ID is required');
        
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Vacancy not found');
        
        console.log('Fetched vacancy details:', data);
        return data as Vacancy;
      }, 60); // Cache for 1 hour
    },
    enabled: !!id,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };
  
  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacancy) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.full_name || !formData.email || !formData.phone) {
        throw new Error('Please fill all required fields');
      }
      
      console.log('Starting application submission process...');
      
      // 1. Upload files if any
      let fileUrls: string[] = [];
      if (formData.files.length > 0) {
        console.log('Uploading files:', formData.files.length);
        fileUrls = await uploadMultipleFiles(formData.files, 'resumes');
        console.log('Files uploaded successfully:', fileUrls);
      }
      
      // 2. Save application to database
      console.log('Saving application to database');
      const { data: application, error: insertError } = await supabase
        .from('vacancy_applications')
        .insert({
          vacancy_id: vacancy.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.cover_letter,
          attachments: fileUrls,
          status: 'new'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting application:', insertError);
        throw insertError;
      }
      
      console.log('Application saved successfully:', application);
      
      // 3. Send email notification
      console.log('Sending email notification');
      const emailNotification = await supabase.functions.invoke('send-resume-notification', {
        body: {
          application: {
            ...application,
            vacancy_title: vacancy.title,
            attachments: fileUrls,
            cover_letter: formData.cover_letter
          }
        }
      });

      console.log('Email notification response:', emailNotification);

      // 4. Show success message
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. We will contact you soon.",
      });
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        files: []
      });
      
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
        <NavBar />
        <div className="container mx-auto px-6 py-20">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h2 className="text-2xl font-benzin text-red-500 mb-2">Ошибка</h2>
            <p>Не удалось загрузить информацию о вакансии. Пожалуйста, попробуйте позже.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад к вакансиям
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200">
      <NavBar />
      
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-8 text-sm">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Главная</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/vacancies">Вакансии</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-white">{vacancy.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full mb-4">Актуально</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-benzin">
                {vacancy.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 mt-4">
                {vacancy.location && (
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span>{vacancy.location}</span>
                  </div>
                )}
                
                {vacancy.salary_range && (
                  <div className="flex items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{vacancy.salary_range}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>Опубликовано: {formatDate(vacancy.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              <Button 
                size="lg"
                onClick={() => setShowForm(prev => !prev)}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {showForm ? (
                  <>Скрыть форму</>
                ) : (
                  <>
                    Откликнуться
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Back button */}
              <Button
                variant="outline"
                className="mb-6"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к вакансиям
              </Button>
              
              {/* Job overview card */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-lg p-6 border border-slate-700/50 shadow-xl">
                <h2 className="text-2xl font-benzin mb-6 text-white border-b border-slate-700 pb-3">Обзор вакансии</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{vacancy.description}</p>
                </div>
              </div>
              
              {/* Job details tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Requirements if any */}
                {vacancy.requirements && (
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 h-full">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-benzin">Требования</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{vacancy.requirements}</p>
                    </div>
                  </div>
                )}
                
                {/* Benefits if any */}
                {vacancy.benefits && (
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 h-full">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-benzin">Преимущества</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{vacancy.benefits}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Apply button (bottom) */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 text-center">
                <h3 className="text-lg font-medium mb-4 font-benzin">Заинтересованы в этой вакансии?</h3>
                <Button 
                  size="lg" 
                  onClick={() => setShowForm(true)} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Откликнуться сейчас
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Application form */}
              {showForm && (
                <div className="bg-gradient-to-b from-slate-800 to-slate-800/80 rounded-lg p-6 border border-slate-700/50 sticky top-24 shadow-xl">
                  <h2 className="text-xl font-benzin mb-4 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Отправить резюме
                  </h2>
                  
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">ФИО *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Иванов Иван Иванович"
                        required
                        className="mt-1 bg-[#2a2a2a] border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        required
                        className="mt-1 bg-[#2a2a2a] border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+998 XX XXX XX XX"
                        required
                        className="mt-1 bg-[#2a2a2a] border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cover_letter">Сопроводительное письмо</Label>
                      <Textarea
                        id="cover_letter"
                        name="cover_letter"
                        value={formData.cover_letter}
                        onChange={handleInputChange}
                        placeholder="Расскажите немного о себе и своем опыте..."
                        className="mt-1 bg-[#2a2a2a] border-gray-700 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="files">Резюме и другие документы</Label>
                      <div className="mt-1">
                        <label className="flex items-center justify-center w-full p-4 border border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                          <Input
                            id="files"
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                          />
                          <Upload className="mr-2 h-5 w-5" />
                          <span>Добавить файлы</span>
                        </label>
                      </div>
                      
                      {/* File list */}
                      {formData.files.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded"
                            >
                              <div className="flex items-center">
                                <FilePlus className="h-4 w-4 mr-2" />
                                <span className="text-sm truncate max-w-[180px]">{file.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>Отправить заявку</>
                      )}
                    </Button>
                  </form>
                </div>
              )}
              
              {/* Company info card (when application form is not showing) */}
              {!showForm && (
                <div className="bg-gradient-to-b from-slate-800 to-slate-800/80 rounded-lg p-6 border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-medium mb-4 font-benzin">О компании</h3>
                  <p className="text-gray-300 mb-4">
                    Мы занимаемся строительством инновационных жилых комплексов, коммерческой недвижимости и инфраструктурных объектов. Присоединяйтесь к нашей команде профессионалов!
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="text-md font-medium mb-3">Как происходит наш процесс найма:</h4>
                    <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                      <li>Рассмотрение резюме и портфолио</li>
                      <li>Первичное интервью с HR-специалистом</li>
                      <li>Техническое собеседование</li>
                      <li>Финальное собеседование с руководителем</li>
                      <li>Предложение о работе</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VacancyDetail;

