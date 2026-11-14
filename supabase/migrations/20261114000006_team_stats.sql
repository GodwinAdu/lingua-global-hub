-- Numbers shown at the top of the Team page ("50+ Team Members", ...). Editors manage them.
create table public.team_stats (
  id            bigint generated always as identity primary key,
  value         text not null check (char_length(value) between 1 and 20),
  label         text not null check (char_length(label) between 1 and 60),
  icon          text not null default 'Users' check (char_length(icon) <= 40),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.team_stats enable row level security;
grant select on public.team_stats to anon, authenticated;
grant insert, update, delete on public.team_stats to authenticated;
grant select, insert, update, delete on public.team_stats to service_role;

create policy "Published rows are public" on public.team_stats
  for select to anon, authenticated using (is_published);
create policy "Editors can read all rows" on public.team_stats
  for select to authenticated using ((select private.has_role('editor')));
create policy "Editors can insert" on public.team_stats
  for insert to authenticated with check ((select private.has_role('editor')));
create policy "Editors can update" on public.team_stats
  for update to authenticated using ((select private.has_role('editor'))) with check ((select private.has_role('editor')));
create policy "Editors can delete" on public.team_stats
  for delete to authenticated using ((select private.has_role('editor')));

create trigger team_stats_set_updated_at
  before update on public.team_stats
  for each row execute function private.set_updated_at();

-- Current values from the website.
insert into public.team_stats (value, label, icon, sort_order) values
  ('50+', 'Team Members',   'Users',     1),
  ('30+', 'Languages',      'Languages', 2),
  ('15+', 'Countries',      'Globe',     3),
  ('20+', 'Certifications', 'Award',     4);
