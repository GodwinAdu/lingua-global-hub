-- SEO: per-page title/description/share image (editors), and site-wide search settings (super admins).

create table public.page_seo (
  key          text primary key check (key in ('home', 'about', 'services', 'team', 'portfolio', 'blog', 'ebooks', 'contact')),
  title        text not null default '' check (char_length(title) <= 70),
  description  text not null default '' check (char_length(description) <= 170),
  image_url    text check (image_url is null or image_url ~ '^(https?://|/)'),
  updated_at   timestamptz not null default now()
);

alter table public.page_seo enable row level security;
grant select on public.page_seo to anon, authenticated;
grant update on public.page_seo to authenticated;
grant select, insert, update, delete on public.page_seo to service_role;

create policy "Page SEO is public" on public.page_seo
  for select to anon, authenticated using (true);
create policy "Editors can update page SEO" on public.page_seo
  for update to authenticated
  using ((select private.has_role('editor')))
  with check ((select private.has_role('editor')));

create trigger page_seo_set_updated_at
  before update on public.page_seo
  for each row execute function private.set_updated_at();

-- Empty values fall back to the defaults in code (src/lib/seo/pages.ts).
insert into public.page_seo (key) values
  ('home'), ('about'), ('services'), ('team'), ('portfolio'), ('blog'), ('ebooks'), ('contact')
on conflict (key) do nothing;

alter table public.site_settings
  add column business_description text not null default '' check (char_length(business_description) <= 300),
  add column google_site_verification text not null default '' check (google_site_verification ~ '^[A-Za-z0-9_-]{0,100}$'),
  add column bing_site_verification text not null default '' check (bing_site_verification ~ '^[A-Za-z0-9_-]{0,100}$'),
  add column default_share_image_url text check (default_share_image_url is null or default_share_image_url ~ '^(https?://|/)'),
  add column founded_year integer check (founded_year is null or founded_year between 1900 and 2100);
