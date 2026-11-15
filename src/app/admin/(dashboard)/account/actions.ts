'use server';

import { refresh } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { clearMustChangePassword } from '@/lib/staff-accounts';

export type ActionState = { error?: string; success?: string } | undefined;

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireStaff();
  const fullName = String(formData.get('fullName') ?? '').trim().slice(0, 120);
  const jobTitle = String(formData.get('jobTitle') ?? '').trim().slice(0, 120);

  // Runs as the user: RLS and column grants only allow these fields on their own row.
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName || null, job_title: jobTitle || null })
    .eq('id', user.id);
  if (error) return { error: 'Could not save your profile.' };

  refresh();
  return { success: 'Profile saved.' };
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireStaff();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (password.length < 8) return { error: 'Use at least 8 characters.' };
  if (password !== confirm) return { error: 'The passwords do not match.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  await clearMustChangePassword(user.id);
  return { success: 'Password changed.' };
}
