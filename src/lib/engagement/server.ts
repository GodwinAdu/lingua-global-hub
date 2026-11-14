import 'server-only';
import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

const VISITOR_COOKIE = 'fgl_vid';

function secret(): string {
  const s = process.env.VISITOR_HASH_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!s) throw new Error('Missing VISITOR_HASH_SECRET (or SUPABASE_SECRET_KEY).');
  return s;
}

const hmac = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('hex');

/**
 * Anonymous per-browser id (httpOnly cookie, created on first use). Only its HMAC is
 * stored, so the database never holds the raw id and it can't be linked across sites.
 */
export async function visitorHash(): Promise<string> {
  const jar = await cookies();
  let id = jar.get(VISITOR_COOKIE)?.value;
  if (!id || !/^[A-Za-z0-9_-]{20,64}$/.test(id)) {
    id = crypto.randomBytes(18).toString('base64url');
    jar.set(VISITOR_COOKIE, id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return hmac(`visitor:${id}`);
}

/** Hashed client IP, only used for rate limiting. */
export async function ipHash(): Promise<string> {
  const h = await headers();
  const ip = (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim();
  return hmac(`ip:${ip}`);
}

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|headless|lighthouse|curl|wget|python|httpclient/i;

export async function isBot(): Promise<boolean> {
  const ua = (await headers()).get('user-agent') ?? '';
  return ua === '' || BOT_RE.test(ua);
}

export type EngagementPost = { id: string; title: string; slug: string; comments_enabled: boolean };

/** A published post by slug, or null. */
export async function findPublishedPost(slug: string): Promise<EngagementPost | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const { data } = await createAdminClient()
    .from('posts')
    .select('id, title, slug, comments_enabled')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}
