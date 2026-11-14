'use server';

import { refresh } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type CommentActionState = { error?: string; success?: string } | undefined;

const isId = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

/** Hide or show a comment (admins). Runs as the user, so RLS enforces the role too. */
export async function setCommentHidden(id: string, hidden: boolean): Promise<CommentActionState> {
  await requireStaff('admin');
  if (!isId(id)) return { error: 'Invalid comment.' };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('comments')
    .update({ status: hidden ? 'hidden' : 'visible' })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) return { error: "Couldn't update the comment. You may not have permission." };
  refresh();
  return { success: hidden ? 'Comment hidden from the website.' : 'Comment visible again.' };
}

/** Permanently delete a comment and its replies (admins). */
export async function deleteComment(id: string): Promise<CommentActionState> {
  await requireStaff('admin');
  if (!isId(id)) return { error: 'Invalid comment.' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('comments').delete().eq('id', id).select('id').maybeSingle();
  if (error || !data) return { error: "Couldn't delete the comment. You may not have permission." };
  refresh();
  return { success: 'Comment deleted.' };
}

/** Reply as the organisation, shown with a "First Grade Lingua" badge (editors and above). */
export async function replyAsStaff(_prev: CommentActionState, formData: FormData): Promise<CommentActionState> {
  const user = await requireStaff('editor');
  const parentId = String(formData.get('parentId') ?? '');
  const body = String(formData.get('body') ?? '').trim().replace(/\r\n/g, '\n');
  if (!isId(parentId)) return { error: 'Invalid comment.' };
  if (body.length < 2 || body.length > 3000) return { error: 'Write a reply (up to 3000 characters).' };

  const db = createAdminClient();
  const { data: parent } = await db.from('comments').select('id, post_id, parent_id').eq('id', parentId).maybeSingle();
  if (!parent) return { error: 'That comment no longer exists.' };

  const { error } = await db.from('comments').insert({
    post_id: parent.post_id,
    parent_id: parent.parent_id ?? parent.id, // replies stay one level deep
    author_name: user.fullName || 'First Grade Lingua',
    author_email: user.email,
    body,
    is_staff: true,
    staff_user_id: user.id,
  });
  if (error) {
    console.error('Staff reply failed:', error);
    return { error: "Couldn't post the reply." };
  }
  refresh();
  return { success: 'Reply posted.' };
}
