
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, Upload, Mail, Phone, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  company: string;
  type: string;
  email: string;
  phone: string;
  message: string;
  files: File[];
}

const CommercialProposalsSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    type: '',
    email: '',
    phone: '',
    message: '',
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (formData.files.length + newFiles.length <= 5) {
        setFormData((prev) => ({
          ...prev,
          files: [...prev.files, ...newFiles],
        }));
      } else {
        toast({
          title: "Too many files",
          description: "Maximum 5 files allowed",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (formData.files.length + newFiles.length <= 5) {
        setFormData((prev) => ({
          ...prev,
          files: [...prev.files, ...newFiles],
        }));
      } else {
        toast({
          title: "Too many files",
          description: "Maximum 5 files allowed",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t('collaboration.proposals.toast.submittedTitle'),
        description: t('collaboration.proposals.toast.submittedDesc'),
      });
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        type: '',
        email: '',
        phone: '',
        message: '',
        files: [],
      });
    }, 1500);
  };

  return (
    <div>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('collaboration.proposals.intro.title')}</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">{t('collaboration.proposals.intro.description')}</p>
          
          <Alert className="bg-blue-900/20 border-blue-800 text-blue-100">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription>
              {t('collaboration.proposals.intro.alert')}
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">{t('collaboration.proposals.form.title')}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('collaboration.proposals.form.nameLabel')}</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('collaboration.proposals.form.namePlaceholder')}
                    required
                    className="bg-slate-900/60 border-slate-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">{t('collaboration.proposals.form.companyLabel')}</Label>
                  <Input 
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('collaboration.proposals.form.companyPlaceholder')}
                    required
                    className="bg-slate-900/60 border-slate-700"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t('collaboration.proposals.form.typeLabel')}</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                  required
                >
                  <SelectTrigger className="bg-slate-900/60 border-slate-700">
                    <SelectValue placeholder={t('collaboration.proposals.form.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materials">
                      {t('collaboration.proposals.form.types.materials')}
                    </SelectItem>
                    <SelectItem value="equipment">
                      {t('collaboration.proposals.form.types.equipment')}
                    </SelectItem>
                    <SelectItem value="services">
                      {t('collaboration.proposals.form.types.services')}
                    </SelectItem>
                    <SelectItem value="other">
                      {t('collaboration.proposals.form.types.other')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('collaboration.proposals.form.emailLabel')}</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('collaboration.proposals.form.emailPlaceholder')}
                    required
                    className="bg-slate-900/60 border-slate-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('collaboration.proposals.form.phoneLabel')}</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('collaboration.proposals.form.phonePlaceholder')}
                    required
                    className="bg-slate-900/60 border-slate-700"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">{t('collaboration.proposals.form.messageLabel')}</Label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('collaboration.proposals.form.messagePlaceholder')}
                  required
                  className="min-h-[120px] bg-slate-900/60 border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="files">{t('collaboration.proposals.form.filesLabel')}</Label>
                  <span className="ml-2 text-xs text-slate-400">
                    ({t('collaboration.proposals.form.filesHelp')})
                  </span>
                </div>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm mb-1 text-slate-300">{t('collaboration.proposals.form.dropFilesText')}</p>
                    <p className="text-xs text-slate-400">{t('collaboration.proposals.form.allowedFormats')}</p>
                  </div>
                </div>
                
                {formData.files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-300 mb-2">{t('collaboration.proposals.form.selectedFiles')}</p>
                    <div className="space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/60 p-2 rounded">
                          <span className="text-sm text-slate-300 truncate max-w-[90%]">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('collaboration.proposals.form.submittingButton')}
                  </>
                ) : (
                  t('collaboration.proposals.form.submitButton')
                )}
              </Button>
            </form>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">{t('collaboration.proposals.contact.title')}</h3>
            <p className="text-slate-300 mb-6">{t('collaboration.proposals.contact.description')}</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">{t('collaboration.proposals.contact.emailLabel')}</p>
                <a href="mailto:procurement@towerup.uz" className="text-primary hover:underline flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  procurement@towerup.uz
                </a>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 mb-1">{t('collaboration.proposals.contact.phoneLabel')}</p>
                <a href="tel:+998901234567" className="text-primary hover:underline flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +998 90 123 45 67
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommercialProposalsSection;
