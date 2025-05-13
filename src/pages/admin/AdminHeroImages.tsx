
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/admin/ImageUploader';

// Interface for hero image items
interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  alt_text?: string;
}

const AdminHeroImages = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<{ image_url: string; alt_text: string }>({
    image_url: '',
    alt_text: ''
  });
  const { toast } = useToast();

  // Fetch hero images
  const fetchHeroImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast({
        title: "Error",
        description: "Failed to load hero images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Add a new hero image
  const handleAddImage = async () => {
    if (!newImage.image_url) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the highest display order
      const maxOrder = heroImages.length > 0
        ? Math.max(...heroImages.map(img => img.display_order))
        : -1;

      const { data, error } = await supabase
        .from('hero_images')
        .insert([{
          image_url: newImage.image_url,
          alt_text: newImage.alt_text || null,
          display_order: maxOrder + 1,
          is_active: true
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setHeroImages([...heroImages, ...data]);
        setNewImage({
          image_url: '',
          alt_text: ''
        });
        toast({
          title: "Success",
          description: "Hero image added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding hero image:', error);
      toast({
        title: "Error",
        description: "Failed to add hero image",
        variant: "destructive"
      });
    }
  };

  // Delete a hero image
  const handleDeleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setHeroImages(heroImages.filter(img => img.id !== id));
      toast({
        title: "Success",
        description: "Hero image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast({
        title: "Error",
        description: "Failed to delete hero image",
        variant: "destructive"
      });
    }
  };

  // Toggle hero image active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setHeroImages(heroImages.map(img => 
        img.id === id ? { ...img, is_active: !currentStatus } : img
      ));
      
      toast({
        title: "Success",
        description: `Hero image ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating hero image:', error);
      toast({
        title: "Error",
        description: "Failed to update hero image",
        variant: "destructive"
      });
    }
  };

  // Move image up in order
  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const currentImage = heroImages[index];
      const upperImage = heroImages[index - 1];
      
      // Swap display orders
      const { error: error1 } = await supabase
        .from('hero_images')
        .update({ display_order: upperImage.display_order })
        .eq('id', currentImage.id);
        
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('hero_images')
        .update({ display_order: currentImage.display_order })
        .eq('id', upperImage.id);
        
      if (error2) throw error2;
      
      // Update local state
      const newImages = [...heroImages];
      newImages[index] = { ...upperImage };
      newImages[index - 1] = { ...currentImage };
      setHeroImages(newImages);
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error updating image order:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive"
      });
    }
  };

  // Move image down in order
  const handleMoveDown = async (index: number) => {
    if (index >= heroImages.length - 1) return;
    
    try {
      const currentImage = heroImages[index];
      const lowerImage = heroImages[index + 1];
      
      // Swap display orders
      const { error: error1 } = await supabase
        .from('hero_images')
        .update({ display_order: lowerImage.display_order })
        .eq('id', currentImage.id);
        
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('hero_images')
        .update({ display_order: currentImage.display_order })
        .eq('id', lowerImage.id);
        
      if (error2) throw error2;
      
      // Update local state
      const newImages = [...heroImages];
      newImages[index] = { ...lowerImage };
      newImages[index + 1] = { ...currentImage };
      setHeroImages(newImages);
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error updating image order:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive"
      });
    }
  };

  // Handle image upload
  const handleImageUploaded = (url: string) => {
    setNewImage({ ...newImage, image_url: url });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Manage Hero Images</h1>
        
        {/* Add new image card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Hero Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                defaultImage={newImage.image_url}
              />
            </div>
            <div>
              <label htmlFor="alt-text" className="block text-sm font-medium mb-1">
                Alt Text (Optional)
              </label>
              <Input
                id="alt-text"
                value={newImage.alt_text}
                onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })}
                placeholder="Enter alternative text for the image"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAddImage} 
              disabled={!newImage.image_url}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Image
            </Button>
          </CardFooter>
        </Card>
        
        {/* List of existing images */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {heroImages.map((image, index) => (
            <Card key={image.id} className={image.is_active ? "" : "opacity-60"}>
              <div className="aspect-video w-full relative overflow-hidden">
                <img 
                  src={image.image_url} 
                  alt={image.alt_text || `Hero image ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Order: {image.display_order}
                  </span>
                  <span className={`text-sm ${image.is_active ? "text-green-500" : "text-gray-500"}`}>
                    {image.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm mt-2 truncate">
                  {image.alt_text || "No alt text provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleMoveDown(index)}
                    disabled={index === heroImages.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant={image.is_active ? "outline" : "default"} 
                    size="sm" 
                    onClick={() => handleToggleActive(image.id, image.is_active)}
                  >
                    {image.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {heroImages.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No hero images found. Add some to get started.
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8 text-gray-500">
            Loading hero images...
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHeroImages;
