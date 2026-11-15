import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/content/posts';
import { getServices } from '@/lib/content/site';
import { getEbooks } from '@/lib/ebooks/catalog';
import { absoluteUrl } from '@/lib/site';
import { usableShareImage } from '@/lib/seo/og';

type Entry = MetadataRoute.Sitemap[number];

const PAGES: [string, Entry['changeFrequency'], number][] = [
  ['/', 'weekly', 1],
  ['/services', 'monthly', 0.9],
  ['/contact', 'yearly', 0.8],
  ['/about', 'yearly', 0.7],
  ['/blog', 'daily', 0.8],
  ['/ebooks', 'weekly', 0.7],
  ['/team', 'monthly', 0.6],
  ['/portfolio', 'monthly', 0.6],
  ['/privacy-policy', 'yearly', 0.2],
  ['/terms-of-service', 'yearly', 0.2],
  ['/cookie-policy', 'yearly', 0.2],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, ebooks] = await Promise.all([getPublishedPosts(), getServices(), getEbooks()]);
  const latestPost = posts[0]?.updatedAt || posts[0]?.publishedAt;

  return [
    ...PAGES.map(([path, changeFrequency, priority]) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
      ...(path === '/blog' && latestPost && { lastModified: latestPost }),
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      ...(usableShareImage(s.image_url) && { images: [absoluteUrl(s.image_url!)] }),
    })),
    ...posts.map((p) => {
      const image = usableShareImage(p.coverImage);
      return {
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: p.updatedAt || p.publishedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        ...(image && { images: [absoluteUrl(image)] }),
      };
    }),
    ...ebooks.map((b) => ({
      url: absoluteUrl(`/ebooks/${b.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(usableShareImage(b.cover_image_url) && { images: [absoluteUrl(b.cover_image_url!)] }),
    })),
  ];
}
