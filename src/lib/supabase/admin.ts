import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

/**
 * Privileged client using the secret key. BYPASSES row-level security.
 * Only call it after the caller's own permission has been checked
 * (e.g. `await requireStaff('super_admin')`).
 */
export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing SUPABASE_SECRET_KEY. Add it to .env.local (server-only).');
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
