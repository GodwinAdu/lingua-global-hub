'use server';

import { redirect } from 'next/navigation';
import { refresh, updateTag } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/content/html';
import { EBOOKS_TAG } from '@/lib/ebooks/catalog';

export type EbookState = { error?: string; success?: string; fieldErrors?: Record<string, string> } | undefined;

const FILE_TYPES = ['application/pdf', 'application/epub+zip'] as const;

const schema = z.object({
  title: z.string().trim().min(1, 'Add a title.').max(200),
  slug: z.string().trim().max(120),
  author: z.string().trim().max(160),
  description: z.string().trim().max(5000, 'Keep the description under 5000 characters.'),
  cover_image_url: z
    .string()
    .trim()
    .max(1000)
    .refine((v) => v === '' || /^https?:\/\/\S+$/.test(v) || /^\/[^/\s]/.test(v), 'Invalid image URL.')
    .transform((v) => v || null),
  language: z.enum(['english', 'twi']),
  pages: z
    .string()
    .trim()
    .transform((v) => (v === '' ? null : Number(v)))
    .refine((v) => v === null || (Number.isInteger(v) && v > 0 && v < 100000), 'Enter a whole number of pages.'),
  price: z
    .string()
    .trim()
    .transform((v) => (v === '' ? 0 : Number(v)))
    .refine((v) => Number.isFinite(v) && v >= 0 && v <= 100000, 'Enter a price in cedis, e.g. 25 or 25.50 (0 = free).')
    .refine((v) => v === 0 || v >= 1, 'Paid ebooks must cost at least GHS 1.'),
  is_published: z.string().optional().transform((v) => v === 'on' || v === 'true'),
  // Set by the browser after uploading to the private bucket.
  file_path: z
    .string()
    .trim()
    .refine((v) => v === '' || /^books\/[0-9]{4}\/[0-9a-f-]{36}\.(pdf|epub)$/.test(v), 'Invalid file.')
    .transform((v) => v || null),
  file_name: z.string().trim().max(200).transform((v) => v || null),
  file_size: z.string().trim().transform((v) => (v === '' ? null : Number(v))),
  file_type: z
    .string()
    .trim()
    .refine((v) => v === '' || (FILE_TYPES as readonly string[]).includes(v), 'Upload a PDF or EPUB.')
    .transform((v) => v || null),
});

export async function saveEbook(_prev: EbookState, formData: FormData): Promise<EbookState> {
  await requireStaff('admin');
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === 'string')) as Record<string, string>;
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: 'Fix the highlighted fields.', fieldErrors };
  }
  const { price, ...data } = parsed.data;
  const slug = slugify(data.slug || data.title);
  if (!slug) return { error: 'Fix the highlighted fields.', fieldErrors: { slug: 'Add a URL slug.' } };
  if (data.is_published && !data.file_path) {
    return { error: 'Upload the ebook file before publishing.', fieldErrors: { file_path: 'Required to publish.' } };
  }

  const supabase = await createClient();
  const id = values.id && /^[0-9a-f-]{36}$/.test(values.id) ? values.id : null;

  // Remember the old file so it can be removed if it was replaced.
  let oldFile: string | null = null;
  if (id) {
    const { data: current } = await supabase.from('ebooks').select('file_path').eq('id', id).maybeSingle();
    oldFile = current?.file_path ?? null;
  }

  const row = { ...data, slug, price_pesewas: Math.round(price * 100) };
  const result = id
    ? await supabase.from('ebooks').update(row).eq('id', id).select('id').maybeSingle()
    : await supabase.from('ebooks').insert(row).select('id').single();

  if (result.error) {
    if (result.error.code === '23505') return { error: 'Another ebook already uses this URL.', fieldErrors: { slug: 'Already in use.' } };
    console.error('saveEbook error:', result.error);
    return { error: 'Could not save the ebook.' };
  }
  if (!result.data) return { error: "You don't have permission to change ebooks." };

  if (oldFile && oldFile !== data.file_path) {
    await supabase.storage.from('ebooks').remove([oldFile]);
  }

  updateTag(EBOOKS_TAG);
  if (!id) redirect(`/admin/ebooks/${result.data.id}?saved=1`);
  refresh();
  return { success: data.is_published ? 'Saved. The ebook is live.' : 'Saved as hidden.' };
}

export async function deleteEbook(id: string): Promise<EbookState> {
  await requireStaff('admin');
  const supabase = await createClient();
  const { data, error } = await supabase.from('ebooks').delete().eq('id', id).select('file_path').maybeSingle();
  if (error || !data) return { error: 'Could not delete the ebook.' };
  // Orders keep the title (ebook_id becomes null), so sales history stays intact.
  if (data.file_path) await supabase.storage.from('ebooks').remove([data.file_path]);
  updateTag(EBOOKS_TAG);
  redirect('/admin/ebooks?deleted=1');
}
