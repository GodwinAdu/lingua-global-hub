import type { Metadata } from 'next';
import View from '@/views/PortfolioPage';
import { getPortfolio } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected translation, interpretation and media production projects by First Grade Lingua Consult.',
  alternates: { canonical: '/portfolio' },
};

export default async function Page() {
  return <View items={await getPortfolio()} />;
}
