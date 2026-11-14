import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Reading', robots: { index: false, follow: false } };

/** In-browser PDF reader for a paid/free order. Reading doesn't use up downloads. */
export default function ReadPage({ params }: PageProps<'/ebooks/read/[token]'>) {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-muted" />}>
      <Reader params={params} />
    </Suspense>
  );
}

async function Reader({ params }: Pick<PageProps<'/ebooks/read/[token]'>, 'params'>) {
  await connection();
  const { token } = await params;
  const db = createAdminClient();

  const { data: order } = /^[A-Za-z0-9_-]{20,64}$/.test(token)
    ? await db
        .from('orders')
        .select('reference, status, expires_at, ebook:ebooks(title, file_path, file_type)')
        .eq('download_token', token)
        .maybeSingle()
    : { data: null };

  const ebook = order?.ebook as unknown as { title: string; file_path: string | null; file_type: string | null } | null;
  const valid =
    order?.status === 'paid' &&
    (!order.expires_at || new Date(order.expires_at) > new Date()) &&
    ebook?.file_path &&
    ebook.file_type === 'application/pdf';

  if (!valid || !ebook?.file_path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg">This reading link is invalid or has expired.</p>
        <Button asChild>
          <Link href="/ebooks">Browse ebooks</Link>
        </Button>
      </div>
    );
  }

  // Signed for an hour of reading; the page can be reloaded for a fresh link.
  const { data: signed } = await db.storage.from('ebooks').createSignedUrl(ebook.file_path, 60 * 60);

  return (
    <div className="flex h-screen flex-col bg-muted">
      <header className="flex items-center justify-between gap-4 border-b bg-background px-4 py-2">
        <Link
          href={`/ebooks/order/${encodeURIComponent(order!.reference)}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="truncate font-medium">{ebook.title}</h1>
        <Button size="sm" variant="outline" asChild>
          <a href={`/api/ebooks/download/${token}`}>
            <Download className="h-4 w-4" /> Download
          </a>
        </Button>
      </header>
      {signed ? (
        <iframe src={`${signed.signedUrl}#toolbar=1&view=FitH`} title={ebook.title} className="w-full flex-1 border-0" />
      ) : (
        <p className="p-6 text-center">The book couldn&apos;t be opened right now. Please reload the page.</p>
      )}
    </div>
  );
}
