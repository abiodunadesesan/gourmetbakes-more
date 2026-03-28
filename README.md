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

### Email (Resend) & shop WhatsApp alerts

With [Resend](https://resend.com) configured (`RESEND_API_KEY` + `INBOUND_FORM_EMAIL`), **you receive email** for:

- Contact, catering, bulk order, and gift inquiry submissions
- **Each new checkout order** placed via Menu → cart → checkout (`POST /api/orders`)

With **Twilio WhatsApp** configured (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `WHATSAPP_BUSINESS_PHONE`, and `ADMIN_PHONE` for **your** inbox number), **you receive WhatsApp** for the same events (plus existing customer-facing confirmations where already implemented).

| Variable | Description |
| -------- | ----------- |
| `RESEND_API_KEY` | API key from Resend dashboard |
| `INBOUND_FORM_EMAIL` | Your email address (receives form + **new order** notifications) |
| `RESEND_FROM_EMAIL` | Optional. Verified sender, e.g. `Gourmet Bakes <hello@yourdomain.com>`. If omitted, uses Resend’s test sender (`onboarding@resend.dev`), which only works for limited testing until you add a domain. |
| `ADMIN_PHONE` | Your WhatsApp number for **shop** alerts (E.164 or Nigerian local starting with `0`); same Twilio setup as customer WhatsApp |

**Noupe:** The embed script does **not** talk to this codebase by default. You can still get **Resend** notifications for chat in two ways:

1. **Noupe dashboard** — If Noupe lets you set a notification email, use the same address as `INBOUND_FORM_EMAIL` so chat summaries land in the same inbox as forms and orders (no extra code).
2. **Webhook** — If Noupe (or Zapier/Make connected to Noupe) can `POST` JSON to your site, use `POST /api/integrations/noupe-chat` with `NOUPE_CHAT_WEBHOOK_SECRET`; see **Noupe + Resend (webhook)** below.

See `.env.example` for a template.

### Noupe AI chatbot (optional)

[Noupe](https://www.noupe.com/) trains an AI assistant on your **public website pages** and adds a support widget.

**Production site to train:** [https://gourmetbakes.vercel.app](https://gourmetbakes.vercel.app) — in Noupe use **Train**, paste that URL (not `localhost`), run training, then **Get Your Code**.

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `NEXT_PUBLIC_NOUPE_SCRIPT_URL` | Vercel env + `.env.local` for dev | The `src` URL from Noupe’s embed snippet |
| `NEXT_PUBLIC_NOUPE_WIDGET_ID` | Same | Optional; only if your snippet uses a separate widget ID |
| `NOUPE_CHAT_WEBHOOK_SECRET` | API (server) only | Long random string; required to accept `POST /api/integrations/noupe-chat` |

On **Vercel**: Project → **Settings** → **Environment Variables** → add the variables for **Production** (and Preview if you want), then **Redeploy**. Without this, the widget only works where `.env.local` is present.

Embed guides: [noupe.com/embed-guide](https://www.noupe.com/embed-guide). The widget is loaded from `src/components/NoupeChatbot.tsx` in the root layout.

#### Noupe + Resend (webhook)

Noupe’s public docs do not guarantee a server **webhook** for every account. If yours does (or you use an automation tool that forwards transcripts), point it at:

`https://<your-production-domain>/api/integrations/noupe-chat`

**Headers (choose one):**

- `Authorization: Bearer <NOUPE_CHAT_WEBHOOK_SECRET>`, or
- `x-noupe-webhook-secret: <NOUPE_CHAT_WEBHOOK_SECRET>`

**JSON body (at least one of `text`, `plainText`, or `messages`):**

| Field | Required | Description |
| ----- | -------- | ----------- |
| `text` or `plainText` | * | Plain transcript |
| `messages` | * | Array of `{ "role": "user", "content": "..." }` (and/or assistant turns); combined into plain text |
| `subject` | | Overrides default `[Noupe chat] Conversation transcript` |
| `sessionId`, `visitorEmail`, `visitorName`, `pageUrl` | | Shown above the transcript in the email |
| `metadata` | | Any JSON object, appended for debugging |

The route sends mail with the same Resend settings as form notifications (`RESEND_API_KEY`, `INBOUND_FORM_EMAIL`, optional `RESEND_FROM_EMAIL`). If Resend is not configured, the handler returns an error response.

#### Orders vs chat (Noupe widget limits)

The Noupe embed **does not** send chat to your checkout, Supabase orders, or Resend email. The bot’s replies come from **Noupe’s product** and what it learned when you **Train** on your URL—not from a custom “system prompt” in this repo. Many Noupe accounts **do not** expose a dashboard field for custom AI instructions; if yours doesn’t, you cannot paste a prompt there.

**What you can do:**

1. **On-site notice** — When Noupe is enabled, the app shows a small dismissible `NoupeOrderHint` near the chat, telling visitors to use **Menu** and checkout for real orders.
2. **Training** — Make sure your **live** site clearly says that orders are placed via Menu → cart → checkout. In Noupe, run **Train** again on your production URL so crawled content reinforces that.
3. **Ask Noupe** — Contact [Noupe support](https://www.noupe.com/) and ask whether they can adjust your bot’s behavior (e.g. not confirming orders from chat only). If they accept written guidelines, you can send something like:

```text
You are Sophie, a friendly assistant for GourmetBakes & More.

ORDERS AND CHECKOUT (CRITICAL):
- You cannot place orders, take payment, or confirm that the kitchen or email system received an order.
- This chat is NOT connected to the website checkout, database, or notification emails.
- Never say an order is "confirmed," "processing," "on the way," or "we will deliver" based only on what the user typed in this chat.
- If the user wants to order, tell them clearly: add items on the website Menu, open the cart, and complete checkout there. Link to the Menu: https://gourmetbakes.vercel.app/menu (replace with your production domain if different).
- You may help with product questions, delivery areas, bulk/catering info, and how to use the site.

Keep replies concise and warm.
```

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
