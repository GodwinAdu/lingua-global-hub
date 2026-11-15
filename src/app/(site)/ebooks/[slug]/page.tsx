import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { ArrowLeft, BookOpen, FileText, Globe, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fileLabel, getEbook, getEbooks } from '@/lib/ebooks/catalog';
import { formatPrice } from '@/lib/ebooks/orders';
import { languageLabel } from '@/lib/content/types';
import { absoluteUrl } from '@/lib/site';
import { breadcrumbJsonLd, ORG_ID } from '@/lib/seo/jsonld';
import { alternates, ogImage, seoDescription, seoTitle, usableShareImage } from '@/lib/seo/og';
import { GetEbookForm } from './get-ebook-form';
import { SiteImage } from '@/components/seo/site-image';

export async function generateStaticParams() {
  const books = await getEbooks();
  return books.length > 0 ? books.map((b) => ({ slug: b.slug })) : [{ slug: 'placeholder' }];
}

export async function generateMetadata({ params }: PageProps<'/ebooks/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const book = await getEbook(slug);
  if (!book) return { title: 'Ebook Not Found', robots: { index: false } };
  const description = seoDescription(book.description || `${book.title}: ebook from First Grade Lingua Consult.`);
  const image = usableShareImage(book.cover_image_url) ?? ogImage(book.title, 'Ebook');
  return {
    title: seoTitle(book.title),
    description,
    alternates: alternates(`/ebooks/${book.slug}`),
    openGraph: {
      type: 'book',
      title: book.title,
      description,
      url: `/ebooks/${book.slug}`,
      images: [{ url: image, alt: book.title }],
    },
    twitter: { card: 'summary_large_image', title: book.title, description, images: [image] },
  };
}

export default function Page({ params }: PageProps<'/ebooks/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/30" />}>
      <Book params={params} />
    </Suspense>
  );
}

async function Book({ params }: Pick<PageProps<'/ebooks/[slug]'>, 'params'>) {
  // Render per request so a newly published ebook's first visitor (and crawlers) get the
  // full page, not just the shell. The catalogue read below is still cached.
  await connection();
  const { slug } = await params;
  const book = await getEbook(slug);
  if (!book) notFound();

  const price = formatPrice(book.price_pesewas, book.currency);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [] as unknown[],
  };
  const bookLd = {
    '@type': 'Book',
    name: book.title,
    author: book.author ? { '@type': 'Person', name: book.author } : undefined,
    inLanguage: book.language === 'twi' ? 'tw' : 'en',
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: book.pages ?? undefined,
    image: book.cover_image_url ? absoluteUrl(book.cover_image_url) : undefined,
    publisher: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      price: (book.price_pesewas / 100).toFixed(2),
      priceCurrency: book.currency,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/ebooks/${book.slug}`),
    },
  };
  jsonLd['@graph'].push(bookLd, breadcrumbJsonLd([['Ebooks', '/ebooks'], [book.title, `/ebooks/${book.slug}`]]));

  return (
    <div className="min-h-screen">
    <Navbar />
    <main className="bg-background pb-20 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="container-premium">
        <Link href="/ebooks" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All ebooks
        </Link>
        <div className="grid gap-10 lg:grid-cols-[300px_1fr_340px]">
          <div className="mx-auto w-full max-w-[300px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border bg-muted shadow-premium-lg">
              {book.cover_image_url ? (
                <SiteImage src={book.cover_image_url} alt={`${book.title} cover`} fill preload sizes="300px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center font-display text-xl font-bold text-muted-foreground">
                  {book.title}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold md:text-4xl">{book.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {book.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {book.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> {languageLabel(book.language)}
              </span>
              {book.pages && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> {book.pages} pages
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> {fileLabel(book.file_type, book.file_size)}
              </span>
            </div>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-foreground/85">
              {book.description.split(/\n\s*\n/).filter(Boolean).map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <GetEbookForm slug={book.slug} priceLabel={price} isFree={book.price_pesewas === 0} />
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
