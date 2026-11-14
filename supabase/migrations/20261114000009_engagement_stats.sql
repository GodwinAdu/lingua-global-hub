-- Views per post over the last N days, for the dashboard. Runs as the caller, so the
-- "Editors can read views" policy applies: other roles get no rows.
create or replace function public.post_views_since(days integer default 30)
returns table (post_id uuid, views bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select v.post_id, count(*) as views
  from public.post_views v
  where v.day >= ((now() at time zone 'Africa/Accra')::date - greatest(days, 1) + 1)
  group by v.post_id
  order by views desc
  limit 50
$$;

revoke execute on function public.post_views_since(integer) from public, anon;
grant execute on function public.post_views_since(integer) to authenticated;
