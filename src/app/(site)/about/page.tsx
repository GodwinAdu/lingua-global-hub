import type { Metadata } from 'next';
import View from '@/views/AboutPage';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about First Grade Lingua Consult, Ghana's premier language and media consultancy, our mission, values and team.",
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <View />;
}
