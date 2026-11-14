import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasRole, isRole, type Role } from '@/lib/roles';

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  role: Role | null;
};

/**
 * Data access layer: the single place that decides who the current user is.
 * Verifies the JWT with getClaims() (never trust getSession() on the server),
 * then reads the role from the database so role changes apply immediately.
 * Memoized per request with React.cache.
 */
export const getCurrentUser = cache(async (): Promise<StaffUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, job_title, avatar_url, role')
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
  };
});

/**
 * Use at the top of every admin page and Server Action.
 * Redirects instead of returning when the user may not proceed.
 */
export async function requireStaff(required: Role = 'author'): Promise<StaffUser & { role: Role }> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!user.role) redirect('/admin/no-access');
  if (!hasRole(user.role, required)) redirect('/admin?denied=1');
  return user as StaffUser & { role: Role };
}
