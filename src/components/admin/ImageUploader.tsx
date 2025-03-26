
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  defaultImage,
  className
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file (image only, max size)
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка загрузки",
        description: "Пожалуйста, выберите файл изображения",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast({
        title: "Ошибка загрузки",
        description: "Размер изображения не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create a FileReader to get a data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        onImageUploaded(reader.result);
        setIsUploading(false);
        
        // Success notification
        toast({
          title: "Изображение загружено",
          description: "Изображение успешно добавлено",
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Ошибка чтения файла",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
    
    toast({
      title: "Изображение удалено",
      description: "Изображение было удалено",
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a synthetic event to reuse the handleImageUpload logic
      const syntheticEvent = {
        target: {
          files: [file]
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleImageUpload(syntheticEvent);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {!imagePreview ? (
        <div 
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors" 
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-400 mb-2 text-center">Нажмите или перетащите изображение сюда</p>
          <p className="text-xs text-slate-500">PNG, JPG или GIF (макс. 5MB)</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-slate-600">
          <img 
            src={imagePreview} 
            alt="Предпросмотр" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={handleButtonClick}
              >
                <Upload className="h-4 w-4 mr-1" />
                Заменить
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm">Загрузка...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
