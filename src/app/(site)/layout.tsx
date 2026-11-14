import { SiteDataProvider } from '@/components/layout/site-data';
import { getTickerItems } from '@/lib/content/posts';
import { getSiteSettings } from '@/lib/content/site';

// Public site chrome. Both reads are cached and refresh when edited in the dashboard.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [ticker, settings] = await Promise.all([getTickerItems(), getSiteSettings()]);
  return <SiteDataProvider value={{ ticker, settings }}>{children}</SiteDataProvider>;
}
