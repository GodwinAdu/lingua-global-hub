import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ContentList, PageHeader } from '../site/content-list';
import { SimpleItemDialog, type FieldDef } from '../site/simple-item-dialog';

export const metadata: Metadata = { title: 'Testimonials' };

const FIELDS: FieldDef[] = [
  { name: 'quote', label: 'Quote', type: 'textarea', required: true, maxLength: 1000 },
  { name: 'author', label: 'Name', required: true, maxLength: 120 },
  { name: 'role', label: 'Job title', placeholder: 'e.g. Program Director', maxLength: 120 },
  { name: 'company', label: 'Organisation', maxLength: 160 },
];

export default async function TestimonialsAdminPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const { data } = await supabase.from('testimonials').select('*').order('sort_order').order('id');
  const rows = data ?? [];

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Testimonials"
        description="Client quotes in the home page carousel. The section is hidden if none are shown."
        action={<SimpleItemDialog table="testimonials" title="Testimonial" fields={FIELDS} />}
      />
      <ContentList
        table="testimonials"
        rows={rows}
        empty="No testimonials yet."
        label={(r) => r.author}
        edit={(r) => (
          <SimpleItemDialog
            table="testimonials"
            title="Testimonial"
            fields={FIELDS}
            initial={{ id: r.id, quote: r.quote, author: r.author, role: r.role, company: r.company }}
          />
        )}
        render={(r) => (
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm">&ldquo;{r.quote}&rdquo;</p>
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {r.author}
              {r.company ? `, ${r.company}` : ''}
            </div>
          </div>
        )}
      />
    </div>
  );
}
