
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  image_url?: string | null;
  url: string;
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
  is_active?: boolean;
  project_type?: 'Реализованные' | 'Строящиеся' | 'Будущие';
  // Multilingual fields
  title_en?: string | null;
  title_ru?: string | null;
  title_uz?: string | null;
  description_en?: string | null;
  description_ru?: string | null;
  description_uz?: string | null;
  location_en?: string | null;
  location_ru?: string | null;
  location_uz?: string | null;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from database...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    console.log('Projects fetched successfully:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching projects:', err);
    return [];
  }
}

export async function fetchProjectsByType(type: string): Promise<Project[]> {
  try {
    console.log(`Fetching ${type} projects from database...`);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_type', type)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    console.log(`${type} projects fetched successfully:`, data?.length || 0);
    return data || [];
  } catch (err) {
    console.error(`Unexpected error fetching ${type} projects:`, err);
    return [];
  }
}

export async function fetchProject(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error fetching project:', err);
    return null;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    console.log('Creating project with data:', project);
    
    const { error, data } = await supabase
      .from('projects')
      .insert([project])
      .select();
    
    if (error) {
      console.error('Error creating project:', error);
      return false;
    }
    
    console.log('Project created successfully:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error creating project:', err);
    return false;
  }
}

export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  try {
    console.log('Updating project with id:', id, 'and data:', project);
    
    const { error, data } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating project:', error);
      return false;
    }
    
    console.log('Project updated successfully:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error updating project:', err);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error deleting project:', err);
    return false;
  }
}
