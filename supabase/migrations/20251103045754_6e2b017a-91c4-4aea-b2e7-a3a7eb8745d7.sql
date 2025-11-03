-- First, clear existing cities
DELETE FROM cities;

-- Zone 1: DG Khan (₨500)
INSERT INTO cities (name, province, shipping_zone) VALUES 
('DG Khan', 'Punjab', 1);

-- Zone 2: Nearby cities (₨800)
INSERT INTO cities (name, province, shipping_zone) VALUES 
('Multan', 'Punjab', 2),
('Muzaffargarh', 'Punjab', 2),
('Layyah', 'Punjab', 2),
('Rajanpur', 'Punjab', 2),
('Kot Addu', 'Punjab', 2);

-- Zone 3: Major Punjab cities (₨1500)
INSERT INTO cities (name, province, shipping_zone) VALUES 
('Lahore', 'Punjab', 3),
('Faisalabad', 'Punjab', 3),
('Bahawalpur', 'Punjab', 3),
('Sahiwal', 'Punjab', 3),
('Sargodha', 'Punjab', 3),
('Rawalpindi', 'Punjab', 3),
('Gujranwala', 'Punjab', 3),
('Sialkot', 'Punjab', 3),
('Jhang', 'Punjab', 3),
('Rahim Yar Khan', 'Punjab', 3);

-- Zone 4: Other provincial capitals (₨2000)
INSERT INTO cities (name, province, shipping_zone) VALUES 
('Karachi', 'Sindh', 4),
('Hyderabad', 'Sindh', 4),
('Sukkur', 'Sindh', 4),
('Peshawar', 'KPK', 4),
('Mardan', 'KPK', 4),
('Abbottabad', 'KPK', 4),
('Quetta', 'Balochistan', 4);

-- Zone 5: Remote areas (₨3000-10000)
INSERT INTO cities (name, province, shipping_zone) VALUES 
('Gilgit', 'Gilgit-Baltistan', 5),
('Skardu', 'Gilgit-Baltistan', 5),
('Chitral', 'KPK', 5),
('Hunza', 'Gilgit-Baltistan', 5);

-- Update the calculate_shipping function to use zone-based pricing
CREATE OR REPLACE FUNCTION calculate_shipping(p_city_id uuid, p_order_total numeric)
RETURNS TABLE(shipping_cost numeric, delivery_days integer) AS $$
DECLARE
  v_zone integer;
  v_cost numeric;
  v_days integer;
BEGIN
  -- Get the shipping zone for the city
  SELECT shipping_zone INTO v_zone FROM cities WHERE id = p_city_id;
  
  -- Check for free shipping (orders >= 100,000 PKR)
  IF p_order_total >= 100000 THEN
    v_cost := 0;
  ELSE
    -- Calculate cost based on zone
    CASE v_zone
      WHEN 1 THEN v_cost := 500;   -- DG Khan
      WHEN 2 THEN v_cost := 800;   -- Nearby cities
      WHEN 3 THEN v_cost := 1500;  -- Major Punjab cities
      WHEN 4 THEN v_cost := 2000;  -- Other provincial capitals
      WHEN 5 THEN v_cost := 3000;  -- Remote areas (base cost)
      ELSE v_cost := 1500;         -- Default
    END CASE;
  END IF;
  
  -- Calculate delivery days based on zone
  CASE v_zone
    WHEN 1 THEN v_days := 2;      -- DG Khan
    WHEN 2 THEN v_days := 3;      -- Nearby cities
    WHEN 3 THEN v_days := 4;      -- Major Punjab cities
    WHEN 4 THEN v_days := 5;      -- Provincial capitals
    WHEN 5 THEN v_days := 7;      -- Remote areas
    ELSE v_days := 4;             -- Default
  END CASE;
  
  RETURN QUERY SELECT v_cost, v_days;
END;
$$ LANGUAGE plpgsql;