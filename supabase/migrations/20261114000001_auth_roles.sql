-- Step 2: staff accounts, roles and row-level security helpers.
-- Run once in Supabase > SQL Editor (or `supabase db push`).

-- ---------------------------------------------------------------------------
-- Roles. Declaration order is the privilege order, so `role >= 'editor'` works.
--   author      : writes drafts, edits own posts
--   editor      : publishes and edits all posts, news and site pages
--   admin       : everything content-related, ebooks, pricing, orders
--   super_admin : admin + user management and site settings
-- A profile with role NULL has no dashboard access.
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('author', 'editor', 'admin', 'super_admin');

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  job_title   text,
  role        public.app_role,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.profiles.role is 'NULL = no dashboard access. Only changed server-side by a super_admin.';

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Helper functions live in a schema that is NOT exposed through the API.
-- SECURITY DEFINER lets RLS policies read profiles without recursing into
-- the profiles policies themselves.
-- ---------------------------------------------------------------------------
create schema if not exists private;

create or replace function private.user_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function private.has_role(required public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select role from public.profiles where id = (select auth.uid())) >= required,
    false
  )
$$;

-- Postgres grants EXECUTE to PUBLIC on every new function; restrict to signed-in users.
-- The private schema is not exposed through the Data API, so these are only
-- reachable from inside RLS policies.
revoke execute on function private.user_role() from public, anon;
revoke execute on function private.has_role(public.app_role) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.user_role() to authenticated;
grant execute on function private.has_role(public.app_role) to authenticated;

-- ---------------------------------------------------------------------------
-- Profiles access
-- ---------------------------------------------------------------------------
-- Explicit Data API grants. Since 2026-10-30 Supabase no longer grants these
-- automatically on new public tables, so every role that needs access is listed.
-- Column privileges: signed-in users may only edit their own display fields.
-- `role` and `email` can only be changed server-side with the secret key (service_role).
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url, job_title) on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create policy "Staff can view staff profiles; users can view their own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or private.has_role('author'));

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- Create a profile for every new auth user. Role is never taken from
-- user-supplied metadata; it starts NULL (no access) until a super_admin sets it.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Keep profiles.email in sync when a user changes their email.
create or replace function private.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function private.handle_user_email_change();

-- Trigger functions are only run by triggers, never called directly.
revoke execute on function private.set_updated_at() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;
revoke execute on function private.handle_user_email_change() from public, anon, authenticated;

-- Backfill profiles for users created before this migration.
insert into public.profiles (id, email, full_name)
select id, email, nullif(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;
