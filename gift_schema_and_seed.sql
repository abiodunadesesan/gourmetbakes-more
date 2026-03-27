-- Supabase Schema for Gift Concierge Section

-- 1. Create Gift Boxes Table
CREATE TABLE IF NOT EXISTS public.gift_boxes (
    gift_box_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    occasion TEXT NOT NULL CHECK (occasion IN ('Birthday', 'Anniversary', 'Homecoming', 'Corporate', 'Family Event', 'General')),
    description TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    contents JSONB NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Gift Inquiries Table
CREATE TABLE IF NOT EXISTS public.gift_inquiries (
    inquiry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL,
    occasion TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    preferred_items JSONB,
    special_requests TEXT,
    delivery_date DATE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_gift_boxes_updated_at ON public.gift_boxes;
CREATE TRIGGER trigger_gift_boxes_updated_at
BEFORE UPDATE ON public.gift_boxes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_gift_inquiries_updated_at ON public.gift_inquiries;
CREATE TRIGGER trigger_gift_inquiries_updated_at
BEFORE UPDATE ON public.gift_inquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Row Level Security Policies
ALTER TABLE public.gift_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to available gift boxes
CREATE POLICY "Enable read access for all users on available gift boxes" ON public.gift_boxes FOR SELECT USING (is_available = true);

-- Allow public insert access for inquiries
CREATE POLICY "Enable insert access for all users on inquiries" ON public.gift_inquiries FOR INSERT WITH CHECK (true);

-- Admins full access (Requires authenticated state or specific role logic depending on your auth setup)
-- CREATE POLICY "Enable all access for authenticated users" ON public.gift_inquiries FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable all access for authenticated users" ON public.gift_boxes FOR ALL USING (auth.role() = 'authenticated');

-- 5. Insert Initial Seed Data
INSERT INTO public.gift_boxes (name, occasion, description, price, image_url, contents) VALUES
(
    'Birthday Celebration Box', 
    'Birthday', 
    'The perfect sweet surprise for their special day. Packed with classic Nigerian baked favorites.', 
    4500, 
    'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Chocolate Cake", "quantity": 1, "description": "slice"}, {"item": "Meat Pie", "quantity": 2, "description": "savory pie"}, {"item": "Agege Bread", "quantity": 1, "description": "loaf"}, {"item": "Homemade Biscuits", "quantity": 1, "description": "pack"}]'::jsonb
),
(
    'Homecoming Delight', 
    'Homecoming', 
    'Welcome them back with the authentic taste of home they''ve been missing.', 
    5500, 
    'https://images.unsplash.com/photo-1512413914446-568bf50b1f28?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Vanilla Cake", "quantity": 1, "description": "slice"}, {"item": "Fish Pie", "quantity": 3, "description": "savory pie"}, {"item": "Agege Bread", "quantity": 1, "description": "loaf"}, {"item": "Snack Mix", "quantity": 1, "description": "assorted bag"}]'::jsonb
),
(
    'Anniversary Elegance', 
    'Anniversary', 
    'A premium selection of GourmetBakes treats to celebrate years of love.', 
    6500, 
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Red Velvet Cake", "quantity": 1, "description": "slice"}, {"item": "Meat Pie", "quantity": 2, "description": "savory pie"}, {"item": "Fish Pie", "quantity": 2, "description": "savory pie"}, {"item": "Premium Biscuits", "quantity": 1, "description": "tin"}]'::jsonb
),
(
    'Corporate Appreciation', 
    'Corporate', 
    'Show your appreciation to clients or employees with this impressive spread.', 
    8000, 
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Assorted Cakes", "quantity": 2, "description": "slices"}, {"item": "Meat Pie", "quantity": 4, "description": "savory pie"}, {"item": "Agege Bread", "quantity": 1, "description": "loaf"}, {"item": "Custom Branded Box", "quantity": 1, "description": "packaging"}]'::jsonb
),
(
    'Family Reunion Box', 
    'Family Event', 
    'Large assortment perfect for sharing stories and laughs around the table.', 
    7500, 
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Spice Cake", "quantity": 1, "description": "slice"}, {"item": "Meat Pie", "quantity": 3, "description": "savory pie"}, {"item": "Fish Pie", "quantity": 3, "description": "savory pie"}, {"item": "Agege Bread", "quantity": 1, "description": "loaf"}, {"item": "Snack Mix", "quantity": 1, "description": "assorted bag"}]'::jsonb
),
(
    'Snack Lover''s Box', 
    'General', 
    'A collection of our crispiest, crunchiest, and most beloved snacks.', 
    3500, 
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800', 
    '[{"item": "Assorted Biscuits", "quantity": 1, "description": "pack"}, {"item": "Meat Pie", "quantity": 1, "description": "savory pie"}, {"item": "Fish Pie", "quantity": 1, "description": "savory pie"}, {"item": "Agege Bread Slices", "quantity": 1, "description": "pack"}]'::jsonb
);
