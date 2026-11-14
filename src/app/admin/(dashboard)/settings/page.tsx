import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/content/site-types';
import { PageHeader } from '../site/content-list';
import { SettingsForm } from './settings-form';

export const metadata: Metadata = { title: 'Site settings' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function SettingsPage() {
  await requireStaff('super_admin');
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

  return (
    <div className="space-y-6">
      <PageHeader title="Site settings" description="Contact details, office location and social links used across the website." />
      <SettingsForm settings={(data ?? {}) as SiteSettings} />
    </div>
  );
}
