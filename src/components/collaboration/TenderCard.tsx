
import React from 'react';
import { Tender } from '@/types/tenders';
import { formatDate } from '@/utils/tender-helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TenderCardProps {
  tender: Tender;
  onClick: () => void;
}

const TenderCard: React.FC<TenderCardProps> = ({ tender, onClick }) => {
  const { t } = useLanguage();

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

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusBadgeClass(tender.status))}>
                {t(`collaboration.status.${tender.status}`)}
              </span>
              
              {tender.category && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <Tag className="w-4 h-4 mr-1" />
                  {getCategoryLabel(tender.category)}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold">{tender.title}</h3>
            
            <p className="mt-2 text-muted-foreground line-clamp-2">
              {tender.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {tender.deadline && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {t('collaboration.deadline')}: {formatDate(tender.deadline)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <Button variant="outline" size="sm" className="gap-1" onClick={onClick}>
            <FileText className="h-4 w-4" />
            {t('collaboration.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
