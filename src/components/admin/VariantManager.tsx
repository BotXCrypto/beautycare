import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Variant {
  id?: string;
  variant_type: 'color' | 'type' | 'size';
  variant_name: string;
  variant_value?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  display_order: number;
  is_active: boolean;
}

interface VariantManagerProps {
  productId?: string;
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export const VariantManager = ({ productId, variants, onChange }: VariantManagerProps) => {
  const [uploading, setUploading] = useState<number | null>(null);

  const addVariant = () => {
    const newVariant: Variant = {
      variant_type: 'type',
      variant_name: '',
      variant_value: '',
      image_url: '',
      price: 0,
      original_price: undefined,
      stock: 0,
      sku: '',
      barcode: '',
      display_order: variants.length,
      is_active: true,
    };
    onChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant_${Date.now()}_${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      updateVariant(index, 'image_url', publicUrl);
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Product Variants (Colors/Types/Sizes)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-1" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No variants added. Add variants for different colors, types, or sizes with individual pricing.
        </p>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {variants.map((variant, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={variant.variant_type}
                  onValueChange={(value) => updateVariant(index, 'variant_type', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Name *</Label>
                <Input
                  className="h-9"
                  placeholder={variant.variant_type === 'color' ? 'Red, Blue...' : 'Type name'}
                  value={variant.variant_name}
                  onChange={(e) => updateVariant(index, 'variant_name', e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Value/Code</Label>
                <Input
                  className="h-9"
                  placeholder={variant.variant_type === 'color' ? '#FF0000' : 'Code'}
                  value={variant.variant_value || ''}
                  onChange={(e) => updateVariant(index, 'variant_value', e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Price (PKR) *</Label>
                <Input
                  className="h-9"
                  type="number"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Original Price</Label>
                <Input
                  className="h-9"
                  type="number"
                  value={variant.original_price || ''}
                  onChange={(e) => updateVariant(index, 'original_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Stock *</Label>
                <Input
                  className="h-9"
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">SKU</Label>
                <Input
                  className="h-9"
                  placeholder="SKU code"
                  value={variant.sku || ''}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Barcode</Label>
                <Input
                  className="h-9"
                  placeholder="Barcode"
                  value={variant.barcode || ''}
                  onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-3 space-y-1">
                <Label className="text-xs">Variant Image</Label>
                <div className="flex items-center gap-2">
                  {variant.image_url && (
                    <img
                      src={variant.image_url}
                      alt={variant.variant_name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="h-9"
                    disabled={uploading === index}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                  />
                  {uploading === index && <span className="text-xs text-muted-foreground">Uploading...</span>}
                </div>
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
