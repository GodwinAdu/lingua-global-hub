import Index from '@/views/Index';
import { getServices, getTestimonials } from '@/lib/content/site';
import { getHomePage } from '@/lib/content/home-data';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/server';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('home');
}

export default async function Page() {
  const [home, services, testimonials] = await Promise.all([getHomePage(), getServices(), getTestimonials()]);
  return <Index home={home} services={services} testimonials={testimonials} />;
}
