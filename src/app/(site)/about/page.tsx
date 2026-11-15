import type { Metadata } from 'next';
import View from '@/views/AboutPage';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('about');
}

export default function Page() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['About', '/about']]))} />
      <View />
    </>
  );
}
