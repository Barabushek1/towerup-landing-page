
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    contactMethod: 'phone' // Default to phone
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
        title: t('contact.validation.nameRequired'),
        description: t('contact.validation.nameMessage'),
        variant: "destructive"
      });
      return;
    }
    
    if (formData.contactMethod === 'email' && !formData.email) {
      toast({
        title: t('contact.validation.emailRequired'),
        description: t('contact.validation.emailMessage'),
        variant: "destructive"
      });
      return;
    }
    
    if (formData.contactMethod === 'phone' && !formData.phone) {
      toast({
        title: t('contact.validation.phoneRequired'),
        description: t('contact.validation.phoneMessage'),
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.message) {
      toast({
        title: t('contact.validation.messageRequired'),
        description: t('contact.validation.messageMessage'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting message:', formData);

      // Insert message with only fields that exist in the messages table
      const { error } = await supabase.from('messages').insert({
        name: formData.name,
        email: formData.email || '',
        message: formData.message,
        read: false,
        // Include phone in the message body if it's provided
        ...(formData.phone ? { 
          message: `${formData.message}\n\n${t('contact.phoneContact')}: ${formData.phone}` 
        } : {})
      });
      
      if (error) {
        console.error('Error submitting message:', error);
        throw error;
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        contactMethod: 'phone'
      });
      
      toast({
        title: t('contact.success.title'),
        description: t('contact.success.message')
      });
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        title: t('contact.error.title'),
        description: `${t('contact.error.message')}: ${error.message}. ${t('contact.error.tryAgain')}`,
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
        <PageHeader title={t('contact.breadcrumb')} breadcrumb={t('contact.breadcrumb')} />
      
        <section className="py-16 md:py-24 bg-[#1a1a1a] relative">
          {/* Wave decoration at top */}
          <div className="absolute top-0 left-0 w-full rotate-180 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#161616" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200 font-benzin text-center">{t('contact.title')}</h2>
              <p className="text-lg text-slate-300 mb-12 text-center font-benzin">
                {t('contact.subtitle')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/30">
                  <h3 className="text-2xl font-medium mb-6 text-slate-200 font-benzin">{t('contact.info.title')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-slate-200">{t('contact.info.address')}</h4>
                        <p className="text-slate-300 font-benzin font-thin">{t('contact.info.addressValue')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-slate-200">{t('contact.info.phone')}</h4>
                        <p className="text-slate-300 font-benzin">+998 55 510 00 03</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-slate-200">{t('contact.info.email')}</h4>
                        <p className="text-slate-300 font-benzin">info@towerup.uz</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-slate-200">{t('contact.info.schedule')}</h4>
                      <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/20">
                        <div>
                          <h5 className="text-sm text-slate-400 mb-1">{t('contact.info.noWeekends')}</h5>
                          <p className="text-slate-200 font-benzin">9:00 - 18:00</p>
                        </div>
                        <div>
                          
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/30">
                  <h3 className="text-2xl font-medium mb-6 text-slate-200 font-benzin">{t('contact.form.title')}</h3>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <Label htmlFor="name" className="text-slate-300 mb-1.5 block">{t('contact.form.name')}</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        type="text" 
                        placeholder={t('contact.form.name')} 
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-300 mb-1.5 block">{t('contact.form.contactMethod')}</Label>
                      <RadioGroup 
                        value={formData.contactMethod} 
                        onValueChange={handleContactMethodChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="contact-phone" />
                          <Label htmlFor="contact-phone" className="text-slate-300">{t('contact.form.phone')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email" className="text-slate-300">{t('contact.form.email')}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.contactMethod === 'phone' ? (
                      <div>
                        <Label htmlFor="phone" className="text-slate-300 mb-1.5 block">{t('contact.form.phoneNumber')}</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder={t('contact.form.phoneNumber')} 
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          required={formData.contactMethod === 'phone'} 
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="email" className="text-slate-300 mb-1.5 block">{t('contact.form.email')}</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder={t('contact.form.email')} 
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-white" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          required={formData.contactMethod === 'email'} 
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="message" className="text-slate-300 mb-1.5 block">{t('contact.form.message')}</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder={t('contact.form.message')} 
                        rows={5} 
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none text-white" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className={cn(
                        "button-hover-effect w-full px-6 py-3 rounded-lg bg-primary text-white font-medium font-benzin", 
                        "shadow-lg shadow-primary/20 transform transition flex items-center justify-center gap-2"
                      )} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="mt-16">
                <h2 className="text-2xl font-medium mb-6 text-slate-200 font-benzin">{t('contact.mapTitle')}</h2>
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-brand-primary mr-2" />
                  <span className="font-medium text-slate-200">{t('contact.mapCompany')}</span>
                </div>
                <div className="w-full rounded-xl overflow-hidden shadow-xl border border-slate-700/30">
                  <div className="aspect-video w-full">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7976.879721623986!2d69.25872!3d41.240959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae61aaa924ee97%3A0x64bd413fa7c03f6d!2sTOWER%20UP!5e1!3m2!1sen!2sus!4v1742675836272!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade" 
                      title="TOWER UP Location" 
                      className="w-full h-full"
                    ></iframe>
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
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Contact;
