import type { Metadata } from 'next';
import Providers from './providers';
import { SITE_URL, siteConfig } from '@/lib/site';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} | Professional Language & Media Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitter,
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
