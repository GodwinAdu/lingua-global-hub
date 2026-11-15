import type { Metadata } from 'next';
import BlogPage from '@/views/BlogPage';
import { getCategories, getPublishedPosts } from '@/lib/content/posts';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('blog');
}

export default async function Page() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['Blog & News', '/blog']]))} />
      <BlogPage posts={posts} categories={categories} />
    </>
  );
}
