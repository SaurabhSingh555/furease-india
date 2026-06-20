# FurEase India

Premium COD landing page and Supabase admin panel for an Indian pet care e-commerce brand.

## Features

- React, Vite, TypeScript, Tailwind CSS v4, Supabase, Framer Motion, and Lucide icons.
- Mobile-first FurEase India landing page with premium pet-care visuals, smooth animations, trust messaging, sticky mobile CTA, product showcase, benefits, reviews, FAQ, and COD order form.
- Public products are loaded from `public.products` and only active products appear on the website.
- COD orders are inserted directly into `public.orders`; no customer login and no localStorage for orders or products.
- Admin panel uses Supabase Auth email/password login with protected dashboard, orders management, product management, and analytics.
- RLS SQL policies allow public order inserts, public active product reads, and authenticated admin access for management.

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

The app reads only these browser-safe variables:

```bash
VITE_SUPABASE_URL=https://uvovlgkleqweuomxgbwy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_y4XhHF4Y19b56KmTihFyRA_cIQPduTo
```

Do not add a Supabase secret key or `service_role` key to browser code.

## Supabase Setup

1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste and run `supabase/setup.sql`.
4. Confirm that `public.orders` and `public.products` exist.
5. Confirm RLS is enabled on both tables.

The SQL script creates the products table, keeps the existing orders schema compatible, adds indexes, status checks, RLS policies, a product `updated_at` trigger, a starter product, and the PostgREST schema reload command.

## Create Admin User

1. In Supabase, open Authentication.
2. Go to Users.
3. Click Add user.
4. Enter the admin email and password.
5. Keep this account private because any authenticated Supabase user can access the admin policies in this setup.
6. Log in at `/admin/login`.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

Useful routes:

- `/` for the public storefront.
- `/admin/login` for admin login.
- `/admin` for analytics.
- `/admin/orders` for order management.
- `/admin/products` for product management.

## Build

```bash
npm run build
```

## Deploy On Vercel

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Set environment variables from `.env.example`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add a SPA rewrite so admin routes load the app:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Deploy On Netlify

1. Push the project to GitHub.
2. Import the repo in Netlify.
3. Set environment variables from `.env.example`.
4. Build command: `npm run build`.
5. Publish directory: `dist`.
6. Add this redirect rule in Netlify settings or in a `_redirects` file:

```text
/* /index.html 200
```

## Admin Workflow

- Add new active products from `/admin/products` and they appear on the landing page automatically.
- Deactivate products to hide them from the public website without deleting them.
- Manage COD orders from `/admin/orders` with search, status filters, status updates, and deletion for test/fake orders.
- Dashboard shows total orders, revenue, order status counts, total products, and active products.