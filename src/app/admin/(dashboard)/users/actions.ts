'use server';

import { refresh } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { isRole } from '@/lib/roles';
import { generatePassword } from '@/lib/passwords';

export type ActionState = { error?: string; success?: string } | undefined;
/** Returned once to the super admin's browser so they can pass it on. Never stored or logged. */
export type CredentialsState = { error?: string; email?: string; password?: string; name?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isId = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

async function superAdminCount() {
  const { count } = await createAdminClient()
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'super_admin');
  return count ?? 0;
}

/**
 * Create a staff account with a generated temporary password (no email needed).
 * The user must choose their own password the first time they sign in.
 */
export async function createUser(_prev: CredentialsState, formData: FormData): Promise<CredentialsState> {
  await requireStaff('super_admin');

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const fullName = String(formData.get('fullName') ?? '').trim().slice(0, 120);
  const role = formData.get('role');
  if (!EMAIL_RE.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!isRole(role)) return { error: 'Choose a role.' };

  const admin = createAdminClient();
  const password = generatePassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || undefined },
  });
  if (error || !data.user) {
    const exists = /already|registered|exists/i.test(error?.message ?? '');
    return {
      error: exists
        ? 'An account with that email already exists. Use "Reset password" on it in the list instead.'
        : 'Could not create the account. Try again.',
    };
  }

  // The new-user trigger has created the profile with no role; set role, name and the first-login rule.
  const { error: profileError } = await admin
    .from('profiles')
    .update({ role, must_change_password: true, ...(fullName ? { full_name: fullName } : {}) })
    .eq('id', data.user.id);
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id); // don't leave a half-created account behind
    return { error: 'Could not save the role. Nothing was created; try again.' };
  }

  refresh();
  return { email, password, name: fullName || email };
}

/** Give a user a new generated password. They must change it when they next sign in. */
export async function resetUserPassword(userId: string): Promise<CredentialsState> {
  const current = await requireStaff('super_admin');
  if (!isId(userId)) return { error: 'Invalid user.' };
  if (userId === current.id) return { error: 'Change your own password on the Account page.' };

  const admin = createAdminClient();
  const { data: target } = await admin.from('profiles').select('email, full_name').eq('id', userId).maybeSingle();
  if (!target) return { error: 'User not found.' };

  const password = generatePassword();
  const { error } = await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
  if (error) return { error: 'Could not reset the password. Try again.' };

  // Also forces anyone already signed in as this user to set a new password before continuing.
  await admin.from('profiles').update({ must_change_password: true }).eq('id', userId);
  refresh();
  return { email: target.email, password, name: target.full_name || target.email };
}

/** Permanently delete a staff account. Their posts stay (author name is kept on each post). */
export async function deleteUser(userId: string): Promise<ActionState> {
  const current = await requireStaff('super_admin');
  if (!isId(userId)) return { error: 'Invalid user.' };
  if (userId === current.id) return { error: "You can't delete your own account." };

  const admin = createAdminClient();
  const { data: target } = await admin.from('profiles').select('role, email').eq('id', userId).maybeSingle();
  if (!target) return { error: 'User not found.' };
  if (target.role === 'super_admin' && (await superAdminCount()) <= 1) {
    return { error: 'There must be at least one super admin.' };
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: 'Could not delete the user. Try again.' };
  // The profile row is removed by the foreign key cascade; their open sessions stop working on the next
  // request because every dashboard page looks the profile up (src/lib/auth.ts).
  refresh();
  return { success: `${target.email} was deleted.` };
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

  if (target.role === 'super_admin' && role !== 'super_admin' && (await superAdminCount()) <= 1) {
    return { error: 'There must be at least one super admin.' };
  }

  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: 'Could not update the role.' };

  refresh();
  return { success: role ? 'Role updated.' : 'Access revoked.' };
}
