import { NewsTickerProvider } from '@/components/layout/news-ticker-context';
import { getTickerItems } from '@/lib/content/posts';

// Public site chrome. Headlines are cached (tag "posts") and refresh when a post is published.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const items = await getTickerItems();
  return <NewsTickerProvider items={items}>{children}</NewsTickerProvider>;
}
