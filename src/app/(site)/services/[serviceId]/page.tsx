import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailPage from '@/views/ServiceDetailPage';
import { getService, getServices } from '@/lib/content/site';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph, ORG_ID } from '@/lib/seo/jsonld';
import { alternates, ogImage, seoDescription, seoTitle, usableShareImage } from '@/lib/seo/og';

export async function generateStaticParams() {
  const services = await getServices();
  return services.length > 0 ? services.map((s) => ({ serviceId: s.slug })) : [{ serviceId: 'placeholder' }];
}

export async function generateMetadata({ params }: PageProps<'/services/[serviceId]'>): Promise<Metadata> {
  const { serviceId } = await params;
  const service = await getService(serviceId);
  if (!service) return { title: 'Service Not Found', robots: { index: false } };

  const description = seoDescription(service.summary || service.card_description || service.subtitle);
  const image = usableShareImage(service.image_url) ?? ogImage(service.title, 'Our Services');
  return {
    title: seoTitle(service.title),
    description,
    alternates: alternates(`/services/${service.slug}`),
    openGraph: {
      title: service.title,
      description,
      url: `/services/${service.slug}`,
      images: [{ url: image, alt: service.title }],
    },
    twitter: { card: 'summary_large_image', title: service.title, description, images: [image] },
  };
}

// params are awaited inside <Suspense> so services added after the build render on first visit.
export default function Page({ params }: PageProps<'/services/[serviceId]'>) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/30" />}>
      <Service params={params} />
    </Suspense>
  );
}

async function Service({ params }: Pick<PageProps<'/services/[serviceId]'>, 'params'>) {
  const { serviceId } = await params;
  const items = await getServices();
  const service = items.find((s) => s.slug === serviceId);
  if (!service) notFound();

  const url = absoluteUrl(`/services/${service.slug}`);
  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    serviceType: service.card_title || service.title,
    description: service.description || service.summary,
    url,
    ...(usableShareImage(service.image_url) && { image: absoluteUrl(service.image_url!) }),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Ghana' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: absoluteUrl('/contact') },
    ...(service.features.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title}: what's included`,
        itemListElement: service.features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f } })),
      },
    }),
  };

  return (
    <>
      <JsonLd data={graph(serviceLd, breadcrumbJsonLd([['Services', '/services'], [service.title, `/services/${service.slug}`]]))} />
      <ServiceDetailPage serviceId={serviceId} items={items} />
    </>
  );
}
