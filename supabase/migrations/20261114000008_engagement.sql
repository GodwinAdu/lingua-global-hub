-- Likes, views and comments on blog posts. Comments appear immediately; admins can hide or delete them.
-- Visitors never write here directly: all public writes go through server routes that
-- apply rate limits and spam checks, using the secret key (service_role).

alter table public.posts
  add column comments_enabled boolean not null default true,
  add column view_count integer not null default 0,
  add column like_count integer not null default 0,
  add column comment_count integer not null default 0;  -- visible comments only

-- ---------------------------------------------------------------------------
-- Likes: one per visitor per post. visitor_hash = HMAC of an anonymous browser id.
-- ---------------------------------------------------------------------------
create table public.post_likes (
  post_id       uuid not null references public.posts (id) on delete cascade,
  visitor_hash  text not null check (char_length(visitor_hash) = 64),
  created_at    timestamptz not null default now(),
  primary key (post_id, visitor_hash)
);

-- Views: one per visitor per post per day.
create table public.post_views (
  post_id       uuid not null references public.posts (id) on delete cascade,
  visitor_hash  text not null check (char_length(visitor_hash) = 64),
  day           date not null default (now() at time zone 'Africa/Accra')::date,
  primary key (post_id, visitor_hash, day)
);
create index post_views_day_idx on public.post_views (day, post_id);

-- ---------------------------------------------------------------------------
-- Comments: published immediately. Admins can hide (reversible) or delete. One level of replies.
-- ---------------------------------------------------------------------------
create type public.comment_status as enum ('visible', 'hidden');

create table public.comments (
  id             uuid primary key default gen_random_uuid(),
  post_id        uuid not null references public.posts (id) on delete cascade,
  parent_id      uuid references public.comments (id) on delete cascade,
  author_name    text not null check (char_length(author_name) between 1 and 80),
  author_email   text not null check (author_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' and char_length(author_email) <= 254),
  body           text not null check (char_length(body) between 1 and 3000),
  status         public.comment_status not null default 'visible',
  is_staff       boolean not null default false,
  staff_user_id  uuid references public.profiles (id) on delete set null,
  ip_hash        text,
  created_at     timestamptz not null default now(),
  hidden_at      timestamptz
);
create index comments_post_status_idx on public.comments (post_id, status, created_at);
create index comments_status_created_idx on public.comments (status, created_at desc);
create index comments_parent_idx on public.comments (parent_id);
create index comments_email_idx on public.comments (lower(author_email));
create index comments_ip_created_idx on public.comments (ip_hash, created_at);

-- Replies stay one level deep: a reply's parent must be a top-level comment on the same post.
create or replace function private.check_comment_parent()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent record;
begin
  if new.parent_id is not null then
    select post_id, parent_id into parent from public.comments where id = new.parent_id;
    if parent is null or parent.post_id <> new.post_id or parent.parent_id is not null then
      raise exception 'Invalid parent comment';
    end if;
  end if;
  if new.status = 'hidden' then
    new.hidden_at = coalesce(new.hidden_at, now());
  else
    new.hidden_at = null;
  end if;
  return new;
end;
$$;

create trigger comments_check_parent
  before insert or update of parent_id, status on public.comments
  for each row execute function private.check_comment_parent();

-- ---------------------------------------------------------------------------
-- Keep the post counters in sync.
-- ---------------------------------------------------------------------------
create or replace function private.sync_post_counts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.post_id, old.post_id);
begin
  if tg_table_name = 'post_likes' then
    update public.posts set like_count = (select count(*) from public.post_likes where post_id = target) where id = target;
  elsif tg_table_name = 'post_views' then
    update public.posts set view_count = view_count + 1 where id = target;
  else
    update public.posts
      set comment_count = (select count(*) from public.comments where post_id = target and status = 'visible')
      where id = target;
  end if;
  return null;
end;
$$;

create trigger post_likes_sync after insert or delete on public.post_likes
  for each row execute function private.sync_post_counts();
create trigger post_views_sync after insert on public.post_views
  for each row execute function private.sync_post_counts();
create trigger comments_sync after insert or update of status or delete on public.comments
  for each row execute function private.sync_post_counts();

revoke execute on function private.sync_post_counts() from public, anon, authenticated;
revoke execute on function private.check_comment_parent() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Access
-- ---------------------------------------------------------------------------
alter table public.post_likes enable row level security;
alter table public.post_views enable row level security;
alter table public.comments enable row level security;

-- Likes/views: server only. Editors can read them for stats.
revoke all on public.post_likes, public.post_views from anon, authenticated;
grant select on public.post_likes, public.post_views to authenticated;
grant select, insert, update, delete on public.post_likes, public.post_views to service_role;
create policy "Editors can read likes" on public.post_likes for select to authenticated using ((select private.has_role('editor')));
create policy "Editors can read views" on public.post_views for select to authenticated using ((select private.has_role('editor')));

-- Comments: the public sees visible comments, without email or IP (column grants).
revoke all on public.comments from anon, authenticated;
grant select (id, post_id, parent_id, author_name, body, is_staff, created_at, status) on public.comments to anon;
grant select, update, delete on public.comments to authenticated;
grant select, insert, update, delete on public.comments to service_role;

create policy "Visible comments on published posts are public"
  on public.comments for select to anon
  using (
    status = 'visible'
    and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.comments_enabled)
  );

-- Staff can read every comment (to see activity on their posts); only admins moderate.
create policy "Staff can read all comments"
  on public.comments for select to authenticated
  using ((select private.has_role('author')));

create policy "Admins can hide or unhide comments"
  on public.comments for update to authenticated
  using ((select private.has_role('admin')))
  with check ((select private.has_role('admin')));

create policy "Admins can delete comments"
  on public.comments for delete to authenticated
  using ((select private.has_role('admin')));
