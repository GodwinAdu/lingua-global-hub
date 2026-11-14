import type { Metadata } from 'next';
import View from '@/views/PrivacyPolicy';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How First Grade Lingua Consult collects, uses and protects your personal information.",
  alternates: { canonical: '/privacy-policy' },
};

export default function Page() {
  return <View />;
}
