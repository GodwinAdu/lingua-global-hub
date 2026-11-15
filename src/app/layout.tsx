import type { Metadata } from 'next';
import Providers from './providers';
import { SITE_URL, siteConfig } from '@/lib/site';
import { ogImage } from '@/lib/seo/og';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} | Professional Language & Media Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Language services',
  formatDetection: { telephone: true, email: true, address: true },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'First Grade Lingua Consult: Blog & News' }] } },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: '/',
    locale: 'en_GH',
    images: [{ url: ogImage(siteConfig.tagline), width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitter,
    images: [ogImage(siteConfig.tagline)],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon0.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
