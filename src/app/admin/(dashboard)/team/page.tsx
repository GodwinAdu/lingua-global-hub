import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getIcon } from '@/lib/content/icons';
import { ContentList, PageHeader } from '../site/content-list';
import { SimpleItemDialog, type FieldDef } from '../site/simple-item-dialog';

export const metadata: Metadata = { title: 'Team' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

const FIELDS: FieldDef[] = [
  { name: 'image_url', label: 'Photo', type: 'image' },
  { name: 'name', label: 'Name', required: true, maxLength: 120 },
  { name: 'role', label: 'Role', placeholder: 'e.g. Lead Interpreter', maxLength: 120 },
  { name: 'bio', label: 'Short bio', type: 'textarea', maxLength: 600 },
  { name: 'specialties', label: 'Specialties', placeholder: 'Translation, Localization', hint: 'Separate with commas.' },
  { name: 'linkedin_url', label: 'LinkedIn profile', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
  { name: 'email', label: 'Email', type: 'email' },
];

const STAT_FIELDS: FieldDef[] = [
  { name: 'value', label: 'Number', placeholder: 'e.g. 50+', required: true, maxLength: 20 },
  { name: 'label', label: 'Label', placeholder: 'e.g. Team Members', required: true, maxLength: 60 },
  { name: 'icon', label: 'Icon', type: 'icon' },
];

export default async function TeamAdminPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const [{ data }, { data: statData }] = await Promise.all([
    supabase.from('team_members').select('*').order('sort_order').order('id'),
    supabase.from('team_stats').select('*').order('sort_order').order('id'),
  ]);
  const rows = data ?? [];
  const stats = statData ?? [];

  const asInitial = (r: (typeof rows)[number]) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    bio: r.bio,
    image_url: r.image_url ?? '',
    specialties: (r.specialties ?? []).join(', '),
    linkedin_url: r.linkedin_url ?? '',
    email: r.email ?? '',
  });

  return (
    <div className="max-w-4xl space-y-10">
      <section className="space-y-4">
        <PageHeader
          title="Team page numbers"
          description="The figures at the top of the Team page, e.g. 50+ Team Members."
          action={<SimpleItemDialog table="team_stats" title="Number" fields={STAT_FIELDS} />}
        />
        <ContentList
          table="team_stats"
          rows={stats}
          empty="No numbers. The section is hidden on the Team page."
          label={(r) => `${r.value} ${r.label}`}
          edit={(r) => (
            <SimpleItemDialog table="team_stats" title="Number" fields={STAT_FIELDS} initial={{ id: r.id, value: r.value, label: r.label, icon: r.icon }} />
          )}
          render={(r) => {
            const Icon = getIcon(r.icon);
            return (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xl font-bold">{r.value}</span>
                <span className="text-muted-foreground">{r.label}</span>
              </div>
            );
          }}
        />
      </section>

      <section className="space-y-4">
      <PageHeader
        title="Team members"
        description="People shown on the Team page. Hidden members stay here but aren't shown on the site."
        action={<SimpleItemDialog table="team_members" title="Team member" fields={FIELDS} imageFolder="team" />}
      />
      <ContentList
        table="team_members"
        rows={rows}
        empty="No team members yet."
        label={(r) => r.name}
        edit={(r) => <SimpleItemDialog table="team_members" title="Team member" fields={FIELDS} initial={asInitial(r)} imageFolder="team" />}
        render={(r) => (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.image_url || '/placeholder.svg'} alt="" className="h-12 w-12 rounded-full object-cover bg-muted" />
            <div className="min-w-0">
              <div className="truncate font-medium">{r.name}</div>
              <div className="truncate text-sm text-muted-foreground">{r.role}</div>
            </div>
          </div>
        )}
      />
      </section>
    </div>
  );
}
