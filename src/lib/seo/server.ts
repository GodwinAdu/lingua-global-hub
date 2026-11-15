import 'server-only';
import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEO_PAGES, type SeoPageKey } from './pages';
import { alternates, ogImage, seoDescription, seoTitle } from './og';
import { getSiteSettings } from '@/lib/content/site';

export const SEO_TAG = 'seo';

type SavedSeo = { title: string; description: string; image_url: string | null };

async function getSavedSeo(): Promise<Record<string, SavedSeo>> {
  'use cache';
  cacheTag(SEO_TAG);
  cacheLife('days');
  const { url, publishableKey } = getSupabaseEnv();
  const db = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.from('page_seo').select('key, title, description, image_url');
  if (error) throw new Error(`Could not load page SEO: ${error.message}`);
  return Object.fromEntries((data ?? []).map((r) => [r.key, r]));
}

/** Title, description and share image for a fixed page: dashboard values over code defaults. */
export async function getPageSeo(key: SeoPageKey) {
  const [all, settings] = await Promise.all([getSavedSeo(), getSiteSettings()]);
  const saved = all[key];
  const def = SEO_PAGES[key];
  return {
    title: saved?.title || def.title,
    description: saved?.description || def.description,
    image: saved?.image_url || settings.default_share_image_url || null,
    path: def.path,
  };
}

/** Full Next.js metadata for a fixed page. Without a custom image, the generated share image is used. */
export async function pageMetadata(key: SeoPageKey): Promise<Metadata> {
  const seo = await getPageSeo(key);
  const image = seo.image || ogImage(seo.title, key === 'home' ? undefined : SEO_PAGES[key].name);
  return {
    // The home page title is complete on its own; other pages get "| First Grade Lingua Consult".
    title: seoTitle(seo.title),
    description: seoDescription(seo.description),
    alternates: alternates(seo.path),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.path,
      images: [{ url: image, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [image] },
  };
}
