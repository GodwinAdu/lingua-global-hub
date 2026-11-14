'use server';

import { refresh, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/content/html';
import { ICON_NAMES } from '@/lib/content/icons';
import { SITE_TAGS } from '@/lib/content/site';

export type ActionState = { error?: string; success?: string; fieldErrors?: Record<string, string> } | undefined;

// Tables editors may change through these generic actions, with the cache tag each one feeds.
const TABLES = {
  services: SITE_TAGS.services,
  team_members: SITE_TAGS.team,
  portfolio_items: SITE_TAGS.portfolio,
  testimonials: SITE_TAGS.testimonials,
} as const;
export type ContentTable = keyof typeof TABLES;

function isTable(t: string): t is ContentTable {
  return t in TABLES;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (max: number, label: string) => text(max).min(1, `Add ${label}.`);
const optionalHttps = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || /^https:\/\/[^\s]+$/.test(v), 'Use a full link starting with https://')
  .transform((v) => v || null);
const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === '' || /^https?:\/\/[^\s]+$/.test(v) || (/^\/[^/\s]/.test(v)), 'Invalid image URL.')
  .transform((v) => v || null);
const lines = (maxItems: number, maxLen: number) =>
  z
    .string()
    .transform((v) => v.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, maxItems))
    .pipe(z.array(z.string().max(maxLen, `Each line must be under ${maxLen} characters.`)));
const json = <T extends z.ZodTypeAny>(schema: T) =>
  z.string().transform((v, ctx) => {
    try {
      return JSON.parse(v || '[]');
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid data.' });
      return z.NEVER;
    }
  }).pipe(schema);

function fieldErrors(error: z.ZodError): ActionState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return { error: 'Fix the highlighted fields.', fieldErrors: errors };
}

function formObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') out[k] = v;
  return out;
}

async function saveRow(table: ContentTable, id: string | undefined, row: Record<string, unknown>) {
  const supabase = await createClient();
  if (id && /^\d+$/.test(id)) {
    return supabase.from(table).update(row).eq('id', Number(id)).select('id').maybeSingle();
  }
  // New rows go to the end of the list.
  const { data: last } = await supabase.from(table).select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
  return supabase.from(table).insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 }).select('id').single();
}

function dbError(error: { code?: string; message: string }): ActionState {
  if (error.code === '23505') return { error: 'That URL slug is already used by another service.', fieldErrors: { slug: 'Already in use.' } };
  if (error.code === '42501') return { error: "You don't have permission to make that change." };
  if (error.code === '23514') return { error: 'One of the values is not allowed. Check links start with https://' };
  console.error('content save error:', error);
  return { error: 'Could not save. Try again.' };
}

// ---------------------------------------------------------------------------
// Team, portfolio, testimonials
// ---------------------------------------------------------------------------
const teamSchema = z.object({
  name: required(120, 'a name'),
  role: text(120),
  bio: text(600),
  image_url: imageUrl,
  specialties: z.string().transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 10)),
  linkedin_url: optionalHttps,
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email.')
    .transform((v) => v || null),
});

const portfolioSchema = z.object({
  title: required(160, 'a title'),
  category: text(60),
  client: text(160),
  description: text(800),
  image_url: imageUrl,
});

const testimonialSchema = z.object({
  quote: required(1000, 'the quote'),
  author: required(120, "the person's name"),
  role: text(120),
  company: text(160),
});

const SCHEMAS = {
  team_members: teamSchema,
  portfolio_items: portfolioSchema,
  testimonials: testimonialSchema,
} as const;

export async function saveSimpleItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff('editor');
  const values = formObject(formData);
  const table = values.table;
  if (!(table in SCHEMAS)) return { error: 'Unknown content type.' };

  const parsed = SCHEMAS[table as keyof typeof SCHEMAS].safeParse(values);
  if (!parsed.success) return fieldErrors(parsed.error);

  const { error } = await saveRow(table as ContentTable, values.id, parsed.data);
  if (error) return dbError(error);

  updateTag(TABLES[table as ContentTable]);
  refresh();
  return { success: 'Saved. The website is updated.' };
}

