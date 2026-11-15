import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * The user has chosen their own password: stop forcing a change.
 * Server-only (not a Server Action), so it can't be called from the browser for another user.
 */
export async function clearMustChangePassword(userId: string) {
  const { error } = await createAdminClient().from('profiles').update({ must_change_password: false }).eq('id', userId);
  if (error) console.error('Could not clear must_change_password:', error.message);
}
