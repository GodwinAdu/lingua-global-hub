import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { HOME_DEFAULTS, HOME_SECTION_KEYS, type HomeItem, type HomePage, type HomeSectionKey } from './home';

export const HOME_TAG = 'home';

/** Home page content: saved text merged over the defaults, visibility, and visible list items. */
export async function getHomePage(): Promise<HomePage> {
  'use cache';
  cacheTag(HOME_TAG);
  cacheLife('days');

  const { url, publishableKey } = getSupabaseEnv();
  const db = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const [sections, items] = await Promise.all([
    db.from('home_sections').select('key, is_visible, content'),
    db.from('home_items').select('id, section, title, description, value, icon, items').order('sort_order').order('id'),
  ]);
  if (sections.error) throw new Error(`Could not load home page: ${sections.error.message}`);
  if (items.error) throw new Error(`Could not load home page items: ${items.error.message}`);

  const page = {} as HomePage;
  for (const key of HOME_SECTION_KEYS) {
    const row = sections.data.find((s) => s.key === key);
    const saved = (row?.content ?? {}) as Record<string, unknown>;
    const content: Record<string, string> = { ...HOME_DEFAULTS[key] };
    for (const [k, v] of Object.entries(saved)) if (typeof v === 'string') content[k] = v;
    page[key] = {
      visible: row?.is_visible ?? true,
      content,
      items: items.data.filter((i) => i.section === key).map(({ section: _s, ...i }) => i as HomeItem),
    };
  }
  return page;
}

export type { HomeSectionKey };
