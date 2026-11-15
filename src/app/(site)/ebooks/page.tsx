import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import { EbookPageShell } from '@/components/ebooks/page-shell';
import { ExpiredLinkNotice } from '@/components/ebooks/expired-link-notice';
import { getEbooks } from '@/lib/ebooks/catalog';
import { formatPrice } from '@/lib/ebooks/orders';
import { languageLabel } from '@/lib/content/types';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';
import { SiteImage } from '@/components/seo/site-image';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('ebooks');
}

export default async function EbooksPage() {
  const ebooks = await getEbooks();

  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['Ebooks', '/ebooks']]))} />
    <EbookPageShell title="Ebooks" intro="Download and read our books on language, culture and communication. No account needed.">
      <Suspense>
        <ExpiredLinkNotice />
      </Suspense>
      {ebooks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10" />
          New ebooks are coming soon.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ebooks.map((book) => (
            <Link key={book.id} href={`/ebooks/${book.slug}`} className="group block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-premium-lg">
                {book.cover_image_url ? (
                  <SiteImage src={book.cover_image_url} alt={`${book.title} cover`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center font-display text-lg font-bold text-muted-foreground">
                    {book.title}
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-1">
                <h2 className="font-display font-bold leading-snug group-hover:text-secondary">{book.title}</h2>
                {book.author && <p className="text-sm text-muted-foreground">{book.author}</p>}
                <div className="flex items-center justify-between pt-1 text-sm">
                  <span className="font-semibold">{formatPrice(book.price_pesewas, book.currency)}</span>
                  <span className="text-muted-foreground">{languageLabel(book.language)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </EbookPageShell>
    </>
  );
}
