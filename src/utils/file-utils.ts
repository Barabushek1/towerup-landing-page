
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucketName The bucket name to upload to
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, bucketName: string = 'documents'): Promise<string> => {
  try {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check if bucket exists and create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.find(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public
      });
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param bucketName The bucket name to upload to
 * @returns Array of URLs of the uploaded files
 */
export const uploadMultipleFiles = async (files: File[], bucketName: string = 'documents'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, bucketName));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};
