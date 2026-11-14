import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';

export const EBOOKS_TAG = 'ebooks';

export type Ebook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cover_image_url: string | null;
  language: string;
  pages: number | null;
  file_type: string | null;
  file_size: number | null;
  price_pesewas: number;
  currency: string;
};

/** Published ebooks with a file (RLS enforces both for the anonymous client). */
export async function getEbooks(): Promise<Ebook[]> {
  'use cache';
  cacheTag(EBOOKS_TAG);
  cacheLife('days');

  const { url, publishableKey } = getSupabaseEnv();
  const db = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db
    .from('ebooks')
    .select('id, slug, title, author, description, cover_image_url, language, pages, file_type, file_size, price_pesewas, currency')
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Could not load ebooks: ${error.message}`);
  return data;
}

/**
 * One published ebook, read live (not cached): the detail page renders per
 * request, and checkout must always charge the current price.
 */
export async function getEbook(slug: string): Promise<Ebook | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const { url, publishableKey } = getSupabaseEnv();
  const db = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db
    .from('ebooks')
    .select('id, slug, title, author, description, cover_image_url, language, pages, file_type, file_size, price_pesewas, currency')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`Could not load ebook: ${error.message}`);
  return data;
}

export function fileLabel(type: string | null, size: number | null) {
  const kind = type === 'application/epub+zip' ? 'EPUB' : 'PDF';
  if (!size) return kind;
  const mb = size / (1024 * 1024);
  return `${kind} · ${mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`}`;
}
