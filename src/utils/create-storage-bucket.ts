
import { supabase } from '@/integrations/supabase/client';

export async function createStorageBucket() {
  // Check if the bucket already exists to avoid errors
  const { data: buckets } = await supabase.storage.listBuckets();
  const publicBucketExists = buckets?.some(bucket => bucket.name === 'public');
  
  if (!publicBucketExists) {
    const { error } = await supabase.storage.createBucket('public', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      console.warn('Error creating bucket:', error);
      return false;
    }
    
    console.log('Storage bucket created successfully');
  } else {
    console.log('Public bucket already exists');
  }
  return true;
}

// Call this function when the admin page loads
