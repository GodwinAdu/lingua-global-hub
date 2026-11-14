import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/content/posts';
import { getServices } from '@/lib/content/site';
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
  const [posts, services] = await Promise.all([getPublishedPosts(), getServices()]);
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`) })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.publishedAt })),
  ];
}
