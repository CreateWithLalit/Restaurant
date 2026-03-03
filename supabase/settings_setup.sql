-- Create the restaurant_settings table
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'D-Dion',
    tagline TEXT,
    about_text TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    opening_hours TEXT,
    maps_embed_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    tripadvisor_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Handle updated_at automatically
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_settings_updated
    BEFORE UPDATE ON public.restaurant_settings
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Insert default settings row if it doesn't exist
INSERT INTO public.restaurant_settings (name, tagline, address, phone, email, opening_hours)
SELECT 'D-Dion', 'Authentic Flavors. Modern Experience.', 'Shaheed Jeet Singh Marg, Block D, Qutab Institutional Area, New Delhi 110016', '+91 98765 43210', 'info@ddion.com', '12:00 PM - 3:00 AM Daily'
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_settings LIMIT 1);

-- Enable RLS
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.restaurant_settings
    FOR SELECT USING (true);

-- Allow authenticated update access
CREATE POLICY "Allow authenticated update access" ON public.restaurant_settings
    FOR UPDATE USING (auth.role() = 'authenticated');
