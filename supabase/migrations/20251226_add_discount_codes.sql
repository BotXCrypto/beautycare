-- Create discount_codes table to store active discount codes
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  min_order_value DECIMAL(10, 2),
  max_discount_amount DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS discount_codes_code_idx ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS discount_codes_active_idx ON public.discount_codes(active);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active codes
CREATE POLICY "Anyone can view active discount codes"
  ON public.discount_codes FOR SELECT
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admin-only insert/update/delete
CREATE POLICY "Admins can manage discount codes"
  ON public.discount_codes FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins can update discount codes"
  ON public.discount_codes FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated');
