
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  Send, 
  CheckCircle2, 
  Building, 
  User, 
  Package, 
  Mail, 
  Phone
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the form schema
const formSchema = z.object({
  applicantType: z.enum(["individual", "company"], {
    required_error: "Пожалуйста, выберите тип заявителя",
  }),
  name: z.string().min(3, {
    message: "Имя должно содержать не менее 3 символов",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
  phone: z.string().min(10, {
    message: "Пожалуйста, введите корректный номер телефона",
  }),
  offerDescription: z.string().min(20, {
    message: "Описание должно содержать не менее 20 символов",
  }),
  // Files will be handled separately
});

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const CommercialOffers: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantType: "individual",
      name: "",
      company: "",
      email: "",
      phone: "",
      offerDescription: "",
    },
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Check file size and type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];
      
      const newFiles = Array.from(files).filter(file => {
        const isAllowedType = allowedTypes.includes(file.type);
        const isAllowedSize = file.size <= 5 * 1024 * 1024; // 5MB max
        
        if (!isAllowedType) {
          toast({
            title: "Неподдерживаемый формат файла",
            description: `Файл "${file.name}" имеет недопустимый формат. Разрешены только PDF, Word, Excel и изображения.`,
            variant: "destructive",
          });
        }
        
        if (!isAllowedSize) {
          toast({
            title: "Файл слишком большой",
            description: `Файл "${file.name}" превышает максимально допустимый размер в 5MB.`,
            variant: "destructive",
          });
        }
        
        return isAllowedType && isAllowedSize;
      });
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove a file from uploaded files
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    try {
      // In a real app, you'd send the values and files to your backend
      console.log("Form values:", values);
      console.log("Uploaded files:", uploadedFiles);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success UI
      setIsSuccess(true);
      toast({
        title: "Заявка отправлена",
        description: "Мы получили вашу заявку и свяжемся с вами в ближайшее время.",
      });
      
      // Reset form after successful submission (delayed for UX)
      setTimeout(() => {
        form.reset();
        setUploadedFiles([]);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке вашей заявки. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Коммерческие предложения | TOWERUP</title>
        <meta name="description" content="Отправьте ваше коммерческое предложение для сотрудничества с компанией TOWERUP." />
      </Helmet>
      
      <NavBar />
      
      <main>
        <PageHeader 
          title="Коммерческие предложения" 
          breadcrumb="Коммерческие предложения"
          backgroundImage="/lovable-uploads/c1da7b25-e60d-44b9-8b74-2c37c543ac5f.jpg"
        />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left column - Form */}
              <motion.div 
                className="col-span-1 lg:col-span-3"
                initial="initial"
                animate="animate"
                variants={fadeIn}
              >
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Отправить коммерческое предложение</h2>
                  
                  {isSuccess ? (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-green-50 rounded-full p-4 mb-4">
                        <CheckCircle2 className="h-16 w-16 text-brand-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Спасибо за ваше предложение!</h3>
                      <p className="text-gray-600 text-center max-w-md">
                        Мы получили ваше коммерческое предложение и рассмотрим его в ближайшее время.
                        Наши специалисты свяжутся с вами по указанным контактным данным.
                      </p>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="applicantType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Тип заявителя</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="individual" id="individual" />
                                    <label htmlFor="individual" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      Физическое лицо
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="company" id="company" />
                                    <label htmlFor="company" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      Компания
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" placeholder="Иванов Иван Иванович" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('applicantType') === 'company' && (
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Название компании</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input className="pl-10" placeholder="ООО «Компания»" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" type="email" placeholder="example@mail.com" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" placeholder="+998 90 123 45 67" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="offerDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание предложения</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Textarea 
                                    className="pl-10 min-h-[120px]" 
                                    placeholder="Подробно опишите ваше коммерческое предложение..." 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel htmlFor="fileUpload">Прикрепить файлы</FormLabel>
                          <FormDescription className="text-xs text-muted-foreground mb-2">
                            Допустимые форматы: PDF, Word, Excel, JPEG, PNG (до 5MB)
                          </FormDescription>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">Перетащите файлы сюда или кликните для выбора</span>
                              <input
                                id="fileUpload"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                              />
                            </label>
                          </div>
                          
                          {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium">Загруженные файлы:</p>
                              <ul className="text-sm text-gray-600">
                                {uploadedFiles.map((file, index) => (
                                  <li key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                    <span className="truncate max-w-[250px]">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="text-gray-500 hover:text-red-500"
                                    >
                                      &times;
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-brand-primary hover:bg-brand-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2">Отправка...</span>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" /> Отправить предложение
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </motion.div>
              
              {/* Right column - Info */}
              <motion.div 
                className="col-span-1 lg:col-span-2"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <div className="bg-gray-50 rounded-lg p-6 md:p-8 h-full">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">Информация о сотрудничестве</h3>
                  
                  <motion.div variants={listItemVariants} className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 text-brand-dark">Кто может отправить предложение?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-brand-primary font-semibold text-sm">✓</span>
                        </div>
                        <span>Производители строительных материалов и оборудования</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-brand-primary font-semibold text-sm">✓</span>
                        </div>
                        <span>Поставщики строительной техники и инструментов</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-brand-primary font-semibold text-sm">✓</span>
                        </div>
                        <span>Компании, предлагающие услуги в сфере строительства</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-brand-primary font-semibold text-sm">✓</span>
                        </div>
                        <span>Индивидуальные подрядчики и специалисты</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={listItemVariants} className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 text-brand-dark">Требования к предложениям</h4>
                    <p className="text-gray-600 mb-4">
                      Для того чтобы ваше предложение было рассмотрено в кратчайшие сроки, 
                      пожалуйста, включите в него следующую информацию:
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-gray-600 font-semibold text-sm">1</span>
                        </div>
                        <span>Подробное описание товаров или услуг</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-gray-600 font-semibold text-sm">2</span>
                        </div>
                        <span>Цены и условия поставки</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-gray-600 font-semibold text-sm">3</span>
                        </div>
                        <span>Примеры выполненных проектов (если применимо)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <span className="text-gray-600 font-semibold text-sm">4</span>
                        </div>
                        <span>Сертификаты качества и соответствия</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={listItemVariants} className="bg-brand-primary/10 rounded-lg p-4">
                    <p className="text-sm text-brand-dark">
                      <strong>Обратите внимание:</strong> После получения вашего предложения, 
                      наши специалисты рассмотрят его и свяжутся с вами в течение 5 рабочих дней. 
                      Если вы не получили ответ в указанный срок, пожалуйста, свяжитесь с нами по 
                      телефону: <strong>+998 90 123 45 67</strong>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default CommercialOffers;
