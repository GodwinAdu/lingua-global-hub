import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * /api/ebooks/download/<token>: uses one of the order's downloads, then
 * redirects to a signed URL that expires in 60 seconds.
 */
export async function GET(request: NextRequest, { params }: RouteContext<'/api/ebooks/download/[token]'>) {
  const { token } = await params;
  const expired = new URL('/ebooks?link=expired', request.url);
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return NextResponse.redirect(expired);

  const db = createAdminClient();
  const { data, error } = await db.rpc('claim_download', { p_token: token });
  const file = Array.isArray(data) ? data[0] : null;
  if (error || !file?.file_path) return NextResponse.redirect(expired);

  const { data: signed, error: signError } = await db.storage
    .from('ebooks')
    .createSignedUrl(file.file_path, 60, { download: file.file_name || true });
  if (signError || !signed) {
    console.error('Signed URL failed:', signError);
    return new NextResponse('Download is temporarily unavailable. Please try again.', { status: 503 });
  }

  const res = NextResponse.redirect(signed.signedUrl);
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}
