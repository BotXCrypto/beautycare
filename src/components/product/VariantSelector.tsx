import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface Variant {
  id: string;
  variant_type: string;
  variant_name: string;
  variant_value?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  is_active: boolean;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export const VariantSelector = ({ variants, selectedVariant, onSelect }: VariantSelectorProps) => {
  const { formatPrice } = useCurrency();
  
  // Group variants by type
  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.variant_type]) {
      acc[variant.variant_type] = [];
    }
    acc[variant.variant_type].push(variant);
    return acc;
  }, {} as Record<string, Variant[]>);

  const typeLabels: Record<string, string> = {
    color: 'Color',
    type: 'Type',
    size: 'Size',
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock <= 5) return { label: `Only ${stock} left`, variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedVariants).map(([type, typeVariants]) => (
        <div key={type} className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">
            Select {typeLabels[type] || type}:
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {typeVariants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = variant.stock === 0;
              const stockStatus = getStockStatus(variant.stock);

              if (type === 'color' && variant.variant_value?.startsWith('#')) {
                // Color swatch
                return (
                  <button
                    key={variant.id}
                    disabled={isOutOfStock}
                    onClick={() => onSelect(variant)}
                    className={cn(
                      'relative w-12 h-12 rounded-full border-2 transition-all',
                      isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border',
                      isOutOfStock && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: variant.variant_value }}
                    title={`${variant.variant_name} - ${formatPrice(variant.price)}`}
                  >
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-destructive rotate-45" />
                      </div>
                    )}
                  </button>
                );
              }

              // Regular variant button with image or text
              return (
                <button
                  key={variant.id}
                  disabled={isOutOfStock}
                  onClick={() => onSelect(variant)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all min-w-[80px]',
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                    isOutOfStock && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {variant.image_url && (
                    <img
                      src={variant.image_url}
                      alt={variant.variant_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <span className="text-sm font-medium">{variant.variant_name}</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(variant.price)}</span>
                  {isOutOfStock && (
                    <Badge variant="destructive" className="text-xs">
                      Sold Out
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedVariant && (
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Selected:</span>
            <Badge variant="outline">{selectedVariant.variant_name}</Badge>
            <Badge variant={getStockStatus(selectedVariant.stock).variant}>
              {getStockStatus(selectedVariant.stock).label}
            </Badge>
          </div>
          {selectedVariant.image_url && (
            <img
              src={selectedVariant.image_url}
              alt={selectedVariant.variant_name}
              className="w-20 h-20 object-cover rounded border"
            />
          )}
        </div>
      )}
    </div>
  );
};
