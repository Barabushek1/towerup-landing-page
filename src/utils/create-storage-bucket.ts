
import { supabase } from '@/integrations/supabase/client';

export async function createStorageBucket() {
  const { error } = await supabase.storage.createBucket('public', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });
  
  if (error) {
    console.warn('Error creating bucket (may already exist):', error);
    return false;
  }
  
  console.log('Storage bucket created successfully');
  return true;
}

// Call this function in your app initialization if needed
// Usually this is done once by an admin during setup
