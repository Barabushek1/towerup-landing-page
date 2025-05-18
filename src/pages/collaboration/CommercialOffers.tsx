import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadMultipleFiles } from '@/utils/file-utils';

import {
  Upload,
  Send,
  CheckCircle2,
  Building,
  User,
  Package,
  Mail,
  Phone,
  X
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
import { cn } from '@/lib/utils';

// Define the form schema (Keep as is)
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

// Animation variants (Keep as is)
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

  // Handle file upload (Keep logic, update toast styling)
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
            title: "Неподдерживаемый формат файла", // Keep Russian
            description: `Файл "${file.name}" имеет недопустимый формат. Разрешены только PDF, Word, Excel и изображения.`, // Keep Russian
            variant: "destructive", // Use destructive variant for errors
          });
        }

        if (!isAllowedSize) {
          toast({
            title: "Файл слишком большой", // Keep Russian
            description: `Файл "${file.name}" превышает максимально допустимый размер в 5MB.`, // Keep Russian
            variant: "destructive", // Use destructive variant for errors
          });
        }

        return isAllowedType && isAllowedSize;
      });

      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove a file from uploaded files (Keep logic)
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Upload files to Supabase storage and get URLs
      let fileUrls: string[] = [];
      
      if (uploadedFiles.length > 0) {
        // Upload files and get their URLs
        fileUrls = await uploadMultipleFiles(uploadedFiles);
      }
      
      // Insert the form data into the commercial_offers table
      const { data, error } = await supabase
        .from('commercial_offers')
        .insert({
          applicant_type: values.applicantType,
          full_name: values.name,
          company_name: values.company || null,
          email: values.email,
          phone: values.phone,
          description: values.offerDescription,
          attachments: fileUrls.length > 0 ? fileUrls : []
        });

      if (error) throw error;

      // Show success UI
      setIsSuccess(true);
      toast({
        title: "Заявка отправлена",
        description: "Мы получили вашу заявку и рассмотрим её в ближайшее время.",
        variant: "default",
      });

      // Reset form after successful submission (delayed for UX)
      setTimeout(() => {
        form.reset();
        setUploadedFiles([]);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
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
    // Use consistent dark theme background
    <div className="min-h-screen antialiased bg-[#161616] text-white overflow-x-hidden">
      {/* Helmet for SEO - Keep hardcoded Russian */}
      <Helmet>
        <title>Коммерческие предложения | TOWERUP</title>
        <meta name="description" content="Отправьте ваше коммерческое предложение для сотрудничества с компанией TOWERUP." />
        {/* Add other relevant meta tags */}
      </Helmet>

      <NavBar /> {/* Include NavBar */}

      <main>
        {/* Page Header - Keep hardcoded Russian */}
        <PageHeader
          title="Коммерческие предложения"
          // Use an image appropriate for Commercial Offers, styled for dark theme header
          backgroundImage="/lovable-uploads/c1da7b25-e60d-44b9-8b74-2c37c543ac5f.jpg" // Use an appropriate image path
        />

        {/* Main Section - Dark background, consistent padding */}
        <section className="py-16 md:py-24 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12"> {/* Adjusted gap */}
              {/* Left column - Form */}
              <motion.div
                className="col-span-1 lg:col-span-3"
                initial="initial"
                animate="animate"
                variants={fadeIn} // Keep fadeIn animation
              >
                {/* Form Card - Restyled for dark theme */}
                <div className="bg-slate-800/40 rounded-xl shadow-lg p-6 md:p-8 border border-slate-700/50">
                  {/* Heading - Restyled color */}
                  <h2 className="text-2xl font-bold mb-6 text-white">Отправить коммерческое предложение</h2>

                  {/* Success Message UI - Restyled for dark theme */}
                  {isSuccess ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12 text-white"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Icon Container - Restyled for dark theme */}
                      <div className="bg-primary/20 rounded-full p-4 mb-4">
                        <CheckCircle2 className="h-16 w-16 text-primary" /> {/* Primary icon color */}
                      </div>
                      {/* Text - Restyled color */}
                      <h3 className="text-xl font-bold text-white mb-2">Спасибо за ваше предложение!</h3>
                      <p className="text-slate-400 text-center max-w-md">
                        Мы получили ваше коммерческое предложение и рассмотрим его в ближайшее время.
                        Наши специалисты свяжутся с вами по указанным контактным данным.
                      </p>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      {/* Form - Keep structure and fields */}
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Applicant Type Radio Group - Restyled for dark theme */}
                        <FormField
                          control={form.control}
                          name="applicantType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-white">Тип заявителя</FormLabel> {/* Label color */}
                              <FormControl>
                                {/* Radio Group - Restyled for dark theme */}
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4 text-slate-300" // Text color for labels
                                >
                                  <div className="flex items-center space-x-2">
                                    {/* Radio Item - Styled via Shadcn base or global CSS */}
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
                              {/* Message styled via Shadcn base or global CSS */}
                              <FormMessage className="text-red-400" /> {/* Example error color */}
                            </FormItem>
                          )}
                        />

                        {/* Name and Company Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name Field */}
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">ФИО</FormLabel> {/* Label color */}
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" /> {/* Icon color */}
                                    {/* Input - Restyled for dark theme */}
                                    <Input className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary" placeholder="Иванов Иван Иванович" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" /> {/* Example error color */}
                              </FormItem>
                            )}
                          />

                          {/* Company Field (Conditional) */}
                          {form.watch('applicantType') === 'company' && (
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Название компании</FormLabel> {/* Label color */}
                                  <FormControl>
                                    <div className="relative">
                                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" /> {/* Icon color */}
                                      {/* Input - Restyled for dark theme */}
                                      <Input className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary" placeholder="ООО «Компания»" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-400" /> {/* Example error color */}
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        {/* Email and Phone Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Email Field */}
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Email</FormLabel> {/* Label color */}
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /> {/* Icon color */}
                                    {/* Input - Restyled for dark theme */}
                                    <Input className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary" type="email" placeholder="example@mail.com" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" /> {/* Example error color */}
                              </FormItem>
                            )}
                          />

                          {/* Phone Field */}
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Телефон</FormLabel> {/* Label color */}
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" /> {/* Icon color */}
                                    {/* Input - Restyled for dark theme */}
                                    <Input className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary" placeholder="+998 90 123 45 67" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" /> {/* Example error color */}
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Offer Description Field */}
                        <FormField
                          control={form.control}
                          name="offerDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Описание предложения</FormLabel> {/* Label color */}
                              <FormControl>
                                <div className="relative">
                                  <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" /> {/* Icon color */}
                                  {/* Textarea - Restyled for dark theme */}
                                  <Textarea
                                    className="pl-10 min-h-[120px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary resize-none"
                                    placeholder="Подробно опишите ваше коммерческое предложение..."
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" /> {/* Example error color */}
                            </FormItem>
                          )}
                        />

                        {/* File Upload Section - Restyled for dark theme */}
                        <div>
                          <FormLabel htmlFor="fileUpload" className="text-white">Прикрепить файлы</FormLabel> {/* Label color */}
                          <FormDescription className="text-xs text-slate-400 mb-2"> {/* Description color */}
                            Допустимые форматы: PDF, Word, Excel, JPEG, PNG (до 5MB)
                          </FormDescription>
                           {/* Dropzone area - Restyled for dark theme */}
                          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                              <Upload className="h-8 w-8 text-slate-400 mb-2" /> {/* Icon color */}
                              <span className="text-sm text-slate-300">Перетащите файлы сюда или кликните для выбора</span> {/* Text color */}
                              <input
                                id="fileUpload"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" // Keep accepted file types
                              />
                            </label>
                          </div>

                           {/* Uploaded Files List - Restyled for dark theme */}
                          {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2 text-slate-300"> {/* Text color */}
                              <p className="text-sm font-medium text-white">Загруженные файлы:</p> {/* Label color */}
                              <ul className="text-sm space-y-2"> {/* Adjusted spacing */}
                                {uploadedFiles.map((file, index) => (
                                  <li key={index} className="flex justify-between items-center py-2 px-3 bg-slate-700/50 rounded-md border border-slate-600"> {/* List item styling */}
                                    <span className="truncate max-w-[calc(100% - 40px)]">{file.name}</span> {/* Adjusted max-width for button */}
                                    {/* Remove button - Restyled color */}
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="text-slate-400 hover:text-red-400 ml-2 flex-shrink-0" // Adjusted colors and margin
                                    >
                                      <X className="h-4 w-4" /> {/* Use X icon */}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Submit Button - Restyled for dark theme */}
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 py-2 text-lg group" // Primary button style, adjusted size
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2">Отправка...</span>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> {/* Adjusted size */}
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" /> Отправить предложение {/* Adjusted size */}
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
                variants={staggerContainer} // Keep stagger animation for list items
              >
                 {/* Info Card - Restyled for dark theme */}
                <div className="bg-slate-800/40 rounded-xl p-6 md:p-8 h-full border border-slate-700/50">
                  {/* Heading - Restyled color */}
                  <h3 className="text-xl font-bold mb-6 text-white">Информация о сотрудничестве</h3>

                  {/* "Who can send" section - Restyled */}
                  <motion.div variants={listItemVariants} className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 text-primary">Кто может отправить предложение?</h4> {/* Heading color */}
                    <ul className="space-y-3 text-slate-300"> {/* Adjusted spacing, text color */}
                       {/* List items - Restyled checkmark/number icons and text */}
                      <motion.li variants={listItemVariants} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> {/* Primary icon */}
                        </div>
                        <span>Производители строительных материалов и оборудования</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                           <CheckCircle2 className="h-4 w-4 text-primary" />
                         </div>
                        <span>Поставщики строительной техники и инструментов</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                           <CheckCircle2 className="h-4 w-4 text-primary" />
                         </div>
                        <span>Компании, предлагающие услуги в сфере строительства</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                           <CheckCircle2 className="h-4 w-4 text-primary" />
                         </div>
                        <span>Индивидуальные подрядчики и специалисты</span>
                      </motion.li>
                    </ul>
                  </motion.div>

                  {/* "Requirements" section - Restyled */}
                  <motion.div variants={listItemVariants} className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 text-primary">Требования к предложениям</h4> {/* Heading color */}
                    <p className="text-slate-300 mb-4 leading-relaxed"> {/* Text color */}
                      Для того чтобы ваше предложение было рассмотрено в кратчайшие сроки,
                      пожалуйста, включите в него следующую информацию:
                    </p>
                    <ul className="space-y-3 text-slate-300"> {/* Adjusted spacing, text color */}
                       {/* List items - Restyled number icons and text */}
                      <motion.li variants={listItemVariants} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white font-semibold text-sm border border-slate-600"> {/* Dark background, border, text color */}
                          1
                        </div>
                        <span>Подробное описание товаров или услуг</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white font-semibold text-sm border border-slate-600">
                           2
                         </div>
                        <span>Цены и условия поставки</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white font-semibold text-sm border border-slate-600">
                           3
                         </div>
                        <span>Примеры выполненных проектов (если применимо)</span>
                      </motion.li>
                      <motion.li variants={listItemVariants} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white font-semibold text-sm border border-slate-600">
                           4
                         </div>
                        <span>Сертификаты качества и соответствия</span>
                      </motion.li>
                    </ul>
                  </motion.div>

                  {/* Note block - Restyled */}
                  <motion.div variants={listItemVariants} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"> {/* Dark background and border */}
                    <p className="text-sm text-slate-300"> {/* Text color */}
                      <strong>Обратите внимание:</strong> После получения вашего предложения,
                      наши специалисты рассмотрят его и свяжутся с вами в течение 5 рабочих дней.
                      Если вы не получили ответ в указанный срок, пожалуйста, свяжитесь с нами по
                      телефону: <strong><a href="tel:+998901234567" className="text-primary hover:text-primary/80 transition-colors">+998 90 123 45 67</a></strong> {/* Primary link color */}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer /> {/* Include Footer */}
      <ScrollToTopButton /> {/* Include scroll button */}
    </div>
  );
};

export default CommercialOffers;
