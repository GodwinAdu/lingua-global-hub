import type { Metadata } from 'next';
import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';
import { SEO_PAGE_KEYS, SEO_PAGES } from '@/lib/seo/pages';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader } from '../site/content-list';
import { PageSeoForm } from './page-seo-form';

export const metadata: Metadata = { title: 'SEO' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function SeoPage() {
  const user = await requireStaff('editor');
  const supabase = await createClient();
  const [{ data: rows }, { data: settings }] = await Promise.all([
    supabase.from('page_seo').select('key, title, description, image_url'),
    supabase.from('site_settings').select('google_site_verification').eq('id', 1).maybeSingle(),
  ]);

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="SEO"
        description="How each main page appears in Google and when shared. Blog posts, services and ebooks have their own SEO fields in their editors."
      />

      {!settings?.google_site_verification && (
        <Alert>
          <AlertTitle>Google Search Console isn&apos;t connected yet</AlertTitle>
          <AlertDescription>
            {hasRole(user.role, 'super_admin') ? (
              <>
                Add the verification code under <Link href="/admin/settings#search" className="underline">Site settings → Search engines</Link>, then submit{' '}
                <code>{SITE_URL}/sitemap.xml</code> in Search Console.
              </>
            ) : (
              'Ask a super admin to add the Google Search Console verification code in Site settings.'
            )}
          </AlertDescription>
        </Alert>
      )}

      <nav className="flex flex-wrap gap-2 text-sm">
        {SEO_PAGE_KEYS.map((k) => (
          <a key={k} href={`#${k}`} className="rounded-full border px-3 py-1 text-muted-foreground hover:text-foreground">
            {SEO_PAGES[k].name}
          </a>
        ))}
      </nav>

      {SEO_PAGE_KEYS.map((k) => {
        const r = rows?.find((x) => x.key === k);
        const def = SEO_PAGES[k];
        return (
          <PageSeoForm
            key={k}
            pageKey={k}
            name={def.name}
            path={def.path}
            siteUrl={SITE_URL}
            defaults={{ title: def.title, description: def.description }}
            initial={{ title: r?.title ?? '', description: r?.description ?? '', image_url: r?.image_url ?? '' }}
          />
        );
      })}
    </div>
  );
}
