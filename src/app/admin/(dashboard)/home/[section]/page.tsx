import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { HOME_DEFAULTS, HOME_SECTIONS, type HomeItem } from '@/lib/content/home';
import { getIcon } from '@/lib/content/icons';
import { Button } from '@/components/ui/button';
import { ContentList, PageHeader } from '../../site/content-list';
import { SimpleItemDialog, type FieldDef } from '../../site/simple-item-dialog';
import { SectionSwitch } from '../section-switch';
import { SectionForm } from './section-form';

export const metadata: Metadata = { title: 'Home page section' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

type Row = HomeItem & { is_published: boolean };

export default async function HomeSectionAdminPage({ params }: PageProps<'/admin/home/[section]'>) {
  const [, { section: key }] = await Promise.all([requireStaff('editor'), params]);
  const def = HOME_SECTIONS.find((s) => s.key === key);
  if (!def) notFound();

  const supabase = await createClient();
  const [{ data: section }, { data: items }] = await Promise.all([
    supabase.from('home_sections').select('is_visible, content').eq('key', def.key).maybeSingle(),
    supabase.from('home_items').select('id, title, description, value, icon, items, is_published').eq('section', def.key).order('sort_order').order('id'),
  ]);

  const saved = (section?.content ?? {}) as Record<string, string>;
  const values = { ...HOME_DEFAULTS[def.key], ...saved };
  const rows = (items ?? []) as Row[];
  const fields = (def.items?.fields ?? []) as FieldDef[];
  const asInitial = (r: Row) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    value: r.value,
    icon: r.icon || 'Users',
    items: r.items.join('\n'),
  });

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/home">
          <ArrowLeft className="h-4 w-4" /> Home page
        </Link>
      </Button>
      <PageHeader
        title={def.name}
        description={def.description}
        action={<SectionSwitch sectionKey={def.key} name={def.name} visible={section?.is_visible ?? true} />}
      />

      {def.fields.length > 0 && <SectionForm sectionKey={def.key} fields={def.fields} values={values} />}

      {def.managedAt && (
        <Button variant="outline" asChild>
          <Link href={def.managedAt.href}>
            {def.managedAt.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {def.items && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{def.items.label}s</h2>
            <SimpleItemDialog table="home_items" title={def.items.label} fields={fields} hidden={{ section: def.key }} />
          </div>
          <ContentList
            table="home_items"
            rows={rows}
            empty={`No ${def.items.label.toLowerCase()}s. This section is hidden on the home page until you add one.`}
            label={(r) => def.items!.summary(r)}
            edit={(r) => (
              <SimpleItemDialog table="home_items" title={def.items!.label} fields={fields} hidden={{ section: def.key }} initial={asInitial(r)} />
            )}
            render={(r) => {
              const Icon = r.icon ? getIcon(r.icon) : null;
              return (
                <div className="flex items-center gap-3">
                  {Icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{def.items!.summary(r)}</span>
                    {r.description && <span className="block truncate text-sm text-muted-foreground">{r.description}</span>}
                    {r.items.length > 0 && <span className="block truncate text-sm text-muted-foreground">{r.items.join(', ')}</span>}
                  </span>
                </div>
              );
            }}
          />
        </section>
      )}
    </div>
  );
}
