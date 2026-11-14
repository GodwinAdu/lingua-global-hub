-- Contact page fields not covered by the first settings migration.
alter table public.site_settings
  add column po_box text not null default '' check (char_length(po_box) <= 120),
  add column working_hours text[] not null default '{}';

update public.site_settings
set po_box = 'P.O. Box AF 1350, Adenta',
    working_hours = array['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 2PM']
where id = 1;
