import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

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
  features?: any[];
  createdAt: string;
  updatedAt: string;
};

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
    features: Array.isArray(project.features) ? project.features : [],
    createdAt: project.created_at,
    updatedAt: project.updated_at
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
    features: Array.isArray(data.features) ? data.features : [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
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
      features: project.features || []
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
    features: Array.isArray(data.features) ? data.features : [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
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
