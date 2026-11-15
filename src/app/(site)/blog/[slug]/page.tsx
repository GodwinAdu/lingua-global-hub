import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogDetailPage from '@/views/BlogDetailPage';
import { getCategories, getPublishedPost, getPublishedPosts, getRelatedPosts } from '@/lib/content/posts';
import { htmlToText } from '@/lib/content/html';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph, ORG_ID } from '@/lib/seo/jsonld';
import { alternates, ogImage, seoDescription, seoTitle, usableShareImage } from '@/lib/seo/og';

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
  const description = seoDescription(post.seoDescription || post.excerpt || htmlToText(post.content));
  // Cover photo if there is one; otherwise a generated card with the headline (SVG placeholders don't preview).
  const image = usableShareImage(post.coverImage) ?? ogImage(post.title, post.language === 'twi' ? 'Nsɛm · News' : 'Blog & News');

  return {
    title: seoTitle(title),
    description,
    keywords: post.tags,
    alternates: alternates(`/blog/${post.slug}`),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      images: [{ url: image, alt: post.title }],
      locale: post.language === 'twi' ? 'tw_GH' : 'en_GH',
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
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

  const url = absoluteUrl(`/blog/${post.slug}`);
  const category = categories.find((c) => c.id === post.category)?.label;
  const image = usableShareImage(post.coverImage);
  const article = {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    ...(image && { image: [absoluteUrl(image), ...post.images.slice(1).map((i) => absoluteUrl(i))] }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: post.language === 'twi' ? 'tw' : 'en',
    ...(category && { articleSection: category }),
    ...(post.tags.length && { keywords: post.tags.join(', ') }),
    wordCount: htmlToText(post.content).split(' ').filter(Boolean).length,
    author: [{ '@type': 'Person', name: post.author.name, ...(post.author.role && { jobTitle: post.author.role }) }],
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': absoluteUrl('/#website') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <JsonLd data={graph(article, breadcrumbJsonLd([['Blog & News', '/blog'], [post.title, `/blog/${post.slug}`]]))} />
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
