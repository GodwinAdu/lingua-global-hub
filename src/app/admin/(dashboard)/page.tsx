import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Eye, FilePen, Heart, MessageSquare, Plus, ShieldAlert, Users } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { hasRole, ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, type PostStatus } from './posts/status-badge';

export const metadata: Metadata = { title: 'Overview' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function DashboardPage({ searchParams }: PageProps<'/admin'>) {
  const [user, params] = await Promise.all([requireStaff(), searchParams]);
  const isEditor = hasRole(user.role, 'editor');
  const supabase = await createClient();

  // Counts respect RLS; authors count only their own work.
  const count = (status: PostStatus) => {
    let q = supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', status);
    if (!isEditor) q = q.eq('author_id', user.id);
    return q;
  };
  let recentQuery = supabase
    .from('posts')
    .select('id, title, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);
  if (!isEditor) recentQuery = recentQuery.eq('author_id', user.id);

  const [published, review, drafts, recent, engagement] = await Promise.all([
    count('published'),
    count('review'),
    count('draft'),
    recentQuery,
    isEditor ? loadEngagement(supabase) : Promise.resolve(null),
  ]);

  const firstName = user.fullName?.split(' ')[0];
  const stats = [
    { label: 'Published', value: published.count ?? 0, href: '/admin/posts?status=published' },
    { label: isEditor ? 'Waiting for review' : 'In review', value: review.count ?? 0, href: '/admin/posts?status=review' },
    { label: 'Drafts', value: drafts.count ?? 0, href: '/admin/posts?status=draft' },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {params.denied && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Not allowed</AlertTitle>
          <AlertDescription>Your role doesn&apos;t give you access to that page.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome{firstName ? `, ${firstName}` : ''}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            {ROLE_DESCRIPTIONS[user.role]}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> View website
            </a>
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4" /> New post
            </Link>
          </Button>
        </div>
      </div>

      {isEditor && (review.count ?? 0) > 0 && (
        <Alert>
          <FilePen className="h-4 w-4" />
          <AlertTitle>
            {review.count} post{review.count === 1 ? '' : 's'} waiting for review
          </AlertTitle>
          <AlertDescription>
            <Link href="/admin/posts?status=review" className="underline">
              Review and publish
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl">{s.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {engagement && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Readers · last 30 days</CardTitle>
            <CardDescription>
              {engagement.views30.toLocaleString()} views · {engagement.totals.likes.toLocaleString()} likes and{' '}
              {engagement.totals.comments.toLocaleString()} comments in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {engagement.top.length === 0 ? (
              <p className="text-sm text-muted-foreground">No views yet. Share a post to get started.</p>
            ) : (
              <ol className="divide-y">
                {engagement.top.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="w-5 text-muted-foreground tabular-nums">{i + 1}</span>
                    <Link href={`/admin/posts/${p.id}`} className="min-w-0 flex-1 truncate font-medium hover:underline">
                      {p.title}
                    </Link>
                    <span className="flex shrink-0 gap-3 tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views}</span>
                      <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes}</span>
                      <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{p.comments}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently edited</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.data && recent.data.length > 0 ? (
              <ul className="divide-y">
                {recent.data.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link href={`/admin/posts/${p.id}`} className="truncate font-medium hover:underline">
                      {p.title || 'Untitled'}
                    </Link>
                    <StatusBadge status={p.status as PostStatus} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing yet. Start with a new post.</p>
            )}
          </CardContent>
        </Card>

        {hasRole(user.role, 'super_admin') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team</CardTitle>
              <CardDescription>Add editors and authors, and control what they can do.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin/users">
                  <Users className="h-4 w-4" /> Users &amp; roles
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** 30-day views per post (grouped in the database) plus all-time likes and comments. */
async function loadEngagement(supabase: Supabase) {
  const [{ data: views }, { data: posts }] = await Promise.all([
    supabase.rpc('post_views_since', { days: 30 }),
    supabase.from('posts').select('id, title, like_count, comment_count').eq('status', 'published'),
  ]);
  const byId = new Map((posts ?? []).map((p) => [p.id, p]));
  const viewRows = (views ?? []) as { post_id: string; views: number }[];
  const top = viewRows
    .filter((v) => byId.has(v.post_id))
    .slice(0, 5)
    .map((v) => {
      const p = byId.get(v.post_id)!;
      return { id: p.id, title: p.title, views: Number(v.views), likes: p.like_count, comments: p.comment_count };
    });
  return {
    views30: viewRows.reduce((n, v) => n + Number(v.views), 0),
    totals: {
      likes: (posts ?? []).reduce((n, p) => n + p.like_count, 0),
      comments: (posts ?? []).reduce((n, p) => n + p.comment_count, 0),
    },
    top,
  };
}
