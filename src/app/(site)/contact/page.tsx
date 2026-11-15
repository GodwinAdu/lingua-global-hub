import type { Metadata } from 'next';
import View from '@/views/ContactPage';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('contact');
}

export default function Page() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['Contact', '/contact']]))} />
      <View />
    </>
  );
}
