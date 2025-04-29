import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
const ContactSection: React.FC = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    contactMethod: 'phone' // Default to phone
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleContactMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethod: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on selected contact method
    if (!formData.name) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, укажите ваше имя",
        variant: "destructive"
      });
      return;
    }
    if (formData.contactMethod === 'email' && !formData.email) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, укажите ваш email",
        variant: "destructive"
      });
      return;
    }
    if (formData.contactMethod === 'phone' && !formData.phone) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, укажите ваш номер телефона",
        variant: "destructive"
      });
      return;
    }
    if (!formData.message) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, напишите сообщение",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Submitting message from contact section:', formData);

      // Insert message into the database with only fields that exist in the table
      const {
        error
      } = await supabase.from('messages').insert([{
        name: formData.name,
        email: formData.email || '',
        message: formData.message,
        read: false,
        // phone is missing from the database schema, so we'll include it in the message
        ...(formData.phone ? {
          message: `${formData.message}\n\nТелефон для связи: ${formData.phone}`
        } : {})
      }]);
      if (error) {
        console.error('Error submitting message:', error);
        throw error;
      }
      console.log('Message submitted successfully');

      // Show success state
      setIsSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          contactMethod: 'phone'
        });
      }, 3000);
      toast({
        title: "Успешно отправлено",
        description: "Мы получили ваше сообщение и свяжемся с вами в ближайшее время"
      });
    } catch (error: any) {
      console.error('Error in contact section form submission:', error);
      toast({
        title: "Ошибка отправки",
        description: `Произошла ошибка при отправке сообщения: ${error.message || 'Неизвестная ошибка'}. Пожалуйста, попробуйте еще раз.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  const contactInfoVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  return <section id="contact" className="py-16 bg-[#161616] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] animate-pulse animation-delay-3000"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="flex flex-col items-center mb-12" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">Связаться с нами</h2>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-slate-300 text-lg max-w-2xl text-center">
            Мы всегда готовы ответить на ваши вопросы и помочь решить ваши задачи
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:order-2">
            <motion.div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl border border-slate-700/30" initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={formVariants}>
              <h3 className="text-2xl font-bold mb-6 text-white">Отправить сообщение</h3>
              
              {isSuccess ? <motion.div className="flex flex-col items-center justify-center py-10" initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.4
            }}>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Сообщение отправлено!</h4>
                  <p className="text-slate-400 text-center">Мы свяжемся с вами в ближайшее время</p>
                </motion.div> : <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ваше имя" className="bg-slate-800 border-slate-700 focus:border-primary" />
                    </motion.div>
                    
                    <motion.div className="space-y-3" variants={itemVariants}>
                      <Label className="text-white">Предпочитаемый способ связи</Label>
                      <RadioGroup value={formData.contactMethod} onValueChange={handleContactMethodChange} className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="phone" />
                          <Label htmlFor="phone" className="text-slate-300">Телефон</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="text-slate-300">Email</Label>
                        </div>
                      </RadioGroup>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      {formData.contactMethod === 'phone' ? <Input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Ваш номер телефона" className="bg-slate-800 border-slate-700 focus:border-primary" /> : <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Ваш email" className="bg-slate-800 border-slate-700 focus:border-primary" />}
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Ваше сообщение" rows={5} className="bg-slate-800 border-slate-700 focus:border-primary" />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full relative overflow-hidden group" disabled={isSubmitting}>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/60 group-hover:opacity-80 opacity-0 transition-opacity duration-300"></span>
                        
                        {isSubmitting ? <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Отправка...
                          </> : <>
                            <Send className="mr-2 h-4 w-4" />
                            Отправить сообщение
                          </>}
                      </Button>
                    </motion.div>
                  </div>
                </form>}
            </motion.div>
          </div>
          
          <div className="lg:order-1">
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={contactInfoVariants}>
              <h3 className="text-2xl font-bold mb-6 text-white">Контактная информация</h3>
              
              <div className="space-y-8">
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Адрес</h4>
                    <p className="text-slate-300">Город Ташкент, Сергелийский район, МСГ Янги Қумариқ.
Ориентир: Моторный завод GM.</p>
                  </div>
                </motion.div>
                
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Телефон</h4>
                    <p className="text-slate-300">+998 55 510 00 03</p>
                    <p className="text-slate-300">+998 55 511 00 03</p>
                  </div>
                </motion.div>
                
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                    <p className="text-slate-300">info@towerup.uz</p>
                  </div>
                </motion.div>
                
                <motion.div className="mt-8" variants={itemVariants}>
                  <h4 className="text-lg font-medium text-white mb-4">Социальные сети</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path></svg>
                    </a>
                    <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </motion.div>
                
                {/* 3D card effect */}
                <motion.div className="mt-12 p-6 bg-gradient-to-br from-primary/20 to-slate-800/80 rounded-xl border border-slate-700/30" initial={{
                y: 20,
                opacity: 0
              }} whileInView={{
                y: 0,
                opacity: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.5,
                duration: 0.6
              }} whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.15)"
              }}>
                  <h4 className="text-lg font-medium text-white mb-2">Часы работы</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Понедельник - Воскресенье:</span>
                      <span className="text-white">9:00 - 18:00</span>
                    </div>
                    
                    <div className="flex justify-between">
                      
                      <span className="text-white px-[198px] my-[18px]">Без выходных</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;