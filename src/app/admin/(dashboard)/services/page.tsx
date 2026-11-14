import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getIcon } from '@/lib/content/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ContentList, PageHeader } from '../site/content-list';

export const metadata: Metadata = { title: 'Services' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function ServicesAdminPage({ searchParams }: PageProps<'/admin/services'>) {
  const [, query] = await Promise.all([requireStaff('editor'), searchParams]);
  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('id, slug, icon, title, card_title, summary, is_published')
    .order('sort_order')
    .order('id');

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Services"
        description="Shown on the home page, the Services page and each service's own page."
        action={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4" /> Add service
            </Link>
          </Button>
        }
      />
      {query.deleted && (
        <Alert>
          <AlertDescription>Service deleted.</AlertDescription>
        </Alert>
      )}
      <ContentList
        table="services"
        rows={data ?? []}
        empty="No services yet."
        label={(r) => r.title}
        edit={(r) => (
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/services/${r.id}`} aria-label={`Edit ${r.title}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        )}
        render={(r) => {
          const Icon = getIcon(r.icon);
          return (
            <Link href={`/admin/services/${r.id}`} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium hover:underline">{r.title}</span>
                <span className="block truncate text-sm text-muted-foreground">/services/{r.slug}</span>
              </span>
            </Link>
          );
        }}
      />
    </div>
  );
}
