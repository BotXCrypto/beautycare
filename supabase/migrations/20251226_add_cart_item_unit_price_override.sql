-- Add unit_price_override to cart_items to support bundle discounts
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS unit_price_override DECIMAL(10,2);

-- No RLS changes required; existing policies allow the owner to insert/update their cart items
