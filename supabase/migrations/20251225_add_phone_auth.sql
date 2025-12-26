-- Create phone_otp table for temporary OTP storage
CREATE TABLE IF NOT EXISTS public.phone_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  otp TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS phone_otp_phone_idx ON public.phone_otp(phone);
CREATE INDEX IF NOT EXISTS phone_otp_expires_at_idx ON public.phone_otp(expires_at);

-- Enable RLS
ALTER TABLE public.phone_otp ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signup)
CREATE POLICY "Anyone can insert OTP"
  ON public.phone_otp FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read their own OTP
CREATE POLICY "Users can read own OTP"
  ON public.phone_otp FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Cleanup policy: Allow deleting expired OTPs
CREATE POLICY "Anyone can delete expired OTP"
  ON public.phone_otp FOR DELETE
  USING (expires_at < now());
