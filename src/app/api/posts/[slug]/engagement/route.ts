import { createAdminClient } from '@/lib/supabase/admin';
import { findPublishedPost, visitorHash } from '@/lib/engagement/server';
import { getVisibleComments } from '@/lib/engagement/comments';
import { json } from '@/lib/engagement/http';

/** Live counts and comments for a post page (the page itself stays static). */
export async function GET(_request: Request, { params }: RouteContext<'/api/posts/[slug]/engagement'>) {
  const { slug } = await params;
  const post = await findPublishedPost(slug);
  if (!post) return json({ error: 'Not found' }, 404);

  const db = createAdminClient();
  const visitor = await visitorHash();
  const [{ data: counts }, { data: like }, comments] = await Promise.all([
    db.from('posts').select('view_count, like_count, comment_count').eq('id', post.id).single(),
    db.from('post_likes').select('post_id').eq('post_id', post.id).eq('visitor_hash', visitor).maybeSingle(),
    post.comments_enabled ? getVisibleComments(post.id) : Promise.resolve([]),
  ]);

  return json({
    views: counts?.view_count ?? 0,
    likes: counts?.like_count ?? 0,
    commentCount: counts?.comment_count ?? 0,
    liked: Boolean(like),
    commentsEnabled: post.comments_enabled,
    comments,
  });
}
