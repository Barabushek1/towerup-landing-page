
import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export interface ImageUploaderProps {
  onUpload: (urls: string[]) => void; // Add onUpload prop
  label?: string;
  accept?: string;
  maxFiles?: number;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUpload, 
  label = 'Загрузить изображение', 
  accept = 'image/*', 
  maxFiles = 1,
  className 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Ошибка загрузки',
        description: error.message || 'Не удалось загрузить файл',
        variant: 'destructive',
      });
      return null;
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const filesToUpload = Array.from(files).slice(0, maxFiles);
      const totalFiles = filesToUpload.length;
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const url = await uploadFile(filesToUpload[i]);
        
        if (url) uploadedUrls.push(url);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      
      if (uploadedUrls.length > 0) {
        onUpload(uploadedUrls);
        
        toast({
          title: 'Файлы загружены',
          description: `Успешно загружено ${uploadedUrls.length} файлов`,
        });
      }
    } catch (error) {
      console.error('Error in file upload process:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 transition-colors",
          "hover:border-primary/50 hover:bg-primary/5",
          isUploading && "opacity-50 pointer-events-none"
        )}>
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <div className="text-sm font-medium">{uploadProgress}%</div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {maxFiles > 1 
                  ? `Выберите до ${maxFiles} файлов` 
                  : 'Выберите файл для загрузки'}
              </div>
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
