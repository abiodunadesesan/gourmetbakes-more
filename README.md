# GourmetBakes & More

Premium Nigerian bakery e-commerce platform — Meat Pies, Agege Bread, Cakes and more, delivered fresh.

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript                  |
| Database  | Supabase (PostgreSQL)       |
| Styling   | Tailwind CSS v4             |
| Icons     | Lucide React                |

## Prerequisites

- **Node.js 18+**
- **npm** (ships with Node)
- A free [Supabase](https://supabase.com) project

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in your Supabase keys
cp .env.example .env.local
#    Edit .env.local with values from Supabase Dashboard → Settings → API

# 3. Initialize the database
#    Run the SQL script below in Supabase SQL Editor

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Environment Variables

| Variable                        | Where Used   | Description            |
| ------------------------------- | ------------ | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client + API | Supabase project URL   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client       | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY`     | API (server) | Supabase service role key |

## Database Setup

Run the following in the **Supabase SQL Editor** to create all tables, indexes, triggers, and RLS policies:

<details>
<summary>Click to expand SQL initialization script</summary>

```sql
-- ── Tables ───────────────────────────────────────────────────
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  order_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','ready','delivered','cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row-Level Security ───────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

CREATE POLICY "users_self_read" ON users
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "orders_user_read" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "order_items_user_read" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id
      AND auth.uid()::text = orders.user_id::text
    )
  );
```

</details>

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (Navbar + Footer)
│   ├── page.tsx              # Landing page with status cards
│   ├── globals.css           # Global styles
│   ├── api/health/route.ts   # Health check endpoint
│   └── (auth)/login/page.tsx # Auth placeholder
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx              # Premium hero (for future use)
│   ├── AboutSection.tsx      # About section (for future use)
│   ├── FeaturedProducts.tsx  # Product showcase (for future use)
│   └── CTA.tsx               # Call-to-action (for future use)
├── lib/
│   ├── supabase.ts           # Browser + server Supabase clients
│   └── utils.ts              # cn(), formatCurrency(), formatDate()
└── types/
    └── index.ts              # Full database schema types
```

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Production build           |
| `npm run start` | Start production server    |
| `npm run lint`  | Run ESLint                 |

## Deployment

Recommended: **Vercel** — push to Git and connect your repo. Set environment variables in the Vercel dashboard.
