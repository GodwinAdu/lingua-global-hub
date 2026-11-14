import Index from '@/views/Index';
import { getServices, getTestimonials } from '@/lib/content/site';

export default async function Page() {
  const [services, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  return <Index services={services} testimonials={testimonials} />;
}
