-- FurEase India Supabase setup
-- Run this script in Supabase SQL Editor. It keeps the existing public.orders schema intact.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  mobile_number text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  payment_method text not null default 'Cash on Delivery',
  total_amount numeric(10,2) not null default 0 check (total_amount >= 0),
  status text not null default 'New',
  order_date timestamptz not null default now()
);

alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists mobile_number text;
alter table public.orders add column if not exists address text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists pincode text;
alter table public.orders add column if not exists product_name text;
alter table public.orders add column if not exists quantity integer default 1;
alter table public.orders add column if not exists payment_method text default 'Cash on Delivery';
alter table public.orders add column if not exists total_amount numeric(10,2) default 0;
alter table public.orders add column if not exists status text default 'New';
alter table public.orders add column if not exists order_date timestamptz default now();

alter table public.orders alter column customer_name set not null;
alter table public.orders alter column mobile_number set not null;
alter table public.orders alter column address set not null;
alter table public.orders alter column city set not null;
alter table public.orders alter column state set not null;
alter table public.orders alter column pincode set not null;
alter table public.orders alter column product_name set not null;
alter table public.orders alter column quantity set default 1;
alter table public.orders alter column quantity set not null;
alter table public.orders alter column payment_method set default 'Cash on Delivery';
alter table public.orders alter column payment_method set not null;
alter table public.orders alter column total_amount set default 0;
alter table public.orders alter column total_amount set not null;
alter table public.orders alter column status set default 'New';
alter table public.orders alter column status set not null;
alter table public.orders alter column order_date set default now();
alter table public.orders alter column order_date set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_quantity_positive' and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders add constraint orders_quantity_positive check (quantity > 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_total_amount_non_negative' and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders add constraint orders_total_amount_non_negative check (total_amount >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_status_allowed' and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders add constraint orders_status_allowed
      check (status in ('New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')) not valid;
  end if;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  image_url text,
  category text,
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_price_non_negative' and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_price_non_negative check (price >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'products_original_price_non_negative' and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_original_price_non_negative check (original_price is null or original_price >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'products_stock_non_negative' and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_stock_non_negative check (stock >= 0) not valid;
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create index if not exists orders_order_date_idx on public.orders (order_date desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_mobile_number_idx on public.orders (mobile_number);
create index if not exists orders_city_idx on public.orders (city);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.orders enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can insert COD orders" on public.orders;
drop policy if exists "Authenticated admins can select orders" on public.orders;
drop policy if exists "Authenticated admins can update orders" on public.orders;
drop policy if exists "Authenticated admins can delete orders" on public.orders;

create policy "Public can insert COD orders"
on public.orders
for insert
to anon, authenticated
with check (
  customer_name <> ''
  and mobile_number <> ''
  and address <> ''
  and city <> ''
  and state <> ''
  and pincode <> ''
  and product_name <> ''
  and quantity > 0
  and total_amount >= 0
  and payment_method = 'Cash on Delivery'
  and status = 'New'
);

create policy "Authenticated admins can select orders"
on public.orders
for select
to authenticated
using (true);

create policy "Authenticated admins can update orders"
on public.orders
for update
to authenticated
using (true)
with check (status in ('New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'));

create policy "Authenticated admins can delete orders"
on public.orders
for delete
to authenticated
using (true);

drop policy if exists "Public can select active products" on public.products;
drop policy if exists "Authenticated admins can select products" on public.products;
drop policy if exists "Authenticated admins can insert products" on public.products;
drop policy if exists "Authenticated admins can update products" on public.products;
drop policy if exists "Authenticated admins can delete products" on public.products;

create policy "Public can select active products"
on public.products
for select
to anon
using (is_active = true);

create policy "Authenticated admins can select products"
on public.products
for select
to authenticated
using (true);

create policy "Authenticated admins can insert products"
on public.products
for insert
to authenticated
with check (true);

create policy "Authenticated admins can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can delete products"
on public.products
for delete
to authenticated
using (true);

insert into public.products (product_name, description, price, original_price, image_url, category, stock, is_active)
select
  'FurEase Self-Cleaning Grooming Brush',
  'Gentle everyday grooming brush for dogs and cats that removes loose fur and cleans with one push.',
  499,
  999,
  '/images/furease-brush.png',
  'Pet Grooming',
  120,
  true
where not exists (select 1 from public.products);

-- PostgREST schema cache reload command for Supabase API.
select pg_notify('pgrst', 'reload schema');