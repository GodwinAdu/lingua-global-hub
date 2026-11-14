import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';
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

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...serviceSummaries.map((s) => ({ url: absoluteUrl(`/services/${s.id}`) })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt,
    })),
  ];
}
