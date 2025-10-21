-- Add currency support tables
CREATE TABLE public.currencies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add exchange rates table
CREATE TABLE public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Add Pakistan cities table with shipping zones
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  shipping_zone INTEGER NOT NULL, -- 1-5 zones for different shipping costs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add user currency preference to profiles
ALTER TABLE public.profiles ADD COLUMN preferred_currency TEXT DEFAULT 'PKR';

-- Insert supported currencies
INSERT INTO public.currencies (code, name, symbol) VALUES
  ('PKR', 'Pakistani Rupee', '₨'),
  ('USD', 'US Dollar', '$'),
  ('EUR', 'Euro', '€'),
  ('GBP', 'British Pound', '£'),
  ('AED', 'UAE Dirham', 'د.إ'),
  ('SAR', 'Saudi Riyal', '﷼'),
  ('INR', 'Indian Rupee', '₹');

-- Insert major Pakistan cities with shipping zones
INSERT INTO public.cities (name, province, shipping_zone) VALUES
  -- Zone 1 (Major cities - lowest cost)
  ('Karachi', 'Sindh', 1),
  ('Lahore', 'Punjab', 1),
  ('Islamabad', 'Islamabad Capital Territory', 1),
  ('Rawalpindi', 'Punjab', 1),
  ('Faisalabad', 'Punjab', 1),
  
  -- Zone 2 (Secondary cities)
  ('Multan', 'Punjab', 2),
  ('Peshawar', 'Khyber Pakhtunkhwa', 2),
  ('Quetta', 'Balochistan', 2),
  ('Sialkot', 'Punjab', 2),
  ('Gujranwala', 'Punjab', 2),
  
  -- Zone 3 (Tertiary cities)
  ('Hyderabad', 'Sindh', 3),
  ('Bahawalpur', 'Punjab', 3),
  ('Sargodha', 'Punjab', 3),
  ('Sukkur', 'Sindh', 3),
  ('Larkana', 'Sindh', 3),
  
  -- Zone 4 (Remote areas)
  ('Mirpur', 'Azad Kashmir', 4),
  ('Muzaffarabad', 'Azad Kashmir', 4),
  ('Abbottabad', 'Khyber Pakhtunkhwa', 4),
  ('Mardan', 'Khyber Pakhtunkhwa', 4),
  
  -- Zone 5 (Very remote areas)
  ('Gilgit', 'Gilgit-Baltistan', 5),
  ('Skardu', 'Gilgit-Baltistan', 5),
  ('Turbat', 'Balochistan', 5),
  ('Gwadar', 'Balochistan', 5);

-- RLS Policies for currencies
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view currencies"
  ON public.currencies FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage currencies"
  ON public.currencies FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for exchange rates
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exchange rates"
  ON public.exchange_rates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exchange rates"
  ON public.exchange_rates FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage cities"
  ON public.cities FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Function to calculate shipping cost based on zones
CREATE OR REPLACE FUNCTION calculate_shipping_cost(from_zone INTEGER, to_zone INTEGER, order_total NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  zone_difference INTEGER;
  shipping_cost NUMERIC;
BEGIN
  -- Free shipping for orders above 100,000 PKR
  IF order_total >= 100000 THEN
    RETURN 0;
  END IF;
  
  -- Calculate zone difference (absolute value)
  zone_difference := ABS(from_zone - to_zone);
  
  -- Base shipping cost calculation
  -- Same zone: 500 PKR
  -- Each zone difference adds cost progressively
  CASE zone_difference
    WHEN 0 THEN shipping_cost := 500;
    WHEN 1 THEN shipping_cost := 1500;
    WHEN 2 THEN shipping_cost := 3000;
    WHEN 3 THEN shipping_cost := 5000;
    WHEN 4 THEN shipping_cost := 7500;
    ELSE shipping_cost := 10000; -- Maximum 10,000 PKR
  END CASE;
  
  RETURN shipping_cost;
END;
$$;