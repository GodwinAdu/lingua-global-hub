import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { ServiceForm } from '../service-form';

export const metadata: Metadata = { title: 'New service' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

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
