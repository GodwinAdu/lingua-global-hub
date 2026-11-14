import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export type PublicComment = {
  id: string;
  parentId: string | null;
  authorName: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  replies: PublicComment[];
};

/** Visible comments for a post, newest threads first, replies oldest first. Never includes emails. */
export async function getVisibleComments(postId: string): Promise<PublicComment[]> {
  const { data } = await createAdminClient()
    .from('comments')
    .select('id, parent_id, author_name, body, is_staff, created_at')
    .eq('post_id', postId)
    .eq('status', 'visible')
    .order('created_at', { ascending: true })
    .limit(500);

  const all = (data ?? []).map((c) => ({
    id: c.id,
    parentId: c.parent_id,
    authorName: c.author_name,
    body: c.body,
    isStaff: c.is_staff,
    createdAt: c.created_at,
    replies: [] as PublicComment[],
  }));
  const byId = new Map(all.map((c) => [c.id, c]));
  const roots: PublicComment[] = [];
  for (const c of all) {
    const parent = c.parentId ? byId.get(c.parentId) : null;
    if (parent) parent.replies.push(c);
    else if (!c.parentId) roots.push(c);
  }
  return roots.reverse();
}
