-- Add bundle_id and bundle_name to cart_items to group bundle purchases as one logical item
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS bundle_id UUID,
  ADD COLUMN IF NOT EXISTS bundle_name TEXT,
  ADD COLUMN IF NOT EXISTS bundle_discount_percentage DECIMAL(5,2);

-- No additional RLS changes needed; existing policies apply to all columns
