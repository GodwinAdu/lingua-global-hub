-- Step 4: editable site content (services, team, portfolio, testimonials) and site settings.
-- Editors manage content; only super admins change site settings.

-- Shared policy pattern for editor-managed content tables:
--   public reads visible rows, editors read and write everything.

-- ---------------------------------------------------------------------------
-- Services: one row feeds the home-page card, the /services list and /services/<slug>.
-- ---------------------------------------------------------------------------
create table public.services (
  id                bigint generated always as identity primary key,
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon              text not null default 'Languages' check (char_length(icon) <= 40),
  title             text not null check (char_length(title) between 1 and 120),     -- "Translation Services"
  card_title        text not null default '' check (char_length(card_title) <= 80), -- "Translation" (home page)
  card_description  text not null default '' check (char_length(card_description) <= 400),
  summary           text not null default '' check (char_length(summary) <= 400),   -- /services list
  subtitle          text not null default '' check (char_length(subtitle) <= 200),
  description       text not null default '' check (char_length(description) <= 2000),
  image_url         text,
  features          text[] not null default '{}',
  stats             jsonb not null default '[]' check (jsonb_typeof(stats) = 'array'),   -- [{value,label,icon}]
  details           jsonb not null default '[]' check (jsonb_typeof(details) = 'array'), -- [{title,content}]
  sort_order        integer not null default 0,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.team_members (
  id            bigint generated always as identity primary key,
  name          text not null check (char_length(name) between 1 and 120),
  role          text not null default '' check (char_length(role) <= 120),
  bio           text not null default '' check (char_length(bio) <= 600),
  image_url     text,
  specialties   text[] not null default '{}',
  linkedin_url  text check (linkedin_url is null or linkedin_url ~ '^https://'),
  email         text check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.portfolio_items (
  id            bigint generated always as identity primary key,
  title         text not null check (char_length(title) between 1 and 160),
  category      text not null default '' check (char_length(category) <= 60),
  client        text not null default '' check (char_length(client) <= 160),
  description   text not null default '' check (char_length(description) <= 800),
  image_url     text,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.testimonials (
  id            bigint generated always as identity primary key,
  quote         text not null check (char_length(quote) between 1 and 1000),
  author        text not null check (char_length(author) between 1 and 120),
  role          text not null default '' check (char_length(role) <= 120),
  company       text not null default '' check (char_length(company) <= 160),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Grants, RLS, policies and updated_at triggers for the four content tables.
do $$
declare
  t text;
begin
  foreach t in array array['services', 'team_members', 'portfolio_items', 'testimonials'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);

    execute format($p$create policy "Published rows are public" on public.%I
      for select to anon, authenticated using (is_published)$p$, t);
    execute format($p$create policy "Editors can read all rows" on public.%I
      for select to authenticated using ((select private.has_role('editor')))$p$, t);
    execute format($p$create policy "Editors can insert" on public.%I
      for insert to authenticated with check ((select private.has_role('editor')))$p$, t);
    execute format($p$create policy "Editors can update" on public.%I
      for update to authenticated using ((select private.has_role('editor'))) with check ((select private.has_role('editor')))$p$, t);
    execute format($p$create policy "Editors can delete" on public.%I
      for delete to authenticated using ((select private.has_role('editor')))$p$, t);

    execute format('create trigger %I before update on public.%I for each row execute function private.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Site settings: a single row (id = 1). Public read, super admins write.
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id               smallint primary key default 1 check (id = 1),
  email            text not null default '' check (char_length(email) <= 254),
  phone_primary    text not null default '' check (char_length(phone_primary) <= 40),
  phone_secondary  text not null default '' check (char_length(phone_secondary) <= 40),
  whatsapp         text not null default '' check (whatsapp ~ '^[0-9]{0,15}$'),  -- digits only, e.g. 233242178378
  address          text not null default '' check (char_length(address) <= 300),
  digital_address  text not null default '' check (char_length(digital_address) <= 40),
  map_lat          double precision check (map_lat between -90 and 90),
  map_lng          double precision check (map_lng between -180 and 180),
  facebook_url     text check (facebook_url is null or facebook_url ~ '^https://'),
  twitter_url      text check (twitter_url is null or twitter_url ~ '^https://'),
  linkedin_url     text check (linkedin_url is null or linkedin_url ~ '^https://'),
  instagram_url    text check (instagram_url is null or instagram_url ~ '^https://'),
  youtube_url      text check (youtube_url is null or youtube_url ~ '^https://'),
  tiktok_url       text check (tiktok_url is null or tiktok_url ~ '^https://'),
  updated_at       timestamptz not null default now()
);

alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant select, insert, update, delete on public.site_settings to service_role;

create policy "Site settings are public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Super admins can update site settings"
  on public.site_settings for update
  to authenticated
  using ((select private.has_role('super_admin')))
  with check ((select private.has_role('super_admin')));

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function private.set_updated_at();

-- Current values from the website.
insert into public.site_settings (
  id, email, phone_primary, phone_secondary, whatsapp, address, digital_address, map_lat, map_lng
) values (
  1, 'firstlingualconsult@gmail.com', '+233 24 217 8378', '+233 54 821 8019', '233242178378',
  'HNO. BE 37, Dandellon Street, Danfa, Accra, Greater Accra Region, Ghana', 'GM-244-5169', 5.7507, -0.0977
)
on conflict (id) do nothing;
