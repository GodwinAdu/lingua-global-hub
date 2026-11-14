-- Step 5: ebooks (free and paid), orders and download tokens.
-- Visitors never touch `orders` or the `ebooks` file bucket directly: the server
-- uses the secret key after checking payment, and hands out short-lived signed URLs.

create table public.ebooks (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (char_length(title) between 1 and 200),
  author           text not null default '' check (char_length(author) <= 160),
  description      text not null default '' check (char_length(description) <= 5000),
  cover_image_url  text,
  language         text not null default 'english' check (language in ('english', 'twi')),
  pages            integer check (pages is null or pages > 0),
  file_path        text,                       -- object path in the private "ebooks" bucket
  file_name        text,                       -- original name, used for the download
  file_size        bigint check (file_size is null or file_size >= 0),
  file_type        text check (file_type is null or file_type in ('application/pdf', 'application/epub+zip')),
  price_pesewas    integer not null default 0 check (price_pesewas >= 0 and price_pesewas <= 100000000),
  currency         text not null default 'GHS' check (currency in ('GHS')),
  is_published     boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.ebooks enable row level security;
grant select on public.ebooks to anon, authenticated;
grant insert, update, delete on public.ebooks to authenticated;
grant select, insert, update, delete on public.ebooks to service_role;

-- Only published books with a file are public. Admins manage everything.
create policy "Published ebooks are public"
  on public.ebooks for select
  to anon, authenticated
  using (is_published and file_path is not null);

create policy "Admins can read all ebooks"
  on public.ebooks for select to authenticated
  using ((select private.has_role('admin')));

create policy "Admins can create ebooks"
  on public.ebooks for insert to authenticated
  with check ((select private.has_role('admin')));

create policy "Admins can update ebooks"
  on public.ebooks for update to authenticated
  using ((select private.has_role('admin')))
  with check ((select private.has_role('admin')));

create policy "Admins can delete ebooks"
  on public.ebooks for delete to authenticated
  using ((select private.has_role('admin')));

create trigger ebooks_set_updated_at
  before update on public.ebooks
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Orders. Free downloads are orders with amount 0, so every download is traceable.
-- ---------------------------------------------------------------------------
create type public.order_status as enum ('pending', 'paid', 'failed');

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  ebook_id          uuid references public.ebooks (id) on delete set null,
  ebook_title       text not null,              -- kept if the ebook is later deleted
  email             text not null check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' and char_length(email) <= 254),
  amount_pesewas    integer not null check (amount_pesewas >= 0),
  currency          text not null default 'GHS',
  status            public.order_status not null default 'pending',
  reference         text not null unique,       -- Paystack transaction reference
  paystack_id       bigint,
  channel           text,                       -- card, mobile_money, ...
  download_token    text unique,                -- set when paid; secret in the download link
  downloads_used    integer not null default 0,
  download_limit    integer not null default 5,
  expires_at        timestamptz,
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);

create index orders_ebook_id_idx on public.orders (ebook_id);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_email_idx on public.orders (lower(email));

alter table public.orders enable row level security;
-- No anon access at all. Admins read; only the server (service_role) writes.
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
grant select, insert, update, delete on public.orders to service_role;

create policy "Admins can read orders"
  on public.orders for select to authenticated
  using ((select private.has_role('admin')));

-- Atomically use one download. Returns the file to sign, or nothing if the
-- token is unknown, unpaid, expired or out of downloads. Server-only.
create or replace function private.claim_download(p_token text)
returns table (file_path text, file_name text)
language sql
security definer
set search_path = ''
as $$
  with claimed as (
    update public.orders o
    set downloads_used = o.downloads_used + 1
    where o.download_token = p_token
      and o.status = 'paid'
      and (o.expires_at is null or o.expires_at > now())
      and o.downloads_used < o.download_limit
    returning o.ebook_id
  )
  select e.file_path, e.file_name
  from claimed c
  join public.ebooks e on e.id = c.ebook_id
  where e.file_path is not null
$$;

revoke execute on function private.claim_download(text) from public, anon, authenticated;
grant usage on schema private to service_role;
grant execute on function private.claim_download(text) to service_role;

-- PostgREST only exposes `public`; this thin wrapper is callable by service_role only.
create or replace function public.claim_download(p_token text)
returns table (file_path text, file_name text)
language sql
security invoker
set search_path = ''
as $$
  select * from private.claim_download(p_token)
$$;

revoke execute on function public.claim_download(text) from public, anon, authenticated;
grant execute on function public.claim_download(text) to service_role;

-- ---------------------------------------------------------------------------
-- Private bucket for the ebook files. Admins upload; nobody reads directly.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ebooks', 'ebooks', false, 52428800, array['application/pdf', 'application/epub+zip'])  -- 50 MB
on conflict (id) do nothing;

create policy "Admins can upload ebook files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'ebooks' and (select private.has_role('admin')));

create policy "Admins can view ebook files"
  on storage.objects for select to authenticated
  using (bucket_id = 'ebooks' and (select private.has_role('admin')));

create policy "Admins can replace ebook files"
  on storage.objects for update to authenticated
  using (bucket_id = 'ebooks' and (select private.has_role('admin')))
  with check (bucket_id = 'ebooks' and (select private.has_role('admin')));

create policy "Admins can delete ebook files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'ebooks' and (select private.has_role('admin')));
