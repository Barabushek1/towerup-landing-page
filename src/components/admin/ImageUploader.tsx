
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImage?: string;
  accept?: string;
  id?: string;
  className?: string;
  multiple?: boolean;
  images?: string[];
  onImagesUpdated?: (urls: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  defaultImage = '',
  accept = 'image/*',
  id = 'image-upload',
  className = '',
  multiple = false,
  images = [],
  onImagesUpdated
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(defaultImage);
  const [multipleImages, setMultipleImages] = useState<string[]>(images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      setUploading(true);

      if (multiple && e.target.files.length > 1) {
        // Handle multiple file upload
        const uploadedUrls: string[] = [...multipleImages];
        
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `images/${fileName}`;

          // Upload the file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('public')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            continue;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        }

        setMultipleImages(uploadedUrls);
        if (onImagesUpdated) {
          onImagesUpdated(uploadedUrls);
        }
      } else {
        // Handle single file upload
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // Create a preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload the file to Supabase storage
        const { error: uploadError, data } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        onImageUploaded(publicUrl);
        setPreviewUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMultipleImage = (index: number) => {
    const updatedImages = [...multipleImages];
    updatedImages.splice(index, 1);
    setMultipleImages(updatedImages);
    if (onImagesUpdated) {
      onImagesUpdated(updatedImages);
    }
  };

  // Render multi-image uploader
  if (multiple) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {multipleImages.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video w-full h-32 rounded-md overflow-hidden">
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=Error';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveMultipleImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-md aspect-video w-full h-32 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <p className="mt-1 text-xs text-gray-500">Добавить изображение</p>
          </div>
        </div>

        <Input
          id={id}
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          multiple
        />

        {uploading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-sm text-gray-500">Загрузка...</span>
          </div>
        )}
      </div>
    );
  }

  // Render single image uploader
  return (
    <div className={`space-y-2 ${className}`}>
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md"
            onError={() => setPreviewUrl('')}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
             onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Нажмите для загрузки изображения</p>
        </div>
      )}

      <Input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Загрузка...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
