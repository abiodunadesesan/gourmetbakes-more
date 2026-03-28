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

**Checkout vs Noupe leads (two separate pipelines):**

| | |
| --- | --- |
| **Real orders (checkout)** | **Menu → cart → checkout** → **`POST /api/orders`** → **Supabase** (order rows, inventory, etc.) → shop email/WhatsApp via existing order notifications. |
| **Leads (Noupe / chat)** | **Zapier** (or Make, or any HTTP client) → **`POST /api/integrations/noupe-chat`** with `NOUPE_CHAT_WEBHOOK_SECRET` → **Resend** → `INBOUND_FORM_EMAIL`. *Optional:* browser bridge can hit the same route from the widget; still **no** Supabase order row. |

Zapier is configured **outside** this repo; the app only exposes the HTTPS endpoint and secret.

#### Making Noupe leads reach your inbox (what you configure off-site)

The backend is **ready to receive** and email leads. What is **not** in this repo is whatever **calls** `POST /api/integrations/noupe-chat` (Noupe does not push there automatically unless you wire it).

**Checklist:**

1. Set **`NOUPE_CHAT_WEBHOOK_SECRET`** on Vercel → **redeploy**.
2. **curl** production: `POST …/api/integrations/noupe-chat` with `Authorization: Bearer …` and a JSON body → **200** + email to `INBOUND_FORM_EMAIL`.
3. **Zapier, Make, or another server-side trigger** → POST the same URL with the secret (when Noupe sends email, form data, or a webhook you can parse).
4. **Map** Noupe / connector fields into the JSON body (`text` or `payload`, optional `phone`, `items`, `notes`, `externalId`, `visitorEmail`, `kind`, `source`).
5. Optionally keep the **browser bridge** (`NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY`) as a fallback.

**You do not need:** an extra Resend route, Supabase order logic for Noupe, or changes to **`POST /api/orders`** for this lead flow.

**If you wanted “Noupe creates real orders automatically”:** this setup does **not** do that. Real orders come from **Menu → cart → checkout** → **`POST /api/orders`**. Anything else would be a separate integration.

**Subjects:** Lead mail uses **`[Noupe lead] …`** (distinct from **`[Gourmet Bakes] New order …`** from checkout). Failed Resend sends return **502** and log **`[noupe-chat] Resend did not send email`** (check Vercel **Logs** and the Resend dashboard).

**Noupe:** The embed script does **not** call your API by itself. For **Resend** mail about chat, use this priority:

1. **Server-to-server (recommended)** — Set **`NOUPE_CHAT_WEBHOOK_SECRET`** (long random string, **never** exposed in client JS). Point **Zapier, Make, or any HTTP client** at `POST /api/integrations/noupe-chat` with `Authorization: Bearer …` or `x-noupe-webhook-secret` (see below). This path **does not** depend on iframe `postMessage` reaching the browser, so it is the most reliable automation option when Noupe or a connector can fire a webhook.
2. **Noupe dashboard email** — If Noupe can notify an inbox directly, use the same address as `INBOUND_FORM_EMAIL` so chat alerts sit alongside form and checkout mail (still not the same as your app’s Resend pipeline unless the Zapier path sends too).
3. **Browser bridge (fallback)** — `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY` + `postMessage` listener (see **Noupe + Resend**). Use when no server webhook is available; behavior depends on Noupe’s iframe.

See `.env.example` for a template.

### Noupe AI chatbot (optional)

