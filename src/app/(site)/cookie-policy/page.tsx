import type { Metadata } from 'next';
import View from '@/views/CookiePolicy';

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How First Grade Lingua Consult uses cookies on this website.",
  alternates: { canonical: '/cookie-policy' },
};

export default function Page() {
  return <View />;
}
