-- 1. Create admin_settings table for feature toggles and configurations
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage admin settings"
  ON public.admin_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can read admin settings"
    ON public.admin_settings FOR SELECT
    USING (auth.role() = 'authenticated');


-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_admin_settings_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_admin_settings_update
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_settings_update();

-- Insert initial settings for the Dice Roll feature
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('dice_discount_enabled', 'false'::jsonb, 'Enable or disable the 3D Dice Roll discount feature.'),
  ('dice_max_discount_percentage', '15'::jsonb, 'Maximum possible discount percentage from the dice roll.'),
  ('dice_allowed_pages', '["cart"]'::jsonb, 'Pages where the dice roll feature is allowed, e.g., ["cart", "checkout"].'),
  ('dice_reward_map', '{
    "2": {"type": "free_shipping", "value": 0, "label": "Free Shipping"},
    "3": {"type": "free_shipping", "value": 0, "label": "Free Shipping"},
    "4": {"type": "free_shipping", "value": 0, "label": "Free Shipping"},
    "5": {"type": "percentage", "value": 5, "label": "5% Discount"},
    "6": {"type": "percentage", "value": 5, "label": "5% Discount"},
    "7": {"type": "percentage", "value": 7, "label": "7% Discount"},
    "8": {"type": "percentage", "value": 7, "label": "7% Discount"},
    "9": {"type": "percentage", "value": 10, "label": "10% Discount"},
    "10": {"type": "percentage", "value": 10, "label": "10% Discount"},
    "11": {"type": "free_gift", "value": null, "label": "Free Gift"},
    "12": {"type": "percentage", "value": 12, "label": "12% Discount"}
  }'::jsonb, 'Mapping of dice roll totals to rewards.');


-- 2. Create dice_roll_attempts table to prevent abuse
CREATE TABLE IF NOT EXISTS public.dice_roll_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dice_total INT NOT NULL,
  reward_type TEXT NOT NULL,
  reward_value JSONB,
  reward_label TEXT,
  applied_to_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS dice_roll_attempts_user_id_idx ON public.dice_roll_attempts(user_id);

-- RLS for dice_roll_attempts
ALTER TABLE public.dice_roll_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own dice roll attempts"
  ON public.dice_roll_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all dice roll attempts"
    ON public.dice_roll_attempts FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));


-- 3. Add dice roll tracking columns to the orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS dice_rolled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS dice_result INT,
  ADD COLUMN IF NOT EXISTS applied_reward JSONB;
