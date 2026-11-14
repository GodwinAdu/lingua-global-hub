-- Editable home page: per-section text/visibility and list items for each section.
-- Editors manage both. Unknown keys in `content` fall back to the defaults in code.

create table public.home_sections (
  key          text primary key check (key in (
                 'hero', 'stats', 'marquee', 'ghana_languages', 'about', 'services',
                 'features', 'trust', 'why', 'process', 'testimonials', 'cta')),
  is_visible   boolean not null default true,
  content      jsonb not null default '{}' check (jsonb_typeof(content) = 'object'),
  updated_at   timestamptz not null default now()
);

alter table public.home_sections enable row level security;
grant select on public.home_sections to anon, authenticated;
grant update on public.home_sections to authenticated;
grant select, insert, update, delete on public.home_sections to service_role;

create policy "Home sections are public" on public.home_sections
  for select to anon, authenticated using (true);
create policy "Editors can update home sections" on public.home_sections
  for update to authenticated
  using ((select private.has_role('editor')))
  with check ((select private.has_role('editor')));

create trigger home_sections_set_updated_at
  before update on public.home_sections
  for each row execute function private.set_updated_at();

insert into public.home_sections (key) values
  ('hero'), ('stats'), ('marquee'), ('ghana_languages'), ('about'), ('services'),
  ('features'), ('trust'), ('why'), ('process'), ('testimonials'), ('cta')
on conflict (key) do nothing;

-- List items (stats, languages, feature cards, badges, steps, ...), one shape for all.
create table public.home_items (
  id            bigint generated always as identity primary key,
  section       text not null references public.home_sections (key) on delete cascade,
  title         text not null default '' check (char_length(title) <= 160),
  description   text not null default '' check (char_length(description) <= 600),
  value         text not null default '' check (char_length(value) <= 40),
  icon          text not null default '' check (char_length(icon) <= 40),
  items         text[] not null default '{}',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index home_items_section_idx on public.home_items (section, sort_order);

alter table public.home_items enable row level security;
grant select on public.home_items to anon, authenticated;
grant insert, update, delete on public.home_items to authenticated;
grant select, insert, update, delete on public.home_items to service_role;

create policy "Published rows are public" on public.home_items
  for select to anon, authenticated using (is_published);
create policy "Editors can read all rows" on public.home_items
  for select to authenticated using ((select private.has_role('editor')));
create policy "Editors can insert" on public.home_items
  for insert to authenticated with check ((select private.has_role('editor')));
create policy "Editors can update" on public.home_items
  for update to authenticated using ((select private.has_role('editor'))) with check ((select private.has_role('editor')));
create policy "Editors can delete" on public.home_items
  for delete to authenticated using ((select private.has_role('editor')));

create trigger home_items_set_updated_at
  before update on public.home_items
  for each row execute function private.set_updated_at();
