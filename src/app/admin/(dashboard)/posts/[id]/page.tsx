import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { PostForm } from '../post-form';
import type { PostStatus } from '../status-badge';

export const metadata: Metadata = { title: 'Edit post' };

const SAVED: Record<string, string> = {
  draft: 'Draft created.',
  review: 'Submitted for review. An editor will publish it.',
  published: 'Published. The post is now live on the website.',
};

export default async function EditPostPage({ params, searchParams }: PageProps<'/admin/posts/[id]'>) {
  const [user, { id }, query] = await Promise.all([requireStaff('author'), params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).maybeSingle(), // RLS: authors only get their own
    supabase.from('categories').select('id, label').order('sort_order').order('label'),
  ]);
  if (!post) notFound();

  const canPublish = hasRole(user.role, 'editor');
  const status = post.status as PostStatus;
  const saved = typeof query.saved === 'string' ? SAVED[query.saved] : undefined;

  return (
    <PostForm
      savedMessage={saved}
      canPublish={canPublish}
      canDelete={canPublish || (post.author_id === user.id && status !== 'published')}
      categories={categories ?? []}
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image_url: post.cover_image_url ?? '',
        gallery_urls: post.gallery_urls ?? [],
        category_id: post.category_id ? String(post.category_id) : '',
        language: post.language,
        tags: (post.tags ?? []).join(', '),
        author_name: post.author_name,
        author_title: post.author_title,
        seo_title: post.seo_title ?? '',
        seo_description: post.seo_description ?? '',
        status,
      }}
    />
  );
}
