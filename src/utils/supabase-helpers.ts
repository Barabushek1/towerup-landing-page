
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
    featured: news.featured || false
  };
}

export function mapNewsItemToSupabaseInsert(news: Omit<NewsItem, 'id'>): SupabaseNewsInsert {
  return {
    title: news.title,
    summary: news.excerpt,
    content: news.content,
    image_url: news.image_url,
    additional_images: news.additional_images,
    featured: news.featured,
    published_at: news.date
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
  
  return update;
}

export function mapSupabaseMessageToMessageItem(message: SupabaseMessagesRow): MessageItem {
  return {
    id: message.id,
    name: message.email.split('@')[0], // Fallback name from email
    email: message.email,
    message: message.message,
    date: message.created_at || message.date || new Date().toISOString(),
    read: message.read || false
  };
}

export function mapMessageItemToSupabaseInsert(message: Omit<MessageItem, 'id' | 'date' | 'read'>): SupabaseMessagesInsert {
  return {
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
    requirements: vacancy.requirements,
    benefits: vacancy.benefits,
    image_url: vacancy.image_url
  };
}

export function mapVacancyItemToSupabaseInsert(vacancy: Omit<VacancyItem, 'id'>): SupabaseVacanciesInsert {
  return {
    title: vacancy.title,
    location: vacancy.location,
    salary_range: vacancy.salary,
    description: vacancy.description || '',
    requirements: vacancy.requirements,
    benefits: vacancy.benefits,
    is_active: true,
    image_url: vacancy.image_url
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
