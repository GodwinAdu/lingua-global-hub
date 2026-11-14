import type { Metadata } from 'next';
import View from '@/views/TermsOfService';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern the use of First Grade Lingua Consult services and website.",
  alternates: { canonical: '/terms-of-service' },
};

export default function Page() {
  return <View />;
}
