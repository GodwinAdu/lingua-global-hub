import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { BookOpen, CheckCircle2, Clock, Download, Mail, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookPageShell } from '@/components/ebooks/page-shell';
import { fulfillOrder, formatPrice } from '@/lib/ebooks/orders';
import { RefreshWhilePending } from './refresh-while-pending';

export const metadata: Metadata = { title: 'Your ebook', robots: { index: false, follow: false } };

/**
 * Paystack returns buyers here (?reference=...). The order is verified with
 * Paystack on every visit until it's paid, then the download links are shown.
 * The reference is unguessable, and this page is the buyer's receipt.
 */
export default function OrderPage({ params }: PageProps<'/ebooks/order/[reference]'>) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/30" />}>
      <Order params={params} />
    </Suspense>
  );
}

async function Order({ params }: Pick<PageProps<'/ebooks/order/[reference]'>, 'params'>) {
  await connection();
  const { reference } = await params;
  if (!/^FGL-[A-Z0-9-]{6,40}$/.test(reference)) notFound();

  const order = await fulfillOrder(reference);
  if (!order) notFound();

  if (order.status === 'pending') {
    return (
      <EbookPageShell title="Confirming your payment…">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="text-lg">
            We&apos;re waiting for Paystack to confirm your payment for <strong>{order.ebookTitle}</strong>.
          </p>
          <p className="text-muted-foreground">This page refreshes by itself. Mobile Money payments can take a minute.</p>
          <RefreshWhilePending />
        </div>
      </EbookPageShell>
    );
  }

  if (order.status === 'failed') {
    return (
      <EbookPageShell title="Payment not completed">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <XCircle className="mx-auto h-10 w-10 text-destructive" />
          <p className="text-lg">The payment for {order.ebookTitle} didn&apos;t go through, and you haven&apos;t been charged.</p>
          {order.ebookSlug && (
            <Button asChild>
              <Link href={`/ebooks/${order.ebookSlug}`}>Try again</Link>
            </Button>
          )}
        </div>
      </EbookPageShell>
    );
  }

  const token = order.downloadToken!;
  const expired = order.expiresAt ? new Date(order.expiresAt) < new Date() : false;
  const left = Math.max(0, order.downloadLimit - order.downloadsUsed);
  const isPdf = order.fileType !== 'application/epub+zip';
  const until = order.expiresAt
    ? new Date(order.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <EbookPageShell title={order.amountPesewas > 0 ? 'Thank you for your purchase!' : 'Your ebook is ready'}>
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <div>
          <h2 className="font-display text-2xl font-bold">{order.ebookTitle}</h2>
          <p className="mt-1 text-muted-foreground">
            {order.amountPesewas > 0 ? `Paid ${formatPrice(order.amountPesewas, order.currency)} · ` : ''}Order {order.reference}
          </p>
        </div>

        {expired || left === 0 ? (
          <p className="rounded-xl border bg-muted/50 p-4">
            This download link has {expired ? 'expired' : 'been used the maximum number of times'}. Contact us with your
            order number and we&apos;ll help.
          </p>
        ) : (
          <>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={`/api/ebooks/download/${token}`}>
                  <Download className="h-4 w-4" /> Download
                </a>
              </Button>
              {isPdf && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/ebooks/read/${token}`}>
                    <BookOpen className="h-4 w-4" /> Read online
                  </Link>
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {left} of {order.downloadLimit} downloads left{until ? ` · link works until ${until}` : ''}.
            </p>
          </>
        )}

        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          {process.env.EMAIL_PASS
            ? `We've also emailed this link to ${maskEmail(order.email)}. `
            : ''}
          Bookmark this page to come back later.
        </p>
      </div>
    </EbookPageShell>
  );
}

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`;
}
