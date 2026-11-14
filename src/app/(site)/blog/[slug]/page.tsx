import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogDetailPage from '@/views/BlogDetailPage';
import { getCategories, getPublishedPost, getPublishedPosts, getRelatedPosts } from '@/lib/content/posts';
import { htmlToText } from '@/lib/content/html';
import { absoluteUrl, siteConfig } from '@/lib/site';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  // Cache Components needs at least one entry; new slugs are rendered on first visit.
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: 'placeholder' }];
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: 'Article Not Found', robots: { index: false } };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || htmlToText(post.content).slice(0, 160);

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title, description, images: [post.coverImage] },
  };
}

// params are awaited inside <Suspense> so posts published after the build get an
// instant shell, then render and cache on first visit (ISR with Cache Components).
export default function Page({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const [relatedPosts, categories] = await Promise.all([getRelatedPosts(post), getCategories()]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.coverImage)],
    datePublished: post.publishedAt,
    inLanguage: post.language === 'twi' ? 'tw' : 'en',
    author: [{ '@type': 'Person', name: post.author.name }],
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogDetailPage post={post} relatedPosts={relatedPosts} categories={categories} />
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[420px] animate-pulse bg-primary" />
      <div className="mx-auto max-w-4xl space-y-4 px-6 py-12">
        <div className="aspect-video animate-pulse rounded-2xl bg-muted" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-5 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
