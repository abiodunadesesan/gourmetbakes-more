-- Gourmet Bakes & More — e-commerce core tables
-- Run this entire script in Supabase: Dashboard → SQL Editor → New query → Run
-- Fixes PostgREST PGRST205: Could not find the table 'public.orders'
--
-- Requires: empty project OR no conflicting `products` / `orders` definitions.
-- Product IDs are TEXT ('1'..'6') to match the app’s mock catalog and cart.

-- ── updated_at helper (shared with gift/recipe migrations) ─────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── products ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  product_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  image_gallery JSONB DEFAULT '[]'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  ingredients TEXT,
  shelf_life TEXT,
  allergen_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ── orders (guest-friendly: user_id optional) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID,
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'
    )),
  total_amount NUMERIC NOT NULL,
  subtotal_amount NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_notes TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ── order_items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (order_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products (product_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- ── order_status_history ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_status_history (
  status_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (order_id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history (order_id);

-- ── notification_preferences ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  notification_pref_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (order_id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  notify_via_whatsapp BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (order_id)
);

DROP TRIGGER IF EXISTS trigger_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER trigger_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ── Row Level Security (anon can read products; service role bypasses RLS) ─
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (true);

-- No default policies on orders / items (API uses service role).

-- ── Seed catalog (same IDs as src/lib/mockProducts.ts) ─────────────────────
INSERT INTO public.products (
  product_id, name, description, short_description, price, category, image_url, image_gallery,
  stock_quantity, is_available, is_featured, rating, review_count, ingredients, shelf_life
) VALUES
(
  '1',
  'Artisanal Meat Pie',
  'Our signature flaky pastry filled with seasoned minced beef, potatoes, and carrots. A true taste of Lagos.',
  'Golden flaky crust with savory beef filling.',
  1500, 'Meat Pies',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
  '["https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  50, TRUE, TRUE, 4.8, 24,
  'Beef, Flour, Butter, Potatoes, Carrots, Onions, Spices', '2-3 days refrigerated'
),
(
  '2',
  'Premium Agege Bread',
  'Extra soft, stretchy, and slightly sweet traditional Nigerian white bread. Baked fresh every morning.',
  'Traditional soft & stretchy Nigerian white bread.',
  800, 'Agege Bread',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  100, TRUE, TRUE, 4.9, 56, NULL, NULL
),
(
  '3',
  'Red Velvet Celebration Cake',
  'Rich cocoa-infused red velvet sponge with layers of silky cream cheese frosting.',
  'Rich red velvet with premium cream cheese frosting.',
  15000, 'Cakes',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
  '["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  10, TRUE, TRUE, 4.7, 15, NULL, NULL
),
(
  '4',
  'Spicy Fish Pie',
  'Crispy pastry filled with flaked white fish, peppers, and traditional spices.',
  'Savory fish filling with a hint of Nigerian spice.',
  1200, 'Fish Pies',
  'https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  40, TRUE, TRUE, 4.5, 12, NULL, NULL
),
(
  '5',
  'Gourmet Chin Chin',
  'Crunchy, bite-sized fried dough snacks flavored with nutmeg and vanilla.',
  'Classic crunchy Nigerian snack with nutmeg notes.',
  2500, 'Snacks',
  'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  30, TRUE, TRUE, 4.8, 31, NULL, NULL
),
(
  '6',
  'Golden Puff Puff',
  'Sweet, deep-fried dough balls. Soft, airy, and dangerously addictive.',
  'Soft, airy fried dough balls - a street food favorite.',
  1000, 'Snacks',
  'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  60, TRUE, FALSE, 4.9, 120, NULL, NULL
)
ON CONFLICT (product_id) DO NOTHING;

-- ── contact_messages (contact page form) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  contact_message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);

DROP TRIGGER IF EXISTS trigger_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER trigger_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
