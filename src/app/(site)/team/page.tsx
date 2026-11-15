import type { Metadata } from 'next';
import View from '@/views/TeamPage';
import { getTeam, getTeamStats } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo/server';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, graph } from '@/lib/seo/jsonld';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('team');
}

export default async function Page() {
  const [members, stats] = await Promise.all([getTeam(), getTeamStats()]);
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([['Our Team', '/team']]))} />
      <View members={members} stats={stats} />
    </>
  );
}
