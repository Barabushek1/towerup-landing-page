
import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, X, Plus, ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImage?: string;
  className?: string;
  multiple?: boolean;
  images?: string[];
  onImagesUpdated?: (urls: string[]) => void;
  children?: ReactNode;
  id?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  defaultImage,
  className,
  multiple = false,
  images = [],
  onImagesUpdated,
  children,
  id
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage || '');
  const [imageUrls, setImageUrls] = useState<string[]>(images || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(!!defaultImage || images.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (defaultImage && defaultImage !== imageUrl) {
      setImageUrl(defaultImage);
      setPreviewMode(true);
    }
    
    if (multiple && images && JSON.stringify(images) !== JSON.stringify(imageUrls)) {
      setImageUrls(images);
      setPreviewMode(images.length > 0);
    }
  }, [defaultImage, images, imageUrl, imageUrls, multiple]);

  const uploadToSupabase = useCallback(async (file: File) => {
    try {
      setError(null);

      // Check for a reasonable image size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер 5MB.');
        return null;
      }

      // Create a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const bucketName = 'documents';
      
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
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      setError('Ошибка при загрузке изображения на сервер');
      return null;
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    
    try {
      const publicUrl = await uploadToSupabase(file);
      
      if (publicUrl) {
        if (multiple) {
          const newUrls = [...imageUrls, publicUrl];
          setImageUrls(newUrls);
          if (onImagesUpdated) onImagesUpdated(newUrls);
        } else {
          setImageUrl(publicUrl);
          onImageUploaded(publicUrl);
        }
        setPreviewMode(true);
      }
    } catch (err) {
      console.error('Error in file upload:', err);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  }, [imageUrls, multiple, onImageUploaded, onImagesUpdated, uploadToSupabase]);

  const handleFilesUpload = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return;
    
    setUploading(true);
    
    try {
      if (multiple) {
        const newUrls = [...imageUrls];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            const publicUrl = await uploadToSupabase(file);
            if (publicUrl) {
              newUrls.push(publicUrl);
            }
          }
        }
        
        setImageUrls(newUrls);
        if (onImagesUpdated) onImagesUpdated(newUrls);
      } else {
        // For single file upload, just use the first file
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const publicUrl = await uploadToSupabase(file);
          if (publicUrl) {
            setImageUrl(publicUrl);
            onImageUploaded(publicUrl);
          }
        }
      }
      setPreviewMode(true);
    } catch (err) {
      console.error('Error in files upload:', err);
      toast.error('Ошибка при загрузке изображений');
    } finally {
      setUploading(false);
    }
  }, [imageUrls, multiple, onImageUploaded, onImagesUpdated, uploadToSupabase]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    if (multiple) {
      handleFilesUpload(event.target.files);
    } else {
      handleFileUpload(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    if (multiple) {
      handleFilesUpload(files);
    } else {
      handleFileUpload(files[0]);
    }
  };

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

  // Render child content with input handler attached
  if (children) {
    return (
      <div 
        className={cn("w-full", isDragging ? "opacity-70" : "", className)} 
        id={id}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="w-full cursor-pointer">
          {uploading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            children
          )}
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
            multiple={multiple}
          />
        </label>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // For single image upload
  if (!multiple) {
    return (
      <div 
        className={cn("w-full", className)} 
        id={id}
      >
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
          <div 
            className={cn(
              "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md bg-slate-800/50",
              isDragging ? "border-primary border-opacity-70" : "border-slate-600",
            )}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="w-full cursor-pointer">
              <div className="flex flex-col items-center justify-center py-6">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-400 text-center">Перетащите изображение сюда или нажмите для загрузки</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF до 5MB</p>
                  </>
                )}
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
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
    <div className={cn("w-full", className)} id={id}>
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
        
        {/* Add new image button with drag and drop */}
        <div 
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md aspect-video",
            isDragging ? "border-primary border-opacity-70 bg-slate-700/70" : "border-slate-600 bg-slate-800/50",
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <>
                {isDragging ? (
                  <ImageIcon className="h-12 w-12 text-primary mb-2" />
                ) : (
                  <Plus className="h-8 w-8 text-slate-500 mb-2" />
                )}
                <p className="text-sm text-slate-400 text-center px-2">
                  {isDragging ? "Отпустите для загрузки" : "Перетащите изображения или нажмите для выбора"}
                </p>
              </>
            )}
            <input
              id={id}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              disabled={uploading}
              className="hidden"
              multiple
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
