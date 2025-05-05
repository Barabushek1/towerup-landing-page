import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Building,
  Send,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useToast } from '../../hooks/use-toast';
// Assuming you would connect this to Supabase eventually, but keeping it simulated for now
// import { supabase } from '@/integrations/supabase/client';


const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '', // This field doesn't seem to exist in the main 'messages' table
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Added success state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, interest: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (can be enhanced with zod like other form)
     if (!formData.name || !formData.phone || !formData.interest || !formData.message) {
        toast({
            title: t('contact.toast.validationError'), // Use translation
            description: t('contact.toast.validationErrorDesc'), // Use translation
            variant: "destructive"
        });
        return;
    }


    setIsSubmitting(true);

    // --- Simulate form submission (replace with actual Supabase insert) ---
    console.log('Simulating submitting message:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
       setIsSuccess(true); // Set success state

      // Reset form after a delay
       setTimeout(() => {
           setIsSuccess(false); // Hide success state
           setFormData({
               name: '',
               phone: '',
               email: '',
               interest: '',
               message: ''
           });
       }, 3000); // Hide success message after 3 seconds

      toast({
        title: t('contact.toast.successTitle'), // Use translation
        description: t('contact.toast.successDesc'), // Use translation
        variant: "default",
      });
    }, 1000);
    // --- End Simulation ---

     /*
     // --- Example of actual Supabase implementation (needs 'interest' field in 'messages' table or combine) ---
     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ... validation logic ...

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('messages').insert([
                {
                    name: formData.name,
                    email: formData.email, // Ensure email field exists and is valid if required
                    phone: formData.phone, // Ensure phone field exists
                    interest: formData.interest, // Ensure interest field exists
                    message: formData.message,
                    read: false, // Default to unread
                }
            ]);

            if (error) {
                console.error('Error submitting message:', error);
                throw error;
            }

            setIsSuccess(true); // Show success state
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ name: '', phone: '', email: '', interest: '', message: '' });
            }, 3000);

            toast({ title: t('contact.toast.successTitle'), description: t('contact.toast.successDesc') });

        } catch (error: any) {
            console.error('Error in form submission:', error);
            toast({
                title: t('contact.toast.errorTitle'),
                description: `${t('contact.toast.errorDesc')}: ${error.message || t('contact.toast.unknownError')}`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
     };
     */
  };

   // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  const contactInfoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };


  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-[#1a1a1a] relative overflow-hidden" // Dark background
      ref={sectionRef}
    >
       {/* Background gradient effect - adapted for dark theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] animate-pulse animation-delay-3000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10"> {/* Use px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16" // Adjusted spacing
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {t('newUzbekistan.contact.title')}
          </h2>

          <p className="text-xl text-primary"> {/* Primary accent color */}
            {t('newUzbekistan.contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
             <h3 className="text-2xl font-bold mb-6 text-white">Контактная информация</h3> {/* Added heading */}

            <div className="space-y-6"> {/* Reduced space-y for tighter contact info list */}
               <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
                 <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                   <div className="bg-primary/10 p-3 rounded-md"> {/* Primary accent background */}
                     <Building className="h-6 w-6 text-primary" /> {/* Primary accent color */}
                   </div>
                   <div>
                     <h4 className="text-lg font-medium text-white mb-1">
                       {t('newUzbekistan.contact.office')}
                     </h4>
                     <p className="text-slate-300"> {/* Adjusted text color */}
                       {t('newUzbekistan.contact.address')}
                     </p>
                   </div>
                 </motion.div>
               </div>

               <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md"> {/* Primary accent background */}
                    <Phone className="h-6 w-6 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">
                      {t('newUzbekistan.contact.phone')}
                    </h4>
                    <p className="text-slate-300">+998 (71) 123-45-67</p> {/* Keep example data */}
                    <p className="text-slate-300">+998 (71) 987-65-43</p> {/* Keep example data */}
                  </div>
                </motion.div>
               </div>

              <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md"> {/* Primary accent background */}
                    <Mail className="h-6 w-6 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">
                      {t('newUzbekistan.contact.email')}
                    </h4>
                    <p className="text-slate-300">info@towerup.uz</p> {/* Keep example data */}
                    <p className="text-slate-300">sales@towerup.uz</p> {/* Keep example data */}
                  </div>
                </motion.div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
                <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="bg-primary/10 p-3 rounded-md"> {/* Primary accent background */}
                    <Clock className="h-6 w-6 text-primary" /> {/* Primary accent color */}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">
                      {t('newUzbekistan.contact.hours')}
                    </h4>
                    <p className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.schedule')}
                    </p>
                  </div>
                </motion.div>
              </div>


               {/* Map Placeholder - Integrate the map embed or image placeholder here */}
               <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
                   <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                     <div className="bg-primary/10 p-3 rounded-md"> {/* Primary accent background */}
                       <MapPin className="h-6 w-6 text-primary" /> {/* Primary accent color */}
                     </div>
                     <div className="w-full"> {/* Use w-full to allow map to expand */}
                       <h3 className="text-xl font-bold mb-2 text-white">
                         {t('contact.map.title')} {/* Using the translated key from main site */}
                       </h3>
                       <div className="mt-3 rounded-lg overflow-hidden aspect-video bg-slate-700/50 flex items-center justify-center"> {/* Dark placeholder/map container */}
                         {/* Insert your map iframe or image placeholder here */}
                          <iframe
                             src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7976.879721623986!2d69.25872!3d41.240959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae61aaa924ee97%3A0x64bd413fa7c03f6d!2sTOWER%20UP!5e1!3m2!1sen!2sus!4v1742675836272!5m2!1sen!2sus`}
                             width="100%"
                             height="100%"
                             style={{ border: 0 }}
                             allowFullScreen
                             loading="lazy"
                             referrerPolicy="no-referrer-when-downgrade"
                             title="TOWER UP Location"
                             className="w-full h-full" // Ensure iframe takes full space
                           ></iframe>
                     </div>
                   </div>
                 </motion.div>
               </div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:order-2" // Ensure form is on the right on larger screens
          >
            <div className="bg-slate-800/40 p-8 rounded-xl shadow-lg border border-slate-700/30"> {/* Dark card style */}
              <h3 className="text-2xl font-bold mb-6 text-white">
                {t('newUzbekistan.contact.form.title')}
              </h3>

              {isSuccess ? ( // Success message with dark theme styling
                  <motion.div
                    className="flex flex-col items-center justify-center py-10 text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4"> {/* Primary accent background */}
                      <Check className="h-8 w-8 text-primary" /> {/* Primary accent color */}
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-white">Сообщение отправлено!</h4>
                    <p className="text-slate-400 text-center">Мы свяжемся с вами в ближайшее время</p>
                  </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ваше имя" // Changed placeholder language
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-primary" // Dark input styles
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.form.phone')} *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 XX XXX XX XX" // Changed placeholder language
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-primary" // Dark input styles
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.form.email')}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ваш email" // Changed placeholder language
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-primary" // Dark input styles
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.form.interest')} *
                    </Label>
                    {/* Select component styling for dark theme */}
                    <Select
                      value={formData.interest}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-primary">
                        <SelectValue placeholder="Выберите цель обращения" /> {/* Changed placeholder language */}
                      </SelectTrigger>
                      {/* Ensure SelectContent and SelectItem are also styled for dark theme globally or here */}
                      <SelectContent className="bg-slate-800 text-white border-slate-700">
                         <SelectItem value="apartment">{t('newUzbekistan.contact.form.interestOptions.apartment')}</SelectItem> {/* Use translations */}
                         <SelectItem value="investment">{t('newUzbekistan.contact.form.interestOptions.investment')}</SelectItem> {/* Use translations */}
                         <SelectItem value="partnership">{t('newUzbekistan.contact.form.interestOptions.partnership')}</SelectItem> {/* Use translations */}
                         <SelectItem value="other">{t('newUzbekistan.contact.form.interestOptions.other')}</SelectItem> {/* Use translations */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300"> {/* Adjusted text color */}
                      {t('newUzbekistan.contact.form.message')}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ваше сообщение" // Changed placeholder language
                      rows={4}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-primary resize-none" // Dark textarea styles
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                       className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" // Primary button style
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Отправка...</span> {/* Changed text */}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          <span>{t('newUzbekistan.contact.form.submit')}</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-4"> {/* Adjusted text color */}
                    {t('newUzbekistan.contact.form.policy')}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;