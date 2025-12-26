-- DEPRECATED: phone_otp table migration. Phone OTP verification flow removed.
-- If you previously applied this migration and want to remove the phone_otp table,
-- create a new migration to drop the table. This file is retained for history.

/*
CREATE TABLE IF NOT EXISTS public.phone_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  otp TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS phone_otp_phone_idx ON public.phone_otp(phone);
CREATE INDEX IF NOT EXISTS phone_otp_expires_at_idx ON public.phone_otp(expires_at);

ALTER TABLE public.phone_otp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert OTP"
  ON public.phone_otp FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own OTP"
  ON public.phone_otp FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can delete expired OTP"
  ON public.phone_otp FOR DELETE
  USING (expires_at < now());
*/
