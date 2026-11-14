'use server';

import { redirect } from 'next/navigation';
import { refresh, updateTag } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { readingMinutes, sanitizeArticleHtml, slugify } from '@/lib/content/html';
import { POSTS_TAG } from '@/lib/content/posts';
import { POST_LANGUAGES } from '@/lib/content/types';

export type PostFormState = { error?: string; success?: string; fieldErrors?: Record<string, string> } | undefined;

type Intent = 'save' | 'draft' | 'review' | 'publish' | 'unpublish';
type Status = 'draft' | 'review' | 'published';

const str = (fd: FormData, key: string, max: number) => String(fd.get(key) ?? '').trim().slice(0, max);

/** Site-relative path or http(s) URL; anything else (javascript:, data:) is dropped. */
function imageUrl(value: string): string | null {
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function parseGallery(raw: string): string[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list)
      ? list.map((u) => imageUrl(String(u))).filter((u): u is string => Boolean(u)).slice(0, 30)
      : [];
  } catch {
    return [];
  }
}

function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  for (const tag of raw.split(',')) {
    const t = tag.trim().slice(0, 40);
    if (t) seen.add(t);
  }
  return [...seen].slice(0, 20);
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await requireStaff('author');
  const canPublish = hasRole(user.role, 'editor');
  const supabase = await createClient();

  const id = str(formData, 'id', 64) || null;
  const intent = (str(formData, 'intent', 20) || 'save') as Intent;

  // Current status (RLS returns nothing if this user may not see the post).
  let current: Status | null = null;
  if (id) {
    const { data } = await supabase.from('posts').select('status').eq('id', id).maybeSingle();
    if (!data) return { error: 'Post not found, or you no longer have access to it.' };
    current = data.status as Status;
  }

  const nextStatus: Status =
    intent === 'publish' ? 'published'
    : intent === 'review' ? 'review'
    : intent === 'draft' || intent === 'unpublish' ? 'draft'
    : current ?? 'draft';

  if ((nextStatus === 'published' || current === 'published') && !canPublish) {
    return { error: 'Only editors can publish or change published posts. Submit it for review instead.' };
  }

  const title = str(formData, 'title', 200);
  const content = sanitizeArticleHtml(String(formData.get('content') ?? ''));
  const slug = slugify(str(formData, 'slug', 200) || title);
  const language = str(formData, 'language', 20);
  const categoryRaw = str(formData, 'category_id', 20);

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = 'Add a title.';
  if (!slug) fieldErrors.slug = 'Add a URL slug (letters and numbers).';
  if (!POST_LANGUAGES.some((l) => l.id === language)) fieldErrors.language = 'Choose a language.';
  if (nextStatus === 'published') {
    if (!content) fieldErrors.content = 'Write the article before publishing.';
    if (!str(formData, 'excerpt', 500)) fieldErrors.excerpt = 'Add a short summary before publishing.';
  }
  if (Object.keys(fieldErrors).length) return { error: 'Fix the highlighted fields.', fieldErrors };

  const row = {
    title,
    slug,
    excerpt: str(formData, 'excerpt', 500),
    content,
    cover_image_url: imageUrl(str(formData, 'cover_image_url', 1000)),
    gallery_urls: parseGallery(String(formData.get('gallery_urls') ?? '[]')),
    category_id: /^\d+$/.test(categoryRaw) ? Number(categoryRaw) : null,
    language,
    tags: parseTags(str(formData, 'tags', 1000)),
    reading_minutes: readingMinutes(content),
    status: nextStatus,
    author_name: str(formData, 'author_name', 120) || user.fullName || '',
    author_title: str(formData, 'author_title', 120) || user.jobTitle || '',
    seo_title: str(formData, 'seo_title', 200) || null,
    seo_description: str(formData, 'seo_description', 300) || null,
    comments_enabled: formData.get('comments_enabled') !== 'false',
  };

  const result = id
    ? await supabase.from('posts').update(row).eq('id', id).select('id').maybeSingle()
    : await supabase.from('posts').insert({ ...row, author_id: user.id }).select('id').single();

  if (result.error) {
    if (result.error.code === '23505') return { error: 'Another post already uses this URL slug.', fieldErrors: { slug: 'Already in use.' } };
    if (result.error.code === '42501') return { error: "You don't have permission to make that change." };
    console.error('savePost error:', result.error);
    return { error: 'Could not save the post. Try again.' };
  }
  if (!result.data) return { error: "You don't have permission to make that change." };

  // Refresh the public site if this post is or was live.
  if (nextStatus === 'published' || current === 'published') updateTag(POSTS_TAG);

  if (!id) redirect(`/admin/posts/${result.data.id}?saved=${nextStatus}`);

  refresh();
  const messages: Record<Status, string> = {
    published: current === 'published' ? 'Changes are live.' : 'Published. The post is now live on the website.',
    review: 'Submitted for review. An editor will publish it.',
    draft: current === 'published' ? 'Unpublished. The post is no longer on the website.' : 'Draft saved.',
  };
  return { success: messages[nextStatus] };
}

export async function deletePost(id: string): Promise<{ error?: string }> {
  await requireStaff('author');
  const supabase = await createClient();

  const { data, error } = await supabase.from('posts').delete().eq('id', id).select('status').maybeSingle();
  if (error || !data) return { error: "Could not delete the post. You may not have permission." };

  if (data.status === 'published') updateTag(POSTS_TAG);
  redirect('/admin/posts?deleted=1');
}
