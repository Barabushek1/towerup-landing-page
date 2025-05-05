
import React, { useState } from 'react';
import { Tender, TenderApplication } from '@/types/tenders';
import { formatDate, submitTenderApplication } from '@/utils/tender-helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Tag, FileText, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TenderDetailsDialogProps {
  tender: Tender | null;
  isOpen: boolean;
  onClose: () => void;
}

const TenderDetailsDialog: React.FC<TenderDetailsDialogProps> = ({
  tender,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'apply'>('details');

  const formSchema = z.object({
    company_name: z.string().min(2, { message: t('collaboration.form.errors.companyNameRequired') }),
    contact_name: z.string().min(2, { message: t('collaboration.form.errors.contactNameRequired') }),
    email: z.string().email({ message: t('collaboration.form.errors.emailInvalid') }),
    phone: z.string().min(5, { message: t('collaboration.form.errors.phoneRequired') }),
    message: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!tender) return;
    
    setIsSubmitting(true);
    
    const application: TenderApplication = {
      ...values,
      tender_id: tender.id,
    };
    
    const result = await submitTenderApplication(application);
    
    setIsSubmitting(false);
    
    if (result.success) {
      toast({
        title: t('collaboration.form.successTitle'),
        description: t('collaboration.form.successMessage'),
      });
      form.reset();
      onClose();
    } else {
      toast({
        title: t('collaboration.form.errorTitle'),
        description: t('collaboration.form.errorMessage'),
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return t('collaboration.category.other');
    
    return t(`collaboration.category.${category}`) || category;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  if (!tender) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setStep('details');
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {step === 'details' ? tender.title : t('collaboration.form.title')}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {step === 'details' && (
            <DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusBadgeClass(tender.status))}>
                  {t(`collaboration.status.${tender.status}`)}
                </span>
                
                {tender.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                    {getCategoryLabel(tender.category)}
                  </span>
                )}
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'details' ? (
          <>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t('collaboration.description')}</h4>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{tender.description}</p>
              </div>

              {tender.requirements && (
                <div>
                  <h4 className="font-medium">{t('collaboration.requirements')}</h4>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{tender.requirements}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {tender.deadline && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {t('collaboration.deadline')}: {formatDate(tender.deadline)}
                  </div>
                )}
              </div>

              {tender.documents && tender.documents.length > 0 && (
                <div>
                  <h4 className="font-medium">{t('collaboration.documents')}</h4>
                  <ul className="mt-2 space-y-2">
                    {tender.documents.map((doc, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {doc.split('/').pop() || `${t('collaboration.document')} ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={() => setStep('apply')}
                disabled={tender.status !== 'active'}
              >
                {tender.status === 'active'
                  ? t('collaboration.applyNow')
                  : t('collaboration.tenderClosed')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('collaboration.form.companyName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('collaboration.form.companyNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('collaboration.form.contactName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('collaboration.form.contactNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('collaboration.form.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('collaboration.form.emailPlaceholder')} type="email" {...field} />
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
                      <FormLabel>{t('collaboration.form.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('collaboration.form.phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('collaboration.form.message')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('collaboration.form.messagePlaceholder')} 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                >
                  {t('collaboration.form.back')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('collaboration.form.submitting') : t('collaboration.form.submit')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TenderDetailsDialog;
