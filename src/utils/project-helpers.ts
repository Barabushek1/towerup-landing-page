
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
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from database...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
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

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    console.log('Fetching all projects from database...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
    
    console.log('All projects fetched successfully:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching all projects:', err);
    return [];
  }
}

export async function fetchFeaturedProjects(limit = 5): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching featured projects:', err);
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
      .insert([{
        ...project,
        is_active: true,
        is_featured: project.status === 'featured'
      }])
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
    
    // If status is being updated, also update is_featured flag
    const updates: any = { ...project };
    if (project.status) {
      updates.is_featured = project.status === 'featured';
    }
    
    const { error, data } = await supabase
      .from('projects')
      .update(updates)
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

export async function toggleProjectStatus(id: string, isActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ is_active: isActive })
      .eq('id', id);
    
    if (error) {
      console.error('Error toggling project status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error toggling project status:', err);
    return false;
  }
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ 
        is_featured: isFeatured,
        status: isFeatured ? 'featured' : 'active'
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error toggling project featured status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error toggling project featured status:', err);
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
