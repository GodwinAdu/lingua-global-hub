import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { ServiceForm } from '../service-form';

export const metadata: Metadata = { title: 'New service' };

export default async function NewServicePage() {
  await requireStaff('editor');
  return (
    <ServiceForm
      initial={{
        slug: '',
        icon: 'Languages',
        title: '',
        card_title: '',
        card_description: '',
        summary: '',
        subtitle: '',
        description: '',
        image_url: '',
        features: '',
        stats: [],
        details: [],
      }}
    />
  );
}
