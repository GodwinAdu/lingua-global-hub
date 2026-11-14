import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ContentList, PageHeader } from '../site/content-list';
import { SimpleItemDialog, type FieldDef } from '../site/simple-item-dialog';

export const metadata: Metadata = { title: 'Portfolio' };

const FIELDS: FieldDef[] = [
  { name: 'title', label: 'Project title', required: true, maxLength: 160 },
  {
    name: 'category',
    label: 'Category',
    placeholder: 'e.g. Translation',
    hint: 'Projects with the same category are grouped under one filter tab.',
    maxLength: 60,
  },
  { name: 'client', label: 'Client', maxLength: 160 },
  { name: 'description', label: 'Description', type: 'textarea', maxLength: 800 },
];

export default async function PortfolioAdminPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const { data } = await supabase.from('portfolio_items').select('*').order('sort_order').order('id');
  const rows = data ?? [];

  const asInitial = (r: (typeof rows)[number]) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    client: r.client,
    description: r.description,
  });

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Portfolio"
        description="Projects shown on the Portfolio page."
        action={<SimpleItemDialog table="portfolio_items" title="Project" fields={FIELDS} imageFolder="portfolio" />}
      />
      <ContentList
        table="portfolio_items"
        rows={rows}
        empty="No projects yet."
        label={(r) => r.title}
        edit={(r) => <SimpleItemDialog table="portfolio_items" title="Project" fields={FIELDS} initial={asInitial(r)} imageFolder="portfolio" />}
        render={(r) => (
          <div className="min-w-0">
            <div className="truncate font-medium">{r.title}</div>
            <div className="truncate text-sm text-muted-foreground">
              {[r.category, r.client].filter(Boolean).join(' · ')}
            </div>
          </div>
        )}
      />
    </div>
  );
}
