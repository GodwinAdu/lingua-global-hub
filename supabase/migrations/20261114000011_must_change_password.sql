-- Set when a super admin creates a user or resets their password with a generated password.
-- The user must choose their own password before using the dashboard. Only the server
-- (service_role) changes it: authenticated users have no UPDATE grant on this column.
alter table public.profiles
  add column must_change_password boolean not null default false;
