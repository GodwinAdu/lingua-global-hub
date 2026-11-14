import type { Metadata } from 'next';
import View from '@/views/BlogPage';

export const metadata: Metadata = {
  title: "Blog & News",
  description: "News, culture, education and language articles in Twi and English from First Grade Lingua Consult.",
  alternates: { canonical: '/blog' },
};

export default function Page() {
  return <View />;
}
