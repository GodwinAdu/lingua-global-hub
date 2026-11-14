import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailPage from '@/views/ServiceDetailPage';
import { getServiceSummary, serviceSummaries } from '@/data/services';

export function generateStaticParams() {
  return serviceSummaries.map((s) => ({ serviceId: s.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[serviceId]'>): Promise<Metadata> {
  const { serviceId } = await params;
  const service = getServiceSummary(serviceId);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: { title: service.title, description: service.description, url: `/services/${service.id}` },
  };
}

export default async function Page({ params }: PageProps<'/services/[serviceId]'>) {
  const { serviceId } = await params;
  if (!getServiceSummary(serviceId)) notFound();
  return <ServiceDetailPage serviceId={serviceId} />;
}
