import type { NewsItem, PartnerItem, MessageItem, VacancyItem } from '@/contexts/AdminDataContext';
import { Database } from '@/integrations/supabase/types';

export type SupabaseNewsRow = Database['public']['Tables']['news']['Row'];
export type SupabaseMessagesRow = Database['public']['Tables']['messages']['Row'];
export type SupabasePartnersRow = Database['public']['Tables']['partners']['Row'];
export type SupabaseVacanciesRow = Database['public']['Tables']['vacancies']['Row'];

export type SupabaseNewsInsert = Database['public']['Tables']['news']['Insert'];
export type SupabaseMessagesInsert = Database['public']['Tables']['messages']['Insert'];
export type SupabasePartnersInsert = Database['public']['Tables']['partners']['Insert'];
export type SupabaseVacanciesInsert = Database['public']['Tables']['vacancies']['Insert'];

export type SupabaseNewsUpdate = Database['public']['Tables']['news']['Update'];
export type SupabaseMessagesUpdate = Database['public']['Tables']['messages']['Update'];
export type SupabasePartnersUpdate = Database['public']['Tables']['partners']['Update'];
export type SupabaseVacanciesUpdate = Database['public']['Tables']['vacancies']['Update'];

// Validate image URL by checking if it can be loaded
export async function validateImageUrl(url: string): Promise<boolean> {
  // If the URL is empty or not a string, return false
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // If it's a data URL, assume it's valid
  if (url.startsWith('data:')) {
    return true;
  }
  
  // For file URLs created by the browser, assume they're valid
  if (url.startsWith('blob:') || url.startsWith('file:')) {
    return true;
  }
  
  try {
    // For remote URLs, we can't reliably test them on the server side
    // Just do a basic check that it looks like an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    // Consider URL valid if it has an image file extension or contains standard image hosting keywords
    if (hasImageExtension || 
        url.includes('image') ||
        url.includes('photo') ||
        url.includes('media') ||
        url.includes('upload') ||
        url.includes('asset')) {
      return true;
    }
    
    // If no clear indicators, return true anyway to avoid blocking valid URLs
    // The browser will handle invalid URLs when trying to load them
    return true;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
}

// Mapping functions
export function mapSupabaseNewsToNewsItem(news: SupabaseNewsRow): NewsItem {
  return {
    id: news.id,
    title: news.title,
    date: news.published_at,
    excerpt: news.summary,
    content: news.content,
    image_url: news.image_url || '',
    additional_images: news.additional_images || [],
    featured: news.featured || false,
    youtube_video_url: news.youtube_video_url || ''
  };
}

export function mapNewsItemToSupabaseInsert(news: Omit<NewsItem, 'id'>): SupabaseNewsInsert {
  return {
    title: news.title,
    summary: news.excerpt,
    content: news.content,
    image_url: news.image_url,
    additional_images: news.additional_images || [],
    featured: news.featured,
    published_at: news.date,
    youtube_video_url: news.youtube_video_url || null
  };
}

export function mapNewsItemToSupabaseUpdate(news: Partial<Omit<NewsItem, 'id'>>): SupabaseNewsUpdate {
  const update: SupabaseNewsUpdate = {};
  
  if (news.title !== undefined) update.title = news.title;
  if (news.excerpt !== undefined) update.summary = news.excerpt;
  if (news.content !== undefined) update.content = news.content;
  if (news.image_url !== undefined) update.image_url = news.image_url;
  if (news.additional_images !== undefined) update.additional_images = news.additional_images;
  if (news.featured !== undefined) update.featured = news.featured;
  if (news.date !== undefined) update.published_at = news.date;
  if (news.youtube_video_url !== undefined) update.youtube_video_url = news.youtube_video_url;
  
  return update;
}

export function mapSupabaseMessageToMessageItem(message: SupabaseMessagesRow): MessageItem {
  return {
    id: message.id,
    name: message.name || message.email.split('@')[0], // Fallback name from email if name is not provided
    email: message.email,
    message: message.message,
    date: message.created_at || message.date || new Date().toISOString(),
    read: message.read || false
  };
}

export function mapMessageItemToSupabaseInsert(message: Omit<MessageItem, 'id' | 'date' | 'read'>): SupabaseMessagesInsert {
  return {
    name: message.name,
    email: message.email,
    message: message.message
  };
}

export function mapSupabasePartnerToPartnerItem(partner: SupabasePartnersRow): PartnerItem {
  return {
    id: partner.id,
    name: partner.name,
    logo: partner.logo_url || '',
    url: partner.website_url
  };
}

export function mapPartnerItemToSupabaseInsert(partner: Omit<PartnerItem, 'id'>): SupabasePartnersInsert {
  return {
    name: partner.name,
    logo_url: partner.logo,
    website_url: partner.url
  };
}

export function mapSupabaseVacancyToVacancyItem(vacancy: SupabaseVacanciesRow): VacancyItem {
  return {
    id: vacancy.id,
    title: vacancy.title,
    location: vacancy.location || '',
    salary: vacancy.salary_range || '',
    type: 'fulltime', // Default value as it seems to be required but not in database
    description: vacancy.description,
    requirements: vacancy.requirements || '',
    benefits: vacancy.benefits || '',  // Provide an empty string if not available
    image_url: vacancy.image_url || '',  // Provide an empty string if not available
    employment_type: vacancy.employment_type || 'Полная занятость', // Add new field with default
    remote_status: vacancy.remote_status || 'Офис' // Add new field with default
  };
}

export function mapVacancyItemToSupabaseInsert(vacancy: Omit<VacancyItem, 'id'>): SupabaseVacanciesInsert {
  return {
    title: vacancy.title,
    location: vacancy.location,
    salary_range: vacancy.salary,
    description: vacancy.description || '',
    requirements: vacancy.requirements || '',
    is_active: true,
    employment_type: vacancy.employment_type || 'Полная занятость',
    remote_status: vacancy.remote_status || 'Офис'
  };
}

// Helper function to handle null or undefined arrays safely
export function safelyMapArray<T, R>(
  array: T[] | null | undefined,
  mapFn: (item: T) => R
): R[] {
  if (!array) return [];
  return array.map(mapFn);
}

// Safely convert date strings to ISO format
export function safelyFormatDate(dateString: string): string {
  try {
    return new Date(dateString).toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date().toISOString();
  }
}
