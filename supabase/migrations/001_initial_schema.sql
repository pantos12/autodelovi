-- autodelovi.sale — Initial Database Schema
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- Categories
create table if not exists categories (
  id text primary key, slug text not null unique, name text not null, name_sr text not null,
  parent_id text references categories(id), icon text, sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into categories (id,slug,name,name_sr,sort_order) values
  ('filteri','filteri','Filters','Filteri',1),('kocnice','kocnice','Brakes','Kočnice',2),
  ('amortizeri','amortizeri','Suspension','Amortizeri',3),('paljenje','paljenje','Ignition','Paljenje',4),
  ('razvod','razvod','Timing','Razvod',5),('kvacilo','kvacilo','Clutch','Kvačilo',6),
  ('hladjenje','hladjenje','Cooling','Hlađenje',7),('elektrika','elektrika','Electrical','Elektrika',8),
  ('izduvni-sistem','izduvni-sistem','Exhaust','Izduvni sistem',9),
  ('upravljac','upravljac','Steering','Upravljač',10),
  ('menjac','menjac','Transmission','Menjač',11),
  ('karoserija','karoserija','Body Parts','Karoserija',12),
  ('ostalo','ostalo','Other','Ostalo',99)
on conflict (id) do nothing;

-- Suppliers
create table if not exists suppliers (
  id text primary key, slug text not null unique, name text not null, logo_url text,
  website text, email text, phone text, city text not null default '', address text,
  description text, description_sr text, is_verified boolean not null default false,
  status text not null default 'active' check (status in ('active','inactive','pending_review')),
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  review_count int not null default 0, scrape_url text, scrape_config jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

insert into suppliers (id,slug,name,city,is_verified,status,rating,review_count,website) values
  ('autodoc-rs','autodoc-rs','Autodoc RS','Beograd',true,'active',4.7,1243,'https://www.autodoc.rs'),
  ('amortizeri-rs','amortizeri-rs','Amortizeri.rs','Novi Sad',true,'active',4.5,876,'https://www.amortizeri.rs'),
  ('auto-plus','auto-plus','Auto Plus','Niš',true,'active',4.3,412,null),
  ('delovi-net','delovi-net','Delovi.net','Beograd',false,'active',3.9,204,'https://www.delovi.net'),
  ('demo-supplier','demo-supplier','Demo Dobavljač','Beograd',true,'active',4.0,10,null)
on conflict (id) do nothing;

-- Parts
create table if not exists parts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique, name text not null, name_sr text, part_number text not null,
  oem_number text, brand text not null default '', category_id text not null references categories(id) default 'ostalo',
  description text, description_sr text,
  condition text not null default 'new' check (condition in ('new','used','refurbished')),
  status text not null default 'active' check (status in ('active','out_of_stock','discontinued','pending')),
  images text[] not null default '{}', specs jsonb not null default '{}',
  compatible_vehicles jsonb not null default '[]',
  supplier_id text not null references suppliers(id),
  price numeric(12,2) not null, price_currency text not null default 'RSD', price_eur numeric(10,2),
  stock_quantity int not null default 0, weight_kg numeric(8,3), source_url text, scraped_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (part_number, supplier_id)
);

create index if not exists idx_parts_fts on parts using gin(to_tsvector('simple', unaccent(name||' '||coalesce(brand,'')||' '||part_number)));
create index if not exists idx_parts_category on parts(category_id);
create index if not exists idx_parts_supplier on parts(supplier_id);
create index if not exists idx_parts_status on parts(status);
create index if not exists idx_parts_price on parts(price);
create index if not exists idx_parts_updated on parts(updated_at desc);
create index if not exists idx_parts_vehicles on parts using gin(compatible_vehicles);

-- Price history
create table if not exists price_history (
  id uuid primary key default uuid_generate_v4(),
  part_id uuid not null references parts(id) on delete cascade,
  supplier_id text not null references suppliers(id),
  price numeric(12,2) not null, price_eur numeric(10,2), currency text not null default 'RSD',
  source text not null default 'scrape' check (source in ('scrape','manual','api')),
  recorded_at timestamptz not null default now()
);
create index if not exists idx_price_history_part on price_history(part_id, recorded_at desc);

-- Scraping jobs
create table if not exists scraping_jobs (
  id uuid primary key default uuid_generate_v4(),
  supplier_id text not null references suppliers(id),
  status text not null default 'pending' check (status in ('pending','running','completed','failed','partial')),
  started_at timestamptz not null default now(), completed_at timestamptz,
  parts_found int not null default 0, parts_upserted int not null default 0, parts_skipped int not null default 0,
  errors text[] not null default '{}',
  triggered_by text not null default 'api' check (triggered_by in ('cron','manual','api'))
);

-- Auto-update updated_at
create or replace function update_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger parts_updated_at before update on parts for each row execute function update_updated_at();
create trigger suppliers_updated_at before update on suppliers for each row execute function update_updated_at();

-- RLS
alter table categories enable row level security;
alter table suppliers enable row level security;
alter table parts enable row level security;
alter table price_history enable row level security;
alter table scraping_jobs enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read active suppliers" on suppliers for select using (status = 'active');
create policy "Public read active parts" on parts for select using (status in ('active','out_of_stock'));
create policy "Public read price history" on price_history for select using (true);

-- Full-text search function
create or replace function search_parts(query text, category_filter text default null,
  min_price_filter numeric default null, max_price_filter numeric default null,
  in_stock_filter boolean default null, page_num int default 1, page_size int default 24)
returns table(id uuid, slug text, name text, brand text, part_number text, price numeric, price_eur numeric,
  stock_quantity int, category_id text, supplier_id text, images text[], rank real, total_count bigint)
language plpgsql as $$
declare
  offset_val int := (page_num - 1) * page_size;
  tsq tsquery;
begin
  begin tsq := to_tsquery('simple', unaccent(regexp_replace(trim(query),'\s+',':* & ','g')||':*'));
  exception when others then tsq := to_tsquery('simple','parts'); end;
  return query select p.id,p.slug,p.name,p.brand,p.part_number,p.price,p.price_eur,p.stock_quantity,
    p.category_id,p.supplier_id,p.images,
    ts_rank(to_tsvector('simple',unaccent(p.name||' '||p.brand||' '||p.part_number)),tsq) as rank,
    count(*) over() as total_count
  from parts p
  where p.status in ('active','out_of_stock')
    and to_tsvector('simple',unaccent(p.name||' '||p.brand||' '||p.part_number)) @@ tsq
    and (category_filter is null or p.category_id = category_filter)
    and (min_price_filter is null or p.price >= min_price_filter)
    and (max_price_filter is null or p.price <= max_price_filter)
    and (in_stock_filter is null or (in_stock_filter=true and p.stock_quantity>0) or in_stock_filter=false)
  order by rank desc, p.updated_at desc limit page_size offset offset_val;
end; $$;
