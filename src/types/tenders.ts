
export type TenderStatus = 'active' | 'closed' | 'pending';

export type TenderCategory = 'supply' | 'design' | 'services' | 'construction' | 'other';

export interface Tender {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  deadline?: string;
  status: TenderStatus;
  created_at: string;
  updated_at: string;
  documents?: string[];
  category?: string;
}

export interface TenderApplication {
  id?: string;
  tender_id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message?: string;
  attachments?: string[];
  status?: string;
  created_at?: string;
}
