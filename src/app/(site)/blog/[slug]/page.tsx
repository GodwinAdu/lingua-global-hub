import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailPage from '@/views/BlogDetailPage';
import { blogPosts, getBlogPostBySlug } from '@/data/blogPosts';
import { absoluteUrl, siteConfig } from '@/lib/site';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

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
      <BlogDetailPage slug={slug} />
    </>
  );
}
