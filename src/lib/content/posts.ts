import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { DEFAULT_COVER, languageLabel, type BlogCategory, type BlogPost, type TickerItem } from './types';

// Cache tags. Server Actions call updateTag() with these after a change.
export const POSTS_TAG = 'posts';
export const CATEGORIES_TAG = 'categories';

/**
 * Anonymous client for public reads: no cookies, so it works inside 'use cache'
 * and RLS only returns published posts.
 */
function publicClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

const POST_COLUMNS =
  'id, slug, title, excerpt, content, cover_image_url, gallery_urls, language, tags, reading_minutes, author_name, author_title, seo_title, seo_description, published_at, view_count, like_count, comment_count, category:categories(slug)';

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  language: string;
  tags: string[];
  reading_minutes: number;
  author_name: string;
  author_title: string;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  category: { slug: string } | null;
};

function toBlogPost(row: PostRow): BlogPost {
  const cover = row.cover_image_url || DEFAULT_COVER;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: cover,
    images: [cover, ...row.gallery_urls],
    category: row.category?.slug ?? '',
    language: row.language,
    languageLabel: languageLabel(row.language),
    author: { name: row.author_name || 'First Grade Lingua', role: row.author_title },
    publishedAt: row.published_at ?? '',
    readingTime: `${row.reading_minutes} min`,
    tags: row.tags,
    stats: { views: row.view_count, likes: row.like_count, comments: row.comment_count },
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  'use cache';
  cacheTag(POSTS_TAG);
  cacheLife('days');

  const { data, error } = await publicClient()
    .from('posts')
    .select(POST_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .returns<PostRow[]>();
  if (error) throw new Error(`Could not load posts: ${error.message}`);
  return data.map(toBlogPost);
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.language === post.language))
    .slice(0, limit);
}

export async function getTickerItems(limit = 10): Promise<TickerItem[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit).map(({ id, slug, title, languageLabel }) => ({ id, slug, title, languageLabel }));
}

export async function getCategories(): Promise<BlogCategory[]> {
  'use cache';
  cacheTag(CATEGORIES_TAG);
  cacheLife('days');

  const { data, error } = await publicClient()
    .from('categories')
    .select('slug, label, label_twi')
    .order('sort_order')
    .order('label');
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return data.map((c) => ({ id: c.slug, label: c.label, labelTwi: c.label_twi ?? c.label }));
}
