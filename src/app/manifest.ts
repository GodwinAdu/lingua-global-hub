import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#050d1c',
    theme_color: '#050d1c',
    icons: [
      { src: '/icon1.png', sizes: '96x96', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon0.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
