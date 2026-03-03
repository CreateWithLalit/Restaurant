-- 001_initial_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: restaurant_settings
CREATE TABLE restaurant_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    tagline text,
    about_text text,
    address text,
    phone text,
    email text,
    opening_hours text,
    maps_embed_url text,
    facebook_url text,
    instagram_url text,
    tripadvisor_url text
);

-- Table 2: menu_items
CREATE TABLE menu_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text NOT NULL,
    image_url text,
    available boolean DEFAULT true,
    featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Table 3: bookings
CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_email text,
    booking_date date NOT NULL,
    booking_time text NOT NULL,
    guests integer NOT NULL,
    special_requests text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for restaurant_settings
-- Allow public read access
CREATE POLICY "Public can view restaurant settings" 
    ON restaurant_settings FOR SELECT 
    TO public 
    USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Authenticated users can update restaurant settings" 
    ON restaurant_settings FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Policies for menu_items
-- Allow public to see only available items
CREATE POLICY "Public can view available menu items" 
    ON menu_items FOR SELECT 
    TO public 
    USING (available = true);

-- Allow authenticated users full access to menu_items
CREATE POLICY "Authenticated users have full access to menu items" 
    ON menu_items FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Policies for bookings
-- Allow anyone to insert a booking
CREATE POLICY "Public can insert bookings" 
    ON bookings FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Allow authenticated users full access to bookings
CREATE POLICY "Authenticated users have full access to bookings" 
    ON bookings FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Insert default restaurant settings (placeholder)
INSERT INTO restaurant_settings (
    name,
    tagline,
    about_text,
    address,
    phone,
    email,
    opening_hours,
    maps_embed_url,
    facebook_url,
    instagram_url,
    tripadvisor_url
) VALUES (
    'Restaurant Name',
    'Amazing food, great atmosphere',
    'Welcome to our restaurant. We serve delicious meals prepared with fresh ingredients.',
    '123 Main Street, City, Country',
    '+1 234 567 890',
    'contact@restaurant.com',
    'Mon-Fri: 9am - 10pm, Sat-Sun: 10am - 11pm',
    'https://www.google.com/maps/embed?pb=...',
    'https://facebook.com/restaurant',
    'https://instagram.com/restaurant',
    'https://tripadvisor.com/restaurant'
);