import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { PostForm } from '../post-form';

export const metadata: Metadata = { title: 'New post' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function NewPostPage() {
  const user = await requireStaff('author');
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('id, label').order('sort_order').order('label');

  return (
    <PostForm
      canPublish={hasRole(user.role, 'editor')}
      canDelete={false}
      categories={categories ?? []}
      initial={{
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image_url: '',
        gallery_urls: [],
        category_id: '',
        language: 'english',
        tags: '',
        author_name: user.fullName ?? '',
        author_title: user.jobTitle ?? '',
        seo_title: '',
        seo_description: '',
        status: 'draft',
      }}
    />
  );
}
