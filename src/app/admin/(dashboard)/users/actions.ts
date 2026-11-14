'use server';

import { refresh } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { isRole } from '@/lib/roles';
import { absoluteUrl } from '@/lib/site';

export type ActionState = { error?: string; success?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inviteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff('super_admin');

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const fullName = String(formData.get('fullName') ?? '').trim().slice(0, 120);
  const role = formData.get('role');

  if (!EMAIL_RE.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!isRole(role)) return { error: 'Choose a role.' };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName || undefined },
    redirectTo: absoluteUrl('/auth/confirm?next=/admin/set-password'),
  });

  if (error || !data.user) {
    const exists = error?.message?.toLowerCase().includes('already');
    return { error: exists ? 'A user with that email already exists. Change their role in the list instead.' : 'Could not send the invite. Try again.' };
  }

  // The new-user trigger has created the profile with no role; grant the chosen one.
  const { error: roleError } = await admin
    .from('profiles')
    .update({ role, ...(fullName ? { full_name: fullName } : {}) })
    .eq('id', data.user.id);
  if (roleError) return { error: 'Invite sent, but the role could not be saved. Set it in the list.' };

  refresh();
  return { success: `Invite sent to ${email}.` };
}

/** Set a user's role, or pass "none" to revoke dashboard access. */
export async function updateUserRole(userId: string, roleValue: string): Promise<ActionState> {
  const current = await requireStaff('super_admin');

  if (userId === current.id) return { error: "You can't change your own role." };
  const role = roleValue === 'none' ? null : roleValue;
  if (role !== null && !isRole(role)) return { error: 'Unknown role.' };

  const admin = createAdminClient();

  const { data: target } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (!target) return { error: 'User not found.' };

  // Never remove the last super admin.
  if (target.role === 'super_admin' && role !== 'super_admin') {
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'super_admin');
    if ((count ?? 0) <= 1) return { error: 'There must be at least one super admin.' };
  }

  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: 'Could not update the role.' };

  refresh();
  return { success: role ? 'Role updated.' : 'Access revoked.' };
}
