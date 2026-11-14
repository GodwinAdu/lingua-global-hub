import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';
import type { PortfolioItem, Service, SiteSettings, TeamMember, Testimonial } from './site-types';

// Cache tags, refreshed by the dashboard's Server Actions with updateTag().
export const SITE_TAGS = {
  services: 'services',
  team: 'team',
  portfolio: 'portfolio',
  testimonials: 'testimonials',
  settings: 'settings',
} as const;

function publicClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function list<T>(table: string, columns: string): Promise<T[]> {
  const { data, error } = await publicClient()
    .from(table)
    .select(columns)
    .eq('is_published', true)
    .order('sort_order')
    .order('id');
  if (error) throw new Error(`Could not load ${table}: ${error.message}`);
  return data as T[];
}

const SERVICE_COLUMNS =
  'slug, icon, title, card_title, card_description, summary, subtitle, description, image_url, features, stats, details';

export async function getServices(): Promise<Service[]> {
  'use cache';
  cacheTag(SITE_TAGS.services);
  cacheLife('days');
  return list<Service>('services', SERVICE_COLUMNS);
}

export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  'use cache';
  cacheTag(SITE_TAGS.team);
  cacheLife('days');
  return list<TeamMember>('team_members', 'id, name, role, bio, image_url, specialties, linkedin_url, email');
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  'use cache';
  cacheTag(SITE_TAGS.portfolio);
  cacheLife('days');
  return list<PortfolioItem>('portfolio_items', 'id, title, category, client, description, image_url');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  'use cache';
  cacheTag(SITE_TAGS.testimonials);
  cacheLife('days');
  return list<Testimonial>('testimonials', 'id, quote, author, role, company');
}

export async function getSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheTag(SITE_TAGS.settings);
  cacheLife('days');
  const { data, error } = await publicClient().from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw new Error(`Could not load site settings: ${error.message}`);
  return (data ?? {}) as SiteSettings;
}