// ---------------------------------------------------------------------------
// Services (full page form)
// ---------------------------------------------------------------------------
const serviceSchema = z.object({
  title: required(120, 'a title'),
  slug: text(80),
  icon: z.string().refine((v) => ICON_NAMES.includes(v), 'Choose an icon.'),
  card_title: text(80),
  card_description: text(400),
  summary: text(400),
  subtitle: text(200),
  description: text(2000),
  image_url: imageUrl,
  features: lines(20, 200),
  stats: json(
    z
      .array(z.object({ value: text(20), label: text(60), icon: z.string().refine((v) => ICON_NAMES.includes(v)) }))
      .max(8)
      .transform((rows) => rows.filter((r) => r.value || r.label)),
  ),
  details: json(
    z
      .array(z.object({ title: text(120), content: text(1500) }))
      .max(12)
      .transform((rows) => rows.filter((r) => r.title || r.content)),
  ),
});

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff('editor');
  const values = formObject(formData);
  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) return fieldErrors(parsed.error);

  const slug = slugify(parsed.data.slug || parsed.data.title);
  if (!slug) return { error: 'Fix the highlighted fields.', fieldErrors: { slug: 'Add a URL slug.' } };

  const { data, error } = await saveRow('services', values.id, { ...parsed.data, slug });
  if (error) return dbError(error);
  if (!data) return { error: "You don't have permission to make that change." };

  updateTag(SITE_TAGS.services);
  if (!values.id) redirect(`/admin/services/${data.id}?saved=1`);
  refresh();
  return { success: 'Saved. The website is updated.' };
}

// ---------------------------------------------------------------------------
// Shared list actions: show/hide, reorder, delete
// ---------------------------------------------------------------------------
export async function setPublished(table: string, id: number, isPublished: boolean): Promise<ActionState> {
  await requireStaff('editor');
  if (!isTable(table)) return { error: 'Unknown content type.' };
  const supabase = await createClient();
  const { error } = await supabase.from(table).update({ is_published: isPublished }).eq('id', id);
  if (error) return dbError(error);
  updateTag(TABLES[table]);
  refresh();
  return { success: isPublished ? 'Shown on the website.' : 'Hidden from the website.' };
}

/** Swap an item with its neighbour above or below. */
export async function moveItem(table: string, id: number, direction: 'up' | 'down'): Promise<ActionState> {
  await requireStaff('editor');
  if (!isTable(table)) return { error: 'Unknown content type.' };
  const supabase = await createClient();

  const { data: rows, error } = await supabase.from(table).select('id, sort_order').order('sort_order').order('id');
  if (error || !rows) return { error: 'Could not reorder.' };

  const index = rows.findIndex((r) => r.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return undefined;

  // Renumber the whole list so duplicate sort_order values can't get stuck.
  const ordered = [...rows];
  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  const updates = ordered
    .map((r, i) => ({ id: r.id, sort_order: i + 1, changed: r.sort_order !== i + 1 }))
    .filter((r) => r.changed);
  for (const u of updates) {
    const { error: e } = await supabase.from(table).update({ sort_order: u.sort_order }).eq('id', u.id);
    if (e) return dbError(e);
  }
  updateTag(TABLES[table]);
  refresh();
  return undefined;
}

export async function deleteItem(table: string, id: number): Promise<ActionState> {
  await requireStaff('editor');
  if (!isTable(table)) return { error: 'Unknown content type.' };
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).delete().eq('id', id).select('id').maybeSingle();
  if (error) return dbError(error);
  if (!data) return { error: "You don't have permission to delete that." };
  updateTag(TABLES[table]);
  if (table === 'services') redirect('/admin/services?deleted=1');
  refresh();
  return { success: 'Deleted.' };
}

// ---------------------------------------------------------------------------
// Site settings (super admins only)
// ---------------------------------------------------------------------------
const phone = text(40).refine((v) => v === '' || /^[+\d\s()-]{6,}$/.test(v), 'Use digits, spaces and + only.');
const coordinate = (min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((v) => (v === '' ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= min && v <= max), `Enter a number between ${min} and ${max}.`);

const settingsSchema = z.object({
  email: z.string().trim().max(254).refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email.'),
  phone_primary: phone,
  phone_secondary: phone,
  whatsapp: z
    .string()
    .transform((v) => v.replace(/[^\d]/g, ''))
    .refine((v) => v.length === 0 || (v.length >= 8 && v.length <= 15), 'Enter the full number with country code, e.g. 233242178378.'),
  address: text(300),
  po_box: text(120),
  digital_address: text(40),
  working_hours: lines(7, 80),
  map_lat: coordinate(-90, 90),
  map_lng: coordinate(-180, 180),
  facebook_url: optionalHttps,
  twitter_url: optionalHttps,
  linkedin_url: optionalHttps,
  instagram_url: optionalHttps,
  youtube_url: optionalHttps,
  tiktok_url: optionalHttps,
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff('super_admin');
  const parsed = settingsSchema.safeParse(formObject(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').update(parsed.data).eq('id', 1).select('id').maybeSingle();
  if (error) return dbError(error);
  if (!data) return { error: "You don't have permission to change site settings." };

  updateTag(SITE_TAGS.settings);
  refresh();
  return { success: 'Settings saved. The website is updated.' };
}
