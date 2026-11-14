import { createAdminClient } from '@/lib/supabase/admin';
import { findPublishedPost, isBot, visitorHash } from '@/lib/engagement/server';
import { isSameOrigin, json } from '@/lib/engagement/http';

/** Toggle this visitor's like. One like per visitor per post is enforced by the primary key. */
export async function POST(request: Request, { params }: RouteContext<'/api/posts/[slug]/like'>) {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (await isBot()) return json({ error: 'Forbidden' }, 403);

  const { slug } = await params;
  const post = await findPublishedPost(slug);
  if (!post) return json({ error: 'Not found' }, 404);

  const db = createAdminClient();
  const visitor = await visitorHash();
  const { data: existing } = await db
    .from('post_likes')
    .select('post_id')
    .eq('post_id', post.id)
    .eq('visitor_hash', visitor)
    .maybeSingle();

  if (existing) {
    await db.from('post_likes').delete().eq('post_id', post.id).eq('visitor_hash', visitor);
  } else {
    // ignoreDuplicates: a double click can't create two likes or an error.
    await db.from('post_likes').upsert({ post_id: post.id, visitor_hash: visitor }, { onConflict: 'post_id,visitor_hash', ignoreDuplicates: true });
  }

  const { data } = await db.from('posts').select('like_count').eq('id', post.id).single();
  return json({ liked: !existing, likes: data?.like_count ?? 0 });
}
