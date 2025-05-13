
import { supabase } from '@/integrations/supabase/client';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  title_ru?: string | null;
  title_uz?: string | null;
  title_en?: string | null;
  description: string;
  description_ru?: string | null;
  description_uz?: string | null;
  description_en?: string | null;
  icon_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchTimelineEvents(): Promise<TimelineEvent[]> {
  try {
    console.log('Fetching timeline events...');
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching timeline events:', error);
      return [];
    }
    
    console.log('Timeline events fetched successfully:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching timeline events:', err);
    return [];
  }
}

export async function fetchTimelineEvent(id: string): Promise<TimelineEvent | null> {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching timeline event:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error fetching timeline event:', err);
    return null;
  }
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    console.log('Creating timeline event with data:', event);
    
    const { error } = await supabase
      .from('timeline_events')
      .insert([event]);
    
    if (error) {
      console.error('Error creating timeline event:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error creating timeline event:', err);
    return false;
  }
}

export async function updateTimelineEvent(id: string, event: Partial<Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  try {
    console.log('Updating timeline event with id:', id, 'and data:', event);
    
    const { error } = await supabase
      .from('timeline_events')
      .update(event)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating timeline event:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error updating timeline event:', err);
    return false;
  }
}

export async function deleteTimelineEvent(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting timeline event:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error deleting timeline event:', err);
    return false;
  }
}

export async function reorderTimelineEvents(orderedIds: string[]): Promise<boolean> {
  try {
    // Update each item's display_order
    const promises = orderedIds.map((id, index) => {
      return supabase
        .from('timeline_events')
        .update({ display_order: index + 1 })
        .eq('id', id);
    });
    
    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error('Error reordering timeline events:', err);
    return false;
  }
}
