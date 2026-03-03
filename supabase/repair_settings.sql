-- This script will ensure your table has all the correct columns.
-- If the table exists but is missing columns, it will add them.

DO $$ 
BEGIN
    -- Check if restaurant_settings exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'restaurant_settings') THEN
        CREATE TABLE public.restaurant_settings (
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
    ELSE
        -- Ensure all columns exist (in case an old table was present)
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS tagline TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS about_text TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS opening_hours TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS maps_embed_url TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT;
        ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS tripadvisor_url TEXT;
    END IF;
END $$;

-- Insert default row if empty
INSERT INTO public.restaurant_settings (name, tagline, address, phone, email, opening_hours)
SELECT 'D-Dion', 'Authentic Flavors. Modern Experience.', 'Shaheed Jeet Singh Marg, Block D, Qutab Institutional Area, New Delhi 110016', '+91 98765 43210', 'info@ddion.com', '12:00 PM - 3:00 AM Daily'
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_settings LIMIT 1);
