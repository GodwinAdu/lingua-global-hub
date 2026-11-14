import type { Metadata } from 'next';
import View from '@/views/TeamPage';
import { getTeam, getTeamStats } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the linguists, interpreters, voice artists and writers behind First Grade Lingua Consult.',
  alternates: { canonical: '/team' },
};

export default async function Page() {
  const [members, stats] = await Promise.all([getTeam(), getTeamStats()]);
  return <View members={members} stats={stats} />;
}
