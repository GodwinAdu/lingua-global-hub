import type { Metadata } from 'next';
import { alternates } from '@/lib/seo/og';
import View from '@/views/CookiePolicy';

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How First Grade Lingua Consult uses cookies on this website.",
  alternates: alternates('/cookie-policy'),
};

export default function Page() {
  return <View />;
}
