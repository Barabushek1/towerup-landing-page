
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVacancySeeder } from '@/hooks/use-vacancy-seeder';
import { getCachedData } from '@/utils/cache-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Vacancy {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  is_active: boolean;
  description: string;
  requirements?: string;
  benefits?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const Vacancies: React.FC = () => {
  // For the contact form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Seed initial vacancy data if needed
  useVacancySeeder();
  
  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: ['vacancies'],
    queryFn: async () => {
      console.log('Fetching vacancies...');
      return getCachedData('vacancies_list', async () => {
        // Ensure we only fetch active vacancies
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('is_active', true)
          .order('title');
        
        if (error) {
          console.error('Error fetching vacancies:', error);
          throw error;
        }
        
        console.log('Fetched active vacancies:', data);
        return data as Vacancy[];
      }, 5); // Cache for 5 minutes instead of an hour
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in React Query cache for 30 minutes
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save general application to database (not tied to a specific vacancy)
      const { error: insertError } = await supabase
        .from('vacancy_applications')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.cover_letter,
          status: 'new'
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Заявка отправлена",
        description: "Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время."
      });
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        cover_letter: ''
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main>
        <PageHeader 
          title="ВАКАНСИИ" 
          breadcrumb="ВАКАНСИИ"
        />
        
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200 font-benzin text-center">Присоединяйтесь к нам</h2>
              
              {isLoading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                  <p className="mt-4 text-slate-400">Загрузка вакансий...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-400">Произошла ошибка при загрузке вакансий. Пожалуйста, попробуйте позже.</p>
                </div>
              ) : vacancies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vacancies.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-lg border border-primary/10 p-6 shadow-sm bg-slate-800/40
                      transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin">{item.title}</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm font-benzin">Полная занятость</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-medium text-brand-primary font-benzin">{item.salary_range}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between">
                        <a
                          href={`/vacancies/${item.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-benzin"
                        >
                          <span>Подробнее</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                        
                        <button
                          onClick={() => setDialogOpen(true)}
                          className="text-slate-300 hover:text-primary transition-colors font-benzin text-sm"
                        >
                          Откликнуться
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400">В настоящее время нет открытых вакансий.</p>
                </div>
              )}
              
              <div className="mt-16 p-8 rounded-lg bg-slate-800/40 border border-primary/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Briefcase className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-slate-200 mb-2 font-benzin text-center md:text-left">Не нашли подходящую вакансию?</h3>
                    <p className="text-muted-foreground mb-4 font-benzin text-center md:text-left">
                      Отправьте нам свое резюме, и мы свяжемся с вами, когда появится подходящая позиция.
                    </p>
                    <div className="flex justify-center md:justify-start">
                      <button 
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-benzin"
                      >
                        <span>Отправить резюме</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
        
        {/* Application Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-slate-800 text-slate-100 border-slate-700 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-benzin">Отправить резюме</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-300">ФИО *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Иванов Иван Иванович"
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@mail.com"
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">Телефон *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 XX XXX XX XX"
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover_letter" className="text-slate-300">Сопроводительное письмо</Label>
                <Textarea
                  id="cover_letter"
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  placeholder="Расскажите немного о себе и своем опыте..."
                  className="bg-slate-700 border-slate-600 text-slate-100 min-h-[120px]"
                />
              </div>
              
              <div className="pt-2 flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Vacancies;

