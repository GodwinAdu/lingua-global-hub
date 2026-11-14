import type { Metadata } from 'next';
import View from '@/views/ServicesPage';
import { getServices } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Translation, interpretation, voice-over, jingle recording, editing, proofreading and script writing services.',
  alternates: { canonical: '/services' },
};

export default async function Page() {
  return <View items={await getServices()} />;
}
