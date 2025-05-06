
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const CommercialProposalsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    company: '',
    proposalType: '',
    email: '',
    phone: '',
    message: '',
    files: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      proposalType: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        files: [...formData.files, ...filesArray].slice(0, 5) // Limit to 5 files
      });
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: t('collaboration.proposals.toast.submittedTitle'),
        description: t('collaboration.proposals.toast.submittedDesc'),
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        proposalType: '',
        email: '',
        phone: '',
        message: '',
        files: []
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  const allowedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
  
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-slate-800/30 border border-slate-700/30 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-white mb-4">{t('collaboration.proposals.intro.title')}</h3>
        <p className="text-slate-300 mb-4">{t('collaboration.proposals.intro.description')}</p>
        
        <div className="bg-brand-primary/10 border border-brand-primary/30 rounded p-4 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-brand-primary text-sm">{t('collaboration.proposals.intro.alert')}</p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-6">{t('collaboration.proposals.form.title')}</h4>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                {t('collaboration.proposals.form.nameLabel')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={t('collaboration.proposals.form.namePlaceholder')}
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
            
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">
                {t('collaboration.proposals.form.companyLabel')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                placeholder={t('collaboration.proposals.form.companyPlaceholder')}
                value={formData.company}
                onChange={handleInputChange}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
          </div>
          
          {/* Proposal Type */}
          <div className="space-y-2">
            <Label htmlFor="proposalType" className="text-white">
              {t('collaboration.proposals.form.typeLabel')}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select 
              value={formData.proposalType} 
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                {t('collaboration.proposals.form.emailLabel')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('collaboration.proposals.form.emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
            
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                {t('collaboration.proposals.form.phoneLabel')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder={t('collaboration.proposals.form.phonePlaceholder')}
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="border-slate-700 bg-slate-800/50 text-white"
              />
            </div>
          </div>
          
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              {t('collaboration.proposals.form.messageLabel')}
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder={t('collaboration.proposals.form.messagePlaceholder')}
              value={formData.message}
              onChange={handleInputChange}
              className="min-h-32 border-slate-700 bg-slate-800/50 text-white"
            />
          </div>
          
          {/* File Upload */}
          <div className="space-y-3">
            <Label className="text-white">
              {t('collaboration.proposals.form.filesLabel')}
              <span className="text-sm text-slate-400 ml-2 font-normal">
                ({t('collaboration.proposals.form.filesHelp')})
              </span>
            </Label>
            
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
              <Input
                id="files"
                type="file"
                multiple
                accept={allowedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                disabled={formData.files.length >= 5}
              />
              <Label 
                htmlFor="files" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-10 w-10 text-slate-400" />
                <span className="text-slate-300">
                  {t('collaboration.proposals.form.dropFilesText')}
                </span>
                <span className="text-sm text-slate-400">
                  {t('collaboration.proposals.form.allowedFormats')}
                </span>
              </Label>
            </div>
            
            {/* File list */}
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-300">{t('collaboration.proposals.form.selectedFiles')} ({formData.files.length}/5):</p>
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-slate-800 p-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-700 flex items-center justify-center rounded">
                          <span className="text-xs text-slate-300">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-300 truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('collaboration.proposals.form.submittingButton')}
                </>
              ) : t('collaboration.proposals.form.submitButton')}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Contact Info */}
      <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4">
          {t('collaboration.proposals.contact.title')}
        </h4>
        <p className="text-slate-300 mb-4">
          {t('collaboration.proposals.contact.description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-400">
              {t('collaboration.proposals.contact.emailLabel')}
            </span>
            <a href="mailto:proposals@towerup.uz" className="text-brand-primary hover:underline">
              proposals@towerup.uz
            </a>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-400">
              {t('collaboration.proposals.contact.phoneLabel')}
            </span>
            <a href="tel:+998901234567" className="text-brand-primary hover:underline">
              +998 90 123 45 67
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialProposalsSection;
