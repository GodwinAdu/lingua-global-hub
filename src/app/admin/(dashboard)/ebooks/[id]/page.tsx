import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { EbookForm } from '../ebook-form';

export const metadata: Metadata = { title: 'Edit ebook' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function EditEbookPage({ params, searchParams }: PageProps<'/admin/ebooks/[id]'>) {
  const [, { id }, query] = await Promise.all([requireStaff('admin'), params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: b }, { count }] = await Promise.all([
    supabase.from('ebooks').select('*').eq('id', id).maybeSingle(),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('ebook_id', id).eq('status', 'paid'),
  ]);
  if (!b) notFound();

  return (
    <EbookForm
      savedMessage={query.saved ? 'Ebook created.' : undefined}
      sales={count ?? 0}
      initial={{
        id: b.id,
        title: b.title,
        slug: b.slug,
        author: b.author,
        description: b.description,
        cover_image_url: b.cover_image_url ?? '',
        language: b.language,
        pages: b.pages ? String(b.pages) : '',
        price: b.price_pesewas ? (b.price_pesewas / 100).toFixed(2) : '0',
        is_published: b.is_published,
        file_path: b.file_path ?? '',
        file_name: b.file_name ?? '',
        file_size: b.file_size ? String(b.file_size) : '',
        file_type: b.file_type ?? '',
      }}
    />
  );
}
