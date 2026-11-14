-- Step 3: blog posts and news, categories, and the media storage bucket.

-- ---------------------------------------------------------------------------
-- Categories ("News", "Culture", ...). Editors manage them.
-- ---------------------------------------------------------------------------
create table public.categories (
  id          bigint generated always as identity primary key,
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label       text not null check (char_length(label) between 1 and 60),
  label_twi   text check (char_length(label_twi) <= 60),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.categories to service_role;

create policy "Anyone can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Editors can create categories"
  on public.categories for insert
  to authenticated
  with check ((select private.has_role('editor')));

create policy "Editors can update categories"
  on public.categories for update
  to authenticated
  using ((select private.has_role('editor')))
  with check ((select private.has_role('editor')));

create policy "Editors can delete categories"
  on public.categories for delete
  to authenticated
  using ((select private.has_role('editor')));

-- ---------------------------------------------------------------------------
-- Posts. `review` = submitted by an author, waiting for an editor to publish.
-- ---------------------------------------------------------------------------
create type public.post_status as enum ('draft', 'review', 'published');

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 200),
  title            text not null check (char_length(title) between 1 and 200),
  excerpt          text not null default '' check (char_length(excerpt) <= 500),
  content          text not null default '',          -- sanitized HTML from the editor
  cover_image_url  text,
  gallery_urls     text[] not null default '{}',
  category_id      bigint references public.categories (id) on delete set null,
  language         text not null default 'english' check (language in ('english', 'twi')),
  tags             text[] not null default '{}',
  reading_minutes  integer not null default 1 check (reading_minutes > 0),
  status           public.post_status not null default 'draft',
  author_id        uuid references public.profiles (id) on delete set null,
  -- Shown on the public site. Copied from the author's profile, editable per post.
  author_name      text not null default '' check (char_length(author_name) <= 120),
  author_title     text not null default '' check (char_length(author_title) <= 120),
  seo_title        text check (char_length(seo_title) <= 200),
  seo_description  text check (char_length(seo_description) <= 300),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Public listing: published posts, newest first.
create index posts_published_idx on public.posts (published_at desc) where status = 'published';
-- RLS (author_id) and foreign keys.
create index posts_author_id_idx on public.posts (author_id);
create index posts_category_id_idx on public.posts (category_id);

alter table public.posts enable row level security;

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.posts to service_role;

-- Visitors see published posts. Staff also see their own drafts; editors see everything.
create policy "Published posts are public"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

create policy "Authors see their own posts; editors see all"
  on public.posts for select
  to authenticated
  using (author_id = (select auth.uid()) or (select private.has_role('editor')));

-- Authors create posts as themselves and can't publish. Editors can do anything.
create policy "Staff can create posts"
  on public.posts for insert
  to authenticated
  with check (
    (select private.has_role('editor'))
    or (
      (select private.has_role('author'))
      and author_id = (select auth.uid())
      and status in ('draft', 'review')
    )
  );

-- Authors edit their own unpublished posts and can't publish or reassign them.
create policy "Staff can update posts"
  on public.posts for update
  to authenticated
  using (
    (select private.has_role('editor'))
    or (author_id = (select auth.uid()) and status <> 'published' and (select private.has_role('author')))
  )
  with check (
    (select private.has_role('editor'))
    or (author_id = (select auth.uid()) and status in ('draft', 'review') and (select private.has_role('author')))
  );

create policy "Staff can delete posts"
  on public.posts for delete
  to authenticated
  using (
    (select private.has_role('editor'))
    or (author_id = (select auth.uid()) and status <> 'published' and (select private.has_role('author')))
  );

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function private.set_updated_at();

-- Stamp the first publish time. Unpublishing keeps the original date.
create or replace function private.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

revoke execute on function private.set_published_at() from public, anon, authenticated;

create trigger posts_set_published_at
  before insert or update of status on public.posts
  for each row execute function private.set_published_at();

-- ---------------------------------------------------------------------------
-- Media bucket: public read (images on the site), staff upload.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do nothing;

create policy "Staff can list media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'media' and (select private.has_role('author')));

create policy "Staff can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and (select private.has_role('author')));

create policy "Staff can replace media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (select private.has_role('author')))
  with check (bucket_id = 'media' and (select private.has_role('author')));

create policy "Editors can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (select private.has_role('editor')));

-- ---------------------------------------------------------------------------
-- Seed the categories the site already uses.
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label, label_twi, sort_order) values
  ('news',      'News',      'Nsɛm',     1),
  ('politics',  'Politics',  'Amammuo',  2),
  ('education', 'Education', 'Adesua',   3),
  ('culture',   'Culture',   'Amammrɛ',  4),
  ('health',    'Health',    'Apɔmuden', 5),
  ('sports',    'Sports',    'Agodie',   6)
on conflict (slug) do nothing;
