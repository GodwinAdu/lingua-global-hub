import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Admin pages reachable without a session.
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password'];

/**
 * Refreshes the Supabase session cookie on admin and auth routes and sends
 * signed-out visitors to the login page. This is an optimistic check only:
 * every admin page and Server Action re-verifies the user and role itself.
 * Public site pages are excluded by the matcher so they stay static/cacheable.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          // Cache headers stop a CDN from caching a response that carries a session.
          Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims (see Supabase SSR docs).
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.some((p) => pathname === p);

  if (isAdmin && !isPublicAdmin && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    return redirectWithSession(url, response);
  }

  if (signedIn && pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return redirectWithSession(url, response);
  }

  return response;
}

// Carry refreshed cookies and cache headers onto a redirect, or the user gets signed out.
function redirectWithSession(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = from.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
