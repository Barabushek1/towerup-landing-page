import { supabase } from '@/integrations/supabase/client';

export interface ProjectCharacteristic {
  id: string;
  project_slug: string;
  characteristic_type: string;
  icon: string;
  value: string;
  value_ru: string | null;
  value_uz: string | null;
  value_en: string | null;
  label: string;
  label_ru: string | null;
  label_uz: string | null;
  label_en: string | null;
  display_order: number;
}

/**
 * Fetches the main characteristics for a specific project
 * @param slug The project slug (e.g., 'pushkin', 'new-uzbekistan')
 * @returns Array of project characteristics
 */
export async function fetchProjectCharacteristics(slug: string): Promise<ProjectCharacteristic[]> {
  try {
    const { data, error } = await supabase
      .from('project_main_characteristics')
      .select('*')
      .eq('project_slug', slug)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching project characteristics:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchProjectCharacteristics:', error);
    return [];
  }
}

/**
 * Get the appropriate localized value based on the current language
 * @param item The characteristic object
 * @param field The field to get localized value for (e.g., 'label', 'value')
 * @param language The current language code ('en', 'ru', 'uz')
 * @returns The localized value or the default value
 */
export function getLocalizedCharacteristicField(
  item: ProjectCharacteristic,
  field: 'label' | 'value',
  language: string
): string {
  const languageField = `${field}_${language}` as keyof ProjectCharacteristic;
  const value = item[languageField];
  
  // If the localized field exists and is not empty, use it
  if (value && typeof value === 'string') {
    return value;
  }
  
  // Otherwise, fall back to the default field
  return item[field];
}
