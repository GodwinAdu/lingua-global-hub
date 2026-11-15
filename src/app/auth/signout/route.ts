import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Clears the session cookies and goes to the login page. Used when a signed-in session
 * no longer belongs to a staff account (the user was deleted). Page renders can't write
 * cookies, so this has to be a route handler.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = request.nextUrl.searchParams.get('reason') === 'removed' ? '?error=removed' : '';
  return NextResponse.redirect(url);
}
