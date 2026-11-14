import { SiteDataProvider } from '@/components/layout/site-data';
import { getTickerItems } from '@/lib/content/posts';
import { getSiteSettings } from '@/lib/content/site';
import { getHomePage } from '@/lib/content/home-data';

// Public site chrome. Both reads are cached and refresh when edited in the dashboard.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [ticker, settings, home] = await Promise.all([getTickerItems(), getSiteSettings(), getHomePage()]);
  return <SiteDataProvider value={{ ticker, settings, cta: home.cta }}>{children}</SiteDataProvider>;
}
