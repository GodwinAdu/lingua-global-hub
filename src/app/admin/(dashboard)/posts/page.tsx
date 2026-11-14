import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { hasRole } from '@/lib/roles';
import { createClient } from '@/lib/supabase/server';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { languageLabel } from '@/lib/content/types';
import { cn } from '@/lib/utils';
import { StatusBadge, type PostStatus } from './status-badge';

export const metadata: Metadata = { title: 'Posts & news' };

const TABS: { id: 'all' | PostStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'review', label: 'In review' },
  { id: 'draft', label: 'Drafts' },
];

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function PostsPage({ searchParams }: PageProps<'/admin/posts'>) {
  const [user, query] = await Promise.all([requireStaff('author'), searchParams]);
  const status = TABS.some((t) => t.id === query.status) ? (query.status as (typeof TABS)[number]['id']) : 'all';
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';
  const isEditor = hasRole(user.role, 'editor');

  const supabase = await createClient();
  let request = supabase
    .from('posts')
    .select('id, title, slug, status, language, author_name, author_id, updated_at, published_at, category:categories(label)')
    .order('updated_at', { ascending: false })
    .limit(200);
  if (status !== 'all') request = request.eq('status', status);
  // Authors manage their own posts; RLS would also show them published posts by others.
  if (!isEditor) request = request.eq('author_id', user.id);
  if (q) request = request.ilike('title', `%${q.replace(/[%_\\]/g, '\\$&')}%`);

  const { data: posts, error } = await request.returns<
    {
      id: string;
      title: string;
      slug: string;
      status: PostStatus;
      language: string;
      author_name: string;
      author_id: string | null;
      updated_at: string;
      published_at: string | null;
      category: { label: string } | null;
    }[]
  >();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Posts &amp; news</h1>
          <p className="text-muted-foreground">
            {isEditor ? 'Write, review and publish articles.' : 'Write articles and submit them for review.'}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" /> New post
          </Link>
        </Button>
      </div>

      {query.deleted && (
        <Alert>
          <AlertDescription>Post deleted.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-1 rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={{ pathname: '/admin/posts', query: { ...(tab.id !== 'all' && { status: tab.id }), ...(q && { q }) } }}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                status === tab.id && 'bg-background text-foreground shadow-sm',
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form className="w-full sm:w-64">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <Input name="q" defaultValue={q} placeholder="Search titles…" />
        </form>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>Could not load posts: {error.message}</AlertDescription>
        </Alert>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">{q || status !== 'all' ? 'No posts match.' : 'No posts yet.'}</p>
          <Button asChild variant="outline">
            <Link href="/admin/posts/new">Write the first one</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
                      {post.title || 'Untitled'}
                    </Link>
                    <div className="text-xs text-muted-foreground">{languageLabel(post.language)}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{post.category?.label ?? '—'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{post.author_name || '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={post.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                    {dateFmt(post.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
