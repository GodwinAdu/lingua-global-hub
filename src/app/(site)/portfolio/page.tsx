import type { Metadata } from 'next';
import View from '@/views/PortfolioPage';

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected translation, interpretation and media production projects by First Grade Lingua Consult.",
  alternates: { canonical: '/portfolio' },
};

export default function Page() {
  return <View />;
}
