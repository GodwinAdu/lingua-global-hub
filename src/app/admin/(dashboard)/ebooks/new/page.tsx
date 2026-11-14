import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { EbookForm } from '../ebook-form';

export const metadata: Metadata = { title: 'New ebook' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function NewEbookPage() {
  await requireStaff('admin');
  return (
    <EbookForm
      initial={{
        title: '',
        slug: '',
        author: '',
        description: '',
        cover_image_url: '',
        language: 'english',
        pages: '',
        price: '0',
        is_published: false,
        file_path: '',
        file_name: '',
        file_size: '',
        file_type: '',
      }}
    />
  );
}
