import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailPage from '@/views/ServiceDetailPage';
import { getService, getServices } from '@/lib/content/site';

export async function generateStaticParams() {
  const services = await getServices();
  return services.length > 0 ? services.map((s) => ({ serviceId: s.slug })) : [{ serviceId: 'placeholder' }];
}

export async function generateMetadata({ params }: PageProps<'/services/[serviceId]'>): Promise<Metadata> {
  const { serviceId } = await params;
  const service = await getService(serviceId);
  if (!service) return { title: 'Service Not Found', robots: { index: false } };

  const description = service.summary || service.card_description || service.subtitle;
  return {
    title: service.title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description,
      url: `/services/${service.slug}`,
      ...(service.image_url && { images: [{ url: service.image_url }] }),
    },
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
  if (!items.some((s) => s.slug === serviceId)) notFound();
  return <ServiceDetailPage serviceId={serviceId} items={items} />;
}
