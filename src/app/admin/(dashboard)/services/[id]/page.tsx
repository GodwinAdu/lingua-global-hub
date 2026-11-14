import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ServiceForm } from '../service-form';

export const metadata: Metadata = { title: 'Edit service' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function EditServicePage({ params, searchParams }: PageProps<'/admin/services/[id]'>) {
  const [, { id }, query] = await Promise.all([requireStaff('editor'), params, searchParams]);
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  const { data: s } = await supabase.from('services').select('*').eq('id', Number(id)).maybeSingle();
  if (!s) notFound();

  return (
    <ServiceForm
      savedMessage={query.saved ? 'Service created.' : undefined}
      initial={{
        id: s.id,
        slug: s.slug,
        icon: s.icon,
        title: s.title,
        card_title: s.card_title,
        card_description: s.card_description,
        summary: s.summary,
        subtitle: s.subtitle,
        description: s.description,
        image_url: s.image_url ?? '',
        features: (s.features ?? []).join('\n'),
        stats: s.stats ?? [],
        details: s.details ?? [],
      }}
    />
  );
}
