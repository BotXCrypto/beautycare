import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface ProductImage {
  image_url: string;
  display_order: number;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export const ProductImageManager = ({ images, onChange }: ProductImageManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    
    const newImage: ProductImage = {
      image_url: newImageUrl,
      display_order: images.length,
    };
    
    onChange([...images, newImage]);
    setNewImageUrl('');
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
        <Label>Product Images</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <Button type="button" onClick={addImage} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
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
