import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hasRole, isRole, type Role } from '@/lib/roles';

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  role: Role | null;
  mustChangePassword: boolean;
};

/**
 * Data access layer: the single place that decides who the current user is.
 * Verifies the JWT with getClaims() (never trust getSession() on the server),
 * then reads the role from the database so role changes apply immediately.
 * Memoized per request with React.cache.
 */
export const getCurrentUser = cache(async (): Promise<StaffUser | null> => {
  // Session checks compare token expiry with the clock: always run per request, never prerender.
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, job_title, avatar_url, role, must_change_password')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    jobTitle: profile.job_title,
    avatarUrl: profile.avatar_url,
    role: isRole(profile.role) ? profile.role : null,
    mustChangePassword: Boolean(profile.must_change_password),
  };
});

/**
 * Use at the top of every admin page and Server Action.
 * Redirects instead of returning when the user may not proceed.
 */
export async function requireStaff(required: Role = 'author'): Promise<StaffUser & { role: Role }> {
  const user = await getCurrentUser();
  if (!user) {
    // A valid session without a profile means the account was deleted: clear the cookies,
    // or the proxy would bounce between /admin/login and /admin.
    const { data } = await (await createClient()).auth.getClaims();
    redirect(data?.claims ? '/auth/signout?reason=removed' : '/admin/login');
  }
  if (!user.role) redirect('/admin/no-access');
  // Accounts given a generated password must choose their own first.
  if (user.mustChangePassword) redirect('/admin/set-password?required=1');
  if (!hasRole(user.role, required)) redirect('/admin?denied=1');
  return user as StaffUser & { role: Role };
}
