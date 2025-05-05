
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImage?: string;
  className?: string;
  multiple?: boolean;
  images?: string[];
  onImagesUpdated?: (urls: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  defaultImage,
  className,
  multiple = false,
  images = [],
  onImagesUpdated
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage || '');
  const [imageUrls, setImageUrls] = useState<string[]>(images || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(!!defaultImage || images.length > 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultImage && defaultImage !== imageUrl) {
      setImageUrl(defaultImage);
      setPreviewMode(true);
    }
    
    if (multiple && images && JSON.stringify(images) !== JSON.stringify(imageUrls)) {
      setImageUrls(images);
      setPreviewMode(images.length > 0);
    }
  }, [defaultImage, images]);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      setUploading(true);

      // Check for a reasonable image size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер 5MB.');
        setUploading(false);
        return;
      }

      // Use FileReader for direct data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log('Image uploaded successfully');
        
        if (multiple) {
          const newUrls = [...imageUrls, dataUrl];
          setImageUrls(newUrls);
          if (onImagesUpdated) onImagesUpdated(newUrls);
        } else {
          setImageUrl(dataUrl);
          onImageUploaded(dataUrl);
        }
        
        setPreviewMode(true);
        setUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        setError('Ошибка при чтении файла');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Ошибка при загрузке изображения');
      setUploading(false);
    }
  }

  function handleRemoveImage() {
    setImageUrl('');
    setPreviewMode(false);
    onImageUploaded(''); // Clear the image from the parent component
  }

  function handleRemoveMultipleImage(index: number) {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    if (onImagesUpdated) onImagesUpdated(newUrls);
  }

  // For single image upload
  if (!multiple) {
    return (
      <div className={cn("w-full", className)}>
        {previewMode && imageUrl ? (
          <div className="relative">
            <div className="aspect-video w-full h-48 rounded-md overflow-hidden bg-slate-700">
              <img 
                src={imageUrl}
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/640x360?text=Ошибка+загрузки';
                }}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(false)}
              className="mt-2"
              type="button"
            >
              Изменить изображение
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-600 rounded-md bg-slate-800/50">
            <label className="w-full cursor-pointer">
              <div className="flex flex-col items-center justify-center py-6">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-400">Нажмите для загрузки изображения</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF до 5MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </label>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // For multiple image upload
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-slate-700">
            <img 
              src={url}
              alt={`Preview ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/640x360?text=Ошибка+загрузки';
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveMultipleImage(index)}
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 hover:opacity-100"
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {/* Add new image button */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-md bg-slate-800/50 aspect-video">
          <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <>
                <Plus className="h-8 w-8 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400 text-center px-2">Добавить изображение</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
