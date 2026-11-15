import type { Metadata } from 'next';
import { SiteDataProvider } from '@/components/layout/site-data';
import { JsonLd } from '@/components/seo/json-ld';
import { getTickerItems } from '@/lib/content/posts';
import { getServices, getSiteSettings } from '@/lib/content/site';
import { getHomePage } from '@/lib/content/home-data';
import { graph, organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

/** Search engine ownership tags (Site settings > Search engines). */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const verification: Metadata['verification'] = {};
  if (s.google_site_verification) verification.google = s.google_site_verification;
  if (s.bing_site_verification) verification.other = { 'msvalidate.01': s.bing_site_verification };
  return Object.keys(verification).length ? { verification } : {};
}

// Public site chrome. All reads are cached and refresh when edited in the dashboard.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [ticker, settings, home, services] = await Promise.all([getTickerItems(), getSiteSettings(), getHomePage(), getServices()]);
  return (
    <SiteDataProvider value={{ ticker, settings, cta: home.cta }}>
      {/* The business and website, on every public page (Google knowledge panel / local results). */}
      <JsonLd data={graph(organizationJsonLd(settings, services.map((s) => s.title)), websiteJsonLd())} />
      {children}
    </SiteDataProvider>
  );
}
