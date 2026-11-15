import type { Metadata } from 'next';
import View from '@/views/PortfolioPage';
import { getPortfolio } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('portfolio');
}

export default async function Page() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['Portfolio', '/portfolio']]))} />
      <View items={await getPortfolio()} />
    </>
  );
}
