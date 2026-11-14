import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const OTP_TYPES: EmailOtpType[] = ['invite', 'recovery', 'signup', 'magiclink', 'email', 'email_change'];

/**
 * Landing point for links in Supabase auth emails (invite, password reset).
 * Accepts either `?token_hash=&type=` (recommended email templates) or `?code=` (PKCE).
 * Verifies the token, which sets the session cookie, then continues to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/admin';
  const next = nextParam.startsWith('/admin') && !nextParam.startsWith('//') ? nextParam : '/admin';

  const supabase = await createClient();
  let ok = false;

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  const url = request.nextUrl.clone();
  url.search = '';
  if (ok) {
    url.pathname = next;
  } else {
    url.pathname = '/admin/login';
    url.searchParams.set('error', 'link');
  }
  return NextResponse.redirect(url);
}
