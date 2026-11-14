import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ContentList, PageHeader } from '../site/content-list';
import { SimpleItemDialog, type FieldDef } from '../site/simple-item-dialog';

export const metadata: Metadata = { title: 'Team' };

const FIELDS: FieldDef[] = [
  { name: 'image_url', label: 'Photo', type: 'image' },
  { name: 'name', label: 'Name', required: true, maxLength: 120 },
  { name: 'role', label: 'Role', placeholder: 'e.g. Lead Interpreter', maxLength: 120 },
  { name: 'bio', label: 'Short bio', type: 'textarea', maxLength: 600 },
  { name: 'specialties', label: 'Specialties', placeholder: 'Translation, Localization', hint: 'Separate with commas.' },
  { name: 'linkedin_url', label: 'LinkedIn profile', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
  { name: 'email', label: 'Email', type: 'email' },
];

export default async function TeamAdminPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const { data } = await supabase.from('team_members').select('*').order('sort_order').order('id');
  const rows = data ?? [];

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
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Team"
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
    </div>
  );
}
