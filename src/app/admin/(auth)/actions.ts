'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl } from '@/lib/site';

export type FormState = { error?: string; success?: string } | undefined;

const MIN_PASSWORD_LENGTH = 8;

/** Only allow redirects back into the dashboard, never to another origin. */
function safeAdminPath(value: FormDataEntryValue | null): string {
  const path = typeof value === 'string' ? value : '';
  return path.startsWith('/admin') && !path.startsWith('//') && !path.includes('\\') ? path : '/admin';
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Same message for unknown email and wrong password, so accounts can't be enumerated.
    return { error: 'Invalid email or password.' };
  }
  redirect(safeAdminPath(formData.get('next')));
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { error: 'Enter your email.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: absoluteUrl('/auth/confirm?next=/admin/set-password'),
  });
  if (error) console.error('Password reset error:', error.message);

  // Always report success so the form can't be used to discover which emails exist.
  return { success: 'If that email has an account, a reset link is on its way.' };
}

export async function setPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password !== confirm) return { error: 'The passwords do not match.' };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: 'Your link has expired. Request a new one from the sign-in page.' };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
