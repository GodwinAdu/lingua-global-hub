'use client';

import { useActionState, useState, useTransition } from 'react';
import { Eye, EyeOff, Loader2, Reply, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/admin/submit-button';
import { deleteComment, replyAsStaff, setCommentHidden, type CommentActionState } from './actions';

export function CommentActions({
  id,
  hidden,
  canModerate,
  canReply,
}: {
  id: string;
  hidden: boolean;
  canModerate: boolean;
  canReply: boolean;
}) {
  const [pending, start] = useTransition();
  const [replying, setReplying] = useState(false);
  const run = (fn: () => Promise<CommentActionState>) =>
    start(async () => {
      const r = await fn();
      if (r?.error) toast.error(r.error);
      else if (r?.success) toast.success(r.success);
    });

  const [, replyAction] = useActionState(async (prev: CommentActionState, fd: FormData) => {
    const r = await replyAsStaff(prev, fd);
    if (r?.error) toast.error(r.error);
    if (r?.success) {
      toast.success(r.success);
      setReplying(false);
    }
    return r;
  }, undefined);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {canReply && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setReplying((v) => !v)}>
            <Reply className="h-4 w-4" /> Reply
          </Button>
        )}
        {canModerate && (
          <>
            <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => run(() => setCommentHidden(id, !hidden))}>
              {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {hidden ? 'Show' : 'Hide'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              className="text-destructive hover:text-destructive"
              onClick={() => {
                if (window.confirm('Delete this comment and any replies to it? This cannot be undone.')) run(() => deleteComment(id));
              }}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
            </Button>
          </>
        )}
      </div>
      {replying && (
        <form action={replyAction} className="space-y-2">
          <input type="hidden" name="parentId" value={id} />
          <Textarea name="body" rows={3} maxLength={3000} placeholder="Reply as First Grade Lingua…" required aria-label="Reply" />
          <div className="flex gap-2">
            <SubmitButton size="sm" pendingText="Posting…">
              Post reply
            </SubmitButton>
            <Button type="button" variant="ghost" size="sm" onClick={() => setReplying(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
