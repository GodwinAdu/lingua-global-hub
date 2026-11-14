import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/content/posts';
import { serviceSummaries } from '@/data/services';
import { absoluteUrl } from '@/lib/site';

const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/team',
  '/portfolio',
  '/contact',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...serviceSummaries.map((s) => ({ url: absoluteUrl(`/services/${s.id}`) })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.publishedAt })),
  ];
}
