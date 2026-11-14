import type { Metadata } from 'next';
import BlogPage from '@/views/BlogPage';
import { getCategories, getPublishedPosts } from '@/lib/content/posts';

export const metadata: Metadata = {
  title: 'Blog & News',
  description: 'News, culture, education and language articles in Twi and English from First Grade Lingua Consult.',
  alternates: { canonical: '/blog' },
};

export default async function Page() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  return <BlogPage posts={posts} categories={categories} />;
}
