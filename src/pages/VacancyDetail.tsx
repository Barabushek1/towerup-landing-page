
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
      
      <main>
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к вакансиям
            </Button>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : error || !vacancy ? (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                <h2 className="text-2xl font-benzin text-red-500 mb-2">Ошибка</h2>
                <p>Не удалось загрузить информацию о вакансии. Пожалуйста, попробуйте позже.</p>
                <Button className="mt-4" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Назад к вакансиям
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-benzin">
                      {vacancy.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      {vacancy.location && (
                        <div className="flex items-center text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{vacancy.location}</span>
                        </div>
                      )}
                      
                      {vacancy.salary_range && (
                        <div className="flex items-center text-green-400">
                          <span>{vacancy.salary_range}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      size="lg"
                      onClick={() => setShowForm(prev => !prev)}
                      className="bg-primary hover:bg-primary/90"
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
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                      <h2 className="text-xl font-benzin mb-4">Описание вакансии</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{vacancy.description}</p>
                      </div>
                    </div>
                    
                    {/* Requirements if any */}
                    {vacancy.requirements && (
                      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                        <h2 className="text-xl font-benzin mb-4">Требования</h2>
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap">{vacancy.requirements}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Benefits if any */}
                    {vacancy.benefits && (
                      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                        <h2 className="text-xl font-benzin mb-4">Преимущества</h2>
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap">{vacancy.benefits}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-1">
                    {/* Application form */}
                    {showForm && (
                      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 sticky top-24">
                        <h2 className="text-xl font-benzin mb-4">Отправить резюме</h2>
                        
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
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VacancyDetail;
