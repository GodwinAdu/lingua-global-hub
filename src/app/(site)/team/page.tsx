import type { Metadata } from 'next';
import View from '@/views/TeamPage';
import { getTeam } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the linguists, interpreters, voice artists and writers behind First Grade Lingua Consult.',
  alternates: { canonical: '/team' },
};

export default async function Page() {
  return <View members={await getTeam()} />;
}
