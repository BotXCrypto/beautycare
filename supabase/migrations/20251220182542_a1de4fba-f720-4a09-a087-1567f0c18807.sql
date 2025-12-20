-- Create product variants table for colors, types, etc.
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('color', 'type', 'size')),
  variant_name TEXT NOT NULL,
  variant_value TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  barcode TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active variants"
ON public.product_variants
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage variants"
ON public.product_variants
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_barcode ON public.product_variants(barcode) WHERE barcode IS NOT NULL;

-- Add low_stock_threshold to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;