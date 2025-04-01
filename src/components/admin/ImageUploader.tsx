
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  defaultImage, 
  className 
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | undefined>(defaultImage);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой. Максимальный размер: 5 МБ');
      toast({
        title: "Ошибка загрузки",
        description: "Файл слишком большой. Максимальный размер: 5 МБ",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      toast({
        title: "Ошибка загрузки",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setSuccess(false);
    
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading to bucket: images');
      
      // Upload file to Supabase storage with public bucket policy
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        setError(`Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`);
        toast({
          title: "Ошибка загрузки",
          description: error.message || "Не удалось загрузить изображение",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      // Manually set progress to 100 since we can't track it
      setUploadProgress(100);
      
      // Get the public URL of the uploaded file
      const publicUrl = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl;
      console.log('Image uploaded successfully, URL:', publicUrl);
      
      // Pass the URL to the parent component
      onImageUploaded(publicUrl);
      setSuccess(true);
      toast({
        title: "Изображение загружено",
        description: "Файл успешно загружен",
      });
    } catch (error: any) {
      console.error('Exception during image upload:', error);
      setError(`Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewImage(undefined);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {previewImage ? (
        <div className="relative group">
          <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-700">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Ошибка+загрузки';
              }}
            />
          </div>
          
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Upload status */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
              <span className="text-white text-sm">{uploadProgress}%</span>
            </div>
          )}
          
          {/* Success icon */}
          {success && !isUploading && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full h-6 w-6 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClickUpload}
          className="w-full h-32 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-700/50 hover:bg-slate-700"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mb-2" />
              <span className="text-sm text-muted-foreground">Загрузка... {uploadProgress}%</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Нажмите для загрузки изображения</span>
            </>
          )}
        </Button>
      )}
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
