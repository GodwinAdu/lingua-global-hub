import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, ExternalLink, MessageSquare } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CommentActions } from './comment-row';

export const metadata: Metadata = { title: 'Comments' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

const TABS = [
  { id: 'visible', label: 'On the site' },
  { id: 'hidden', label: 'Hidden' },
] as const;

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' });

type Row = {
  id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  body: string;
  status: 'visible' | 'hidden';
  is_staff: boolean;
  created_at: string;
  post: { title: string; slug: string } | null;
};

export default async function CommentsPage({ searchParams }: PageProps<'/admin/comments'>) {
  const [user, query] = await Promise.all([requireStaff('editor'), searchParams]);
  const tab = query.tab === 'hidden' ? 'hidden' : 'visible';
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';
  const canModerate = hasRole(user.role, 'admin');

  const supabase = await createClient();
  let request = supabase
    .from('comments')
    .select('id, parent_id, author_name, author_email, body, status, is_staff, created_at, post:posts(title, slug)')
    .eq('status', tab)
    .order('created_at', { ascending: false })
    .limit(200);
  if (q) {
    const safe = q.replace(/[%_,()\\]/g, '');
    request = request.or(`body.ilike.%${safe}%,author_name.ilike.%${safe}%,author_email.ilike.%${safe}%`);
  }
  const [{ data, error }, { count: hiddenCount }] = await Promise.all([
    request.returns<Row[]>(),
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'hidden'),
  ]);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comments</h1>
        <p className="text-muted-foreground">
          Comments appear on the site straight away.{' '}
          {canModerate ? 'Hide or delete anything inappropriate.' : 'Admins can hide or delete comments.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-1 rounded-lg bg-muted p-1">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={{ pathname: '/admin/comments', query: { ...(t.id !== 'visible' && { tab: t.id }), ...(q && { q }) } }}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground', tab === t.id && 'bg-background text-foreground shadow-sm')}
            >
              {t.label}
              {t.id === 'hidden' && (hiddenCount ?? 0) > 0 && <span className="ml-1.5 text-xs">({hiddenCount})</span>}
            </Link>
          ))}
        </nav>
        <form className="w-full sm:w-72">
          {tab !== 'visible' && <input type="hidden" name="tab" value={tab} />}
          <Input name="q" defaultValue={q} placeholder="Search comments, names, emails…" />
        </form>
      </div>

      {error ? (
        <p className="text-destructive">Could not load comments: {error.message}</p>
      ) : !data?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <MessageSquare className="h-8 w-8" />
          {q ? 'No comments match.' : tab === 'hidden' ? 'No hidden comments.' : 'No comments yet.'}
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {data.map((c) => (
            <li key={c.id} className="space-y-2 p-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-semibold">{c.author_name}</span>
                {c.is_staff && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3 w-3" /> Staff
                  </Badge>
                )}
                {c.parent_id && <Badge variant="outline">Reply</Badge>}
                <span className="text-muted-foreground">{c.author_email}</span>
                <span className="text-muted-foreground">· {when(c.created_at)}</span>
              </div>
              <p className="whitespace-pre-line break-words">{c.body}</p>
              {c.post && (
                <Link href={`/blog/${c.post.slug}#comments`} target="_blank" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  on “{c.post.title}” <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              <CommentActions id={c.id} hidden={c.status === 'hidden'} canModerate={canModerate} canReply={!c.is_staff} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
