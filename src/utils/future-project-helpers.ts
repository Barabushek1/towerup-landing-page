
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Updated FutureProject type to support multi-language content
export type FutureProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  completionDate?: string;
  status: string;
  featured?: boolean;
  coverImage?: string;
  galleryImages?: string[];
  features?: {title: string, description: string}[];
  createdAt: string;
  updatedAt: string;
  // Add localization fields
  title_en?: string;
  title_ru?: string;
  title_uz?: string;
  description_en?: string;
  description_ru?: string;
  description_uz?: string;
  location_en?: string;
  location_ru?: string;
  location_uz?: string;
};

// Helper function to parse features from JSON data
function parseFeatures(featuresData: any): {title: string, description: string}[] {
  if (!featuresData) return [];
  
  try {
    if (Array.isArray(featuresData)) {
      return featuresData.map(feature => {
        if (typeof feature === 'object' && feature !== null) {
          return {
            title: feature.title || '',
            description: feature.description || ''
          };
        }
        return { title: '', description: '' };
      }).filter(f => f.title || f.description);
    }
    
    if (typeof featuresData === 'object' && featuresData !== null) {
      return Object.values(featuresData).map(feature => {
        if (typeof feature === 'object' && feature !== null) {
          return {
            title: (feature as any).title || '',
            description: (feature as any).description || ''
          };
        }
        return { title: '', description: '' };
      }).filter(f => f.title || f.description);
    }
  } catch (error) {
    console.error('Error parsing features:', error);
  }
  
  return [];
}

export async function fetchFutureProjects(): Promise<FutureProject[]> {
  const { data, error } = await supabase
    .from('future_projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching future projects:', error);
    return [];
  }

  return data.map(project => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    location: project.location,
    completionDate: project.completion_date,
    status: project.status,
    featured: project.featured,
    coverImage: project.cover_image,
    galleryImages: project.gallery_images,
    features: parseFeatures(project.features),
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    // Map localization fields
    title_en: project.title_en,
    title_ru: project.title_ru,
    title_uz: project.title_uz,
    description_en: project.description_en,
    description_ru: project.description_ru,
    description_uz: project.description_uz,
    location_en: project.location_en,
    location_ru: project.location_ru,
    location_uz: project.location_uz
  }));
}

export async function fetchFutureProjectBySlug(slug: string): Promise<FutureProject | null> {
  const { data, error } = await supabase
    .from('future_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching future project:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    location: data.location,
    completionDate: data.completion_date,
    status: data.status,
    featured: data.featured,
    coverImage: data.cover_image,
    galleryImages: data.gallery_images,
    features: parseFeatures(data.features),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    // Map localization fields
    title_en: data.title_en,
    title_ru: data.title_ru,
    title_uz: data.title_uz,
    description_en: data.description_en,
    description_ru: data.description_ru,
    description_uz: data.description_uz,
    location_en: data.location_en,
    location_ru: data.location_ru,
    location_uz: data.location_uz
  };
}

export async function addFutureProject(project: Omit<FutureProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<FutureProject | null> {
  const { data, error } = await supabase
    .from('future_projects')
    .insert({
      title: project.title,
      slug: project.slug,
      description: project.description,
      location: project.location || null,
      completion_date: project.completionDate || null,
      status: project.status,
      featured: project.featured || false,
      cover_image: project.coverImage || null,
      gallery_images: project.galleryImages || [],
      features: project.features || [],
      // Insert localization fields
      title_en: project.title_en || null,
      title_ru: project.title_ru || null,
      title_uz: project.title_uz || null,
      description_en: project.description_en || null,
      description_ru: project.description_ru || null,
      description_uz: project.description_uz || null,
      location_en: project.location_en || null,
      location_ru: project.location_ru || null,
      location_uz: project.location_uz || null
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error adding future project:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    location: data.location,
    completionDate: data.completion_date,
    status: data.status,
    featured: data.featured,
    coverImage: data.cover_image,
    galleryImages: data.gallery_images,
    features: parseFeatures(data.features),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    // Map localization fields
    title_en: data.title_en,
    title_ru: data.title_ru,
    title_uz: data.title_uz,
    description_en: data.description_en,
    description_ru: data.description_ru,
    description_uz: data.description_uz,
    location_en: data.location_en,
    location_ru: data.location_ru,
    location_uz: data.location_uz
  };
}

export async function updateFutureProject(id: string, project: Partial<Omit<FutureProject, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
  const updates: any = {};
  
  if (project.title !== undefined) updates.title = project.title;
  if (project.slug !== undefined) updates.slug = project.slug;
  if (project.description !== undefined) updates.description = project.description;
  if (project.location !== undefined) updates.location = project.location;
  if (project.completionDate !== undefined) updates.completion_date = project.completionDate;
  if (project.status !== undefined) updates.status = project.status;
  if (project.featured !== undefined) updates.featured = project.featured;
  if (project.coverImage !== undefined) updates.cover_image = project.coverImage;
  if (project.galleryImages !== undefined) updates.gallery_images = project.galleryImages;
  if (project.features !== undefined) updates.features = project.features;
  // Update localization fields
  if (project.title_en !== undefined) updates.title_en = project.title_en;
  if (project.title_ru !== undefined) updates.title_ru = project.title_ru;
  if (project.title_uz !== undefined) updates.title_uz = project.title_uz;
  if (project.description_en !== undefined) updates.description_en = project.description_en;
  if (project.description_ru !== undefined) updates.description_ru = project.description_ru;
  if (project.description_uz !== undefined) updates.description_uz = project.description_uz;
  if (project.location_en !== undefined) updates.location_en = project.location_en;
  if (project.location_ru !== undefined) updates.location_ru = project.location_ru;
  if (project.location_uz !== undefined) updates.location_uz = project.location_uz;
  
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('future_projects')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating future project:', error);
    return false;
  }

  return true;
}

export async function deleteFutureProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('future_projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting future project:', error);
    return false;
  }

  return true;
}

export async function generateSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  // Check if slug already exists
  const { data } = await supabase
    .from('future_projects')
    .select('slug')
    .eq('slug', baseSlug);
  
  if (!data || data.length === 0) {
    return baseSlug;
  }
  
  // If slug exists, add a number suffix
  let newSlug = '';
  let counter = 1;
  
  while (true) {
    newSlug = `${baseSlug}-${counter}`;
    const { data } = await supabase
      .from('future_projects')
      .select('slug')
      .eq('slug', newSlug);
    
    if (!data || data.length === 0) {
      return newSlug;
    }
    
    counter++;
  }
}