[Noupe](https://www.noupe.com/) trains an AI assistant on your **public website pages** and adds a support widget.

**Production site to train:** [https://gourmetbakes.vercel.app](https://gourmetbakes.vercel.app) — in Noupe use **Train**, paste that URL (not `localhost`), run training, then **Get Your Code**.

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `NEXT_PUBLIC_NOUPE_SCRIPT_URL` | Vercel env + `.env.local` for dev | The `src` URL from Noupe’s embed snippet |
| `NEXT_PUBLIC_NOUPE_WIDGET_ID` | Same | Optional; only if your snippet uses a separate widget ID |
| `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY` | Client + API | Same long random string in server and browser bundle; enables the postMessage → Resend bridge (`src/lib/noupeBrowserBridge.ts`). Treat like a capability URL — rotate if abused. |
| `NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG` | Client | Optional. Set to `1` on a Vercel deploy to enable `[Noupe bridge]` / `[Noupe]` console logs in production for debugging; remove after investigation. |
| `NOUPE_CHAT_WEBHOOK_SECRET` | API (server) only | **Preferred** for Zapier/Make: server-only secret for `POST /api/integrations/noupe-chat` (Bearer or `x-noupe-webhook-secret`). No browser/iframe dependency. |

On **Vercel**: Project → **Settings** → **Environment Variables** → add the variables for **Production** (and Preview if you want), then **Redeploy**. Without this, the widget only works where `.env.local` is present.

Embed guides: [noupe.com/embed-guide](https://www.noupe.com/embed-guide). The widget is loaded from `src/components/NoupeChatbot.tsx` in the root layout.

#### Noupe + Resend (single API route)

All paths use **`POST /api/integrations/noupe-chat`** with Resend (`RESEND_API_KEY`, `INBOUND_FORM_EMAIL`). Configure **at least one** auth method: **`NOUPE_CHAT_WEBHOOK_SECRET`** (recommended) and/or **`NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY`** (browser bridge).

**Server-to-server (Zapier / automation):** Set `NOUPE_CHAT_WEBHOOK_SECRET` in `.env.local` and Vercel (**Production**). Your automation calls:

`https://<your-domain>/api/integrations/noupe-chat`

with either header:

- `Authorization: Bearer <NOUPE_CHAT_WEBHOOK_SECRET>`, or  
- `x-noupe-webhook-secret: <NOUPE_CHAT_WEBHOOK_SECRET>`

and a JSON body with at least one of `text`, `plainText`, `payload`, or `messages` (see table below). Map `kind: "order_intent"` from your automation when the conversation represents a sales lead. This route is **better whenever possible** because it does not rely on the chat iframe `postMessage`’ing your page.

**Browser bridge:** With `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY`, `NoupeChatbot` registers a `message` listener and sends header `x-noupe-browser-ingest-key`. Use as a fallback when no webhook can reach your server; transcripts are not guaranteed.

**Allowed iframe origins** (suffix match, intentionally strict): `*.noupe.com`, `*.jotform.com`, `*.jotfor.ms`. If Noupe posts from another host, devtools will show it under **`[Noupe bridge] postMessage seen`** (Chrome: Console → **Verbose**). Add that host in `isAllowedBridgeOrigin()` in `src/lib/noupeBrowserBridge.ts` using the same suffix style—avoid wild substring rules in production.

**Order intent:** Combined postMessage text is lowercased and punctuation-stripped, then checked against phrases like “thank you for your order”, “order submitted”, “submission complete”, “thanks for shopping”, plus combined “thank you” + “order” / “thanks” + “order”. See `detectOrderIntentFromText` / `ORDER_INTENT_PHRASES` in that file to extend wording.

Default email subjects are **`[Noupe lead] Possible chat order — …`** (when `kind` / detector suggests a lead) and **`[Noupe lead] Chat transcript`** — distinct from **`[Gourmet Bakes] New order …`** from real checkout.

**Verify it’s on (localhost):** When both `NEXT_PUBLIC_NOUPE_SCRIPT_URL` and `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY` are set, restart `npm run dev`. The bridge logs **`[Noupe bridge]`** (listener, allowed `postMessage` previews, ignored origins, debounce/flush, API response). In Network, filter `noupe-chat`. Run `window.__GB_NOUPE_BRIDGE__`: `listening: true` means the listener is attached.

**Test on production (Vercel)** —Third-party iframes and `postMessage` often behave differently from localhost (real origins, caching, env scope). Always validate on the **live** URL (e.g. [gourmetbakes.vercel.app](https://gourmetbakes.vercel.app)) as well as `npm run dev`.

1. **Environment** — In Vercel → **Settings** → **Environment Variables**, ensure **Production** has `RESEND_API_KEY`, `INBOUND_FORM_EMAIL`, and at least one of **`NOUPE_CHAT_WEBHOOK_SECRET`** (Zapier path) or **`NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY`** (browser bridge). For the widget itself, set **`NEXT_PUBLIC_NOUPE_SCRIPT_URL`**. **Preview** deployments need the same vars if you test preview URLs. **Redeploy** after changing env (especially `NEXT_PUBLIC_*`, baked in at build).
2. **Browser** — Open the production site, hard-refresh if you just deployed. Open the Noupe widget and run through a chat (especially any line that should trigger `order_intent`).
3. **Network** — DevTools → **Network** → filter `noupe-chat`. Confirm a **POST** to `https://<your-domain>/api/integrations/noupe-chat` after you interact. **200** with `{"ok":true,"emailed":true}` means Resend accepted the send; **401** / **503** usually mean missing or mismatched ingest key / server env on that deployment.
4. **Console** — On production, verbose `[Noupe bridge]` logs are **off** by default (`NODE_ENV=production`). To debug a live deploy only, set `NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG=1` for **Production**, redeploy, reproduce the flow (enable Console **Verbose** to see `postMessage seen` origins), then **remove** the flag and redeploy.
5. **Inbox** — Confirm mail at `INBOUND_FORM_EMAIL` (and spam). If Network shows 200 but no mail, check Resend dashboard / domain verification.
6. **CSP / framing** — This repo does not set a site-wide `Content-Security-Policy` on HTML responses by default. If you add one later, you must allow Noupe/Jotform script and iframe sources (and `connect-src` for your own API if you lock it down).

**What “success” means (internal / support):** For this integration, success means: a **detectable signal** (webhook payload or browser bridge) reached **`POST /api/integrations/noupe-chat`**, Resend **accepted** the send (`200` + `emailed: true`), and your team can **follow up manually**. It does **not** mean: **checkout** completed, an **`orders`** row in Supabase, **payment** captured, or the **Menu → cart** flow ran. Real orders still come only from website checkout (`POST /api/orders`).

#### Recommended verification checklist

Run in order:

1. Set **`NOUPE_CHAT_WEBHOOK_SECRET`** (and Resend vars) in `.env.local` and **Vercel** → **Production**; set **`NEXT_PUBLIC_NOUPE_*`** if you use the widget/bridge. Attach the same vars to **Preview** if you test preview URLs.
2. **Redeploy** after any `NEXT_PUBLIC_*` or server env change.
3. **Test the API** with `curl` (webhook auth): `POST` to `/api/integrations/noupe-chat` with `Authorization: Bearer <NOUPE_CHAT_WEBHOOK_SECRET>` and a JSON body (`text` or `payload`). Expect **200** and `{"ok":true,"emailed":true}` when Resend is configured.
4. **Confirm email** arrives at `INBOUND_FORM_EMAIL`.
5. Open the **live page** with the Noupe widget (production URL, not only localhost).
6. **DevTools → Console** — confirm bridge status: `window.__GB_NOUPE_BRIDGE__` (`listening: true` when ingest key + script URL are set); use `NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG=1` on a deploy if you need `[Noupe bridge]` logs on production.
7. **DevTools → Network** — filter **`noupe-chat`**. After interacting with the widget, check for a **POST** (browser path) or rely on Zapier for server path without expecting a browser POST.
8. For browser POSTs: confirm the request includes **`x-noupe-browser-ingest-key`** and the response is **2xx**; **`401`** / **`503`** point to auth or missing env on that deployment.
9. **Confirm email** again from a **real widget** session (if the bridge fires); otherwise confirm your **Zapier** test delivery.

**Reference — webhook URL:**

`https://<your-production-domain>/api/integrations/noupe-chat`

**Headers (choose one):**

- `Authorization: Bearer <NOUPE_CHAT_WEBHOOK_SECRET>`, or  
- `x-noupe-webhook-secret: <NOUPE_CHAT_WEBHOOK_SECRET>`

**JSON body (at least one of `text`, `plainText`, `payload`, or `messages`):**

| Field | Required | Description |
| ----- | -------- | ----------- |
| `text` or `plainText` | * | Plain transcript |
| `payload` | * | Object or string (used when `text` / `plainText` / `messages` are absent — good for Zapier or manual `curl` tests) |
| `source` | | Shown in the email header block (e.g. `manual-test`) |
| `messages` | * | Array of `{ "role": "user", "content": "..." }` (and/or assistant turns); combined into plain text |
| `kind` | | `order_intent` → stronger subject line (chat is still not checkout) |
| `subject` | | Overrides default subject |
| `sessionId`, `visitorEmail`, `visitorName`, `pageUrl` | | Shown above the transcript in the email |
| `phone`, `notes`, `externalId` | | Optional Zapier fields; shown in the header block |
| `items` | | Optional string or JSON; shown under **Items** |
| `metadata` | | Any JSON object, appended for debugging |

If Resend is not configured, the handler returns an error response.

#### Orders vs chat (Noupe widget limits)

Chat flows **do not** create rows in `orders` or charge checkout. The Noupe embed **does not** replace Menu → cart → checkout for real orders. The bot’s replies come from **Noupe’s product** and what it learned when you **Train** on your URL—not from a custom “system prompt” in this repo. Many Noupe accounts **do not** expose a dashboard field for custom AI instructions; if yours doesn’t, you cannot paste a prompt there.

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
