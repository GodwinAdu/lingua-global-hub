import { createAdminClient } from '@/lib/supabase/admin';
import { findPublishedPost, isBot, visitorHash } from '@/lib/engagement/server';
import { isSameOrigin, json } from '@/lib/engagement/http';

/** Count a view: once per visitor per post per day; bots and cross-site requests are ignored. */
export async function POST(request: Request, { params }: RouteContext<'/api/posts/[slug]/view'>) {
  if (!isSameOrigin(request) || (await isBot())) return json({ counted: false });

  const { slug } = await params;
  const post = await findPublishedPost(slug);
  if (!post) return json({ error: 'Not found' }, 404);

  const { error } = await createAdminClient()
    .from('post_views')
    .upsert({ post_id: post.id, visitor_hash: await visitorHash() }, { onConflict: 'post_id,visitor_hash,day', ignoreDuplicates: true });
  return json({ counted: !error });
}
