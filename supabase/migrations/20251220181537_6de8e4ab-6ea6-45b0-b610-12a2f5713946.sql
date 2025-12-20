-- Create bundles table for gift sets and product combinations
CREATE TABLE public.bundles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percentage INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bundle_items table to link products to bundles
CREATE TABLE public.bundle_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bundle_id, product_id)
);

-- Enable RLS
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bundles
CREATE POLICY "Anyone can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage bundles" ON public.bundles
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for bundle_items
CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage bundle items" ON public.bundle_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample bundles
INSERT INTO public.bundles (name, description, image_url, discount_percentage) VALUES
('Complete Glow Kit', 'Everything you need for radiant, glowing skin. Includes cleanser, serum, moisturizer, and sunscreen.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 20),
('Anti-Aging Essentials', 'Turn back time with our premium anti-aging bundle featuring retinol serum and night cream.', 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=600', 15),
('Hydration Heroes', 'Deep hydration bundle with hyaluronic acid serum and gel moisturizer for plump, dewy skin.', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600', 25);

-- Link products to bundles
INSERT INTO public.bundle_items (bundle_id, product_id, quantity) 
SELECT b.id, p.id, 1 FROM public.bundles b, public.products p 
WHERE b.name = 'Complete Glow Kit' AND p.title IN ('Rose Gentle Foam Cleanser', 'Hyaluronic Acid Hydrating Serum', 'Rose Petal Night Cream', 'Lightweight Day Cream SPF 15');

INSERT INTO public.bundle_items (bundle_id, product_id, quantity) 
SELECT b.id, p.id, 1 FROM public.bundles b, public.products p 
WHERE b.name = 'Anti-Aging Essentials' AND p.title IN ('Retinol Anti-Aging Serum', 'Rose Petal Night Cream');

INSERT INTO public.bundle_items (bundle_id, product_id, quantity) 
SELECT b.id, p.id, 1 FROM public.bundles b, public.products p 
WHERE b.name = 'Hydration Heroes' AND p.title IN ('Hyaluronic Acid Hydrating Serum', 'Gel Moisturizer for Oily Skin', 'Gentle Micellar Water');