import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { HOME_SECTIONS } from '@/lib/content/home';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../site/content-list';
import { SectionSwitch } from './section-switch';

export const metadata: Metadata = { title: 'Home page' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function HomeAdminPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase.from('home_sections').select('key, is_visible'),
    supabase.from('home_items').select('section, is_published'),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Home page"
        description="Sections appear on the home page in this order. Switch a section off to hide it."
        action={
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> View home page
            </a>
          </Button>
        }
      />
      <ul className="divide-y rounded-xl border">
        {HOME_SECTIONS.map((def, i) => {
          const visible = sections?.find((s) => s.key === def.key)?.is_visible ?? true;
          const own = (items ?? []).filter((it) => it.section === def.key);
          const shown = own.filter((it) => it.is_published).length;
          return (
            <li key={def.key} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${visible ? '' : 'bg-muted/40'}`}>
              <span className="w-6 text-sm tabular-nums text-muted-foreground">{i + 1}</span>
              <Link href={`/admin/home/${def.key}`} className="min-w-0 flex-1">
                <span className="block font-medium hover:underline">{def.name}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {def.description}
                  {def.items && ` · ${shown} ${def.items.label.toLowerCase()}${shown === 1 ? '' : 's'} shown`}
                  {def.items && shown === 0 && ' (hidden until one is added)'}
                </span>
              </Link>
              <SectionSwitch sectionKey={def.key} name={def.name} visible={visible} />
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/home/${def.key}`}>
                  Edit <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
