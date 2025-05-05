
import { supabase } from '@/integrations/supabase/client';
import { Tender, TenderApplication } from '@/types/tenders';

export async function fetchTenders(): Promise<Tender[]> {
  try {
    const { data, error } = await supabase
      .from('tenders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tenders:', error);
    return [];
  }
}

export async function fetchActiveTenders(): Promise<Tender[]> {
  try {
    const { data, error } = await supabase
      .from('tenders')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active tenders:', error);
    return [];
  }
}

export async function fetchTenderById(id: string): Promise<Tender | null> {
  try {
    const { data, error } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching tender with id ${id}:`, error);
    return null;
  }
}

export async function submitTenderApplication(application: TenderApplication): Promise<{success: boolean, data?: any, error?: any}> {
  try {
    const { data, error } = await supabase
      .from('tender_applications')
      .insert(application)
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    return {
      success: false,
      error
    };
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not specified';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
