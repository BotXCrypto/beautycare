import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductImage {
  image_url: string;
  display_order: number;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export const ProductImageManager = ({ images, onChange }: ProductImageManagerProps) => {
  const [uploading, setUploading] = useState(false);

  const addImages = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return {
          image_url: publicUrl,
          display_order: images.length + index,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onChange([...images, ...newImages]);
      toast({ 
        title: "Images uploaded successfully",
        description: `${newImages.length} image(s) added`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, display_order: i }));
    onChange(updatedImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      display_order: i,
    }));
    
    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-images">Product Images</Label>
        <Input
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) addImages(files);
            e.target.value = '';
          }}
          disabled={uploading}
        />
        {uploading && (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            {images.length} image{images.length !== 1 ? 's' : ''} added
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-muted border">
                  <img
                    src={image.image_url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1 right-1 flex gap-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => moveImage(index, 'up')}
                    >
                      ↑
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => moveImage(index, 'down')}
                    >
                      ↓
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="absolute bottom-1 left-1 bg-background/80 px-2 py-0.5 rounded text-xs">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
