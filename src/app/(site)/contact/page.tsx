import type { Metadata } from 'next';
import View from '@/views/ContactPage';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with First Grade Lingua Consult in Danfa, Accra for translation, interpretation and media services.",
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <View />;
}
