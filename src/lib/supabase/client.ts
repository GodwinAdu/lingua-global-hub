import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

/** Supabase client for Client Components (browser). Singleton under the hood. */
export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
