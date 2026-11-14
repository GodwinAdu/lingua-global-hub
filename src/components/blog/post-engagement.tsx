'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BadgeCheck, Eye, Heart, Loader2, MessageCircle, Reply, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type Comment = {
  id: string;
  parentId: string | null;
  authorName: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  replies: Comment[];
};

type State = {
  loading: boolean;
  views: number;
  likes: number;
  liked: boolean;
  commentCount: number;
  commentsEnabled: boolean;
  comments: Comment[];
};

type Ctx = State & { slug: string; toggleLike: () => void; liking: boolean; setComments: (c: Comment[]) => void };

const EngagementContext = createContext<Ctx | null>(null);
const useEngagement = () => {
  const ctx = useContext(EngagementContext);
  if (!ctx) throw new Error('useEngagement must be used inside <PostEngagementProvider>');
  return ctx;
};

const countComments = (list: Comment[]) => list.reduce((n, c) => n + 1 + c.replies.length, 0);
const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/** Loads live counts/comments for a post and records one view per visit. */
export function PostEngagementProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [state, setState] = useState<State>({
    loading: true, views: 0, likes: 0, liked: false, commentCount: 0, commentsEnabled: true, comments: [],
  });
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Count the view first so the visitor's own view is included in the number they see.
      await fetch(`/api/posts/${slug}/view`, { method: 'POST' }).catch(() => {});
      const res = await fetch(`/api/posts/${slug}/engagement`, { cache: 'no-store' }).catch(() => null);
      if (!res?.ok || cancelled) return setState((s) => ({ ...s, loading: false }));
      const data = await res.json();
      if (!cancelled) setState({ ...data, loading: false });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const toggleLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);
    // Optimistic update, corrected by the server's answer.
    setState((s) => ({ ...s, liked: !s.liked, likes: s.likes + (s.liked ? -1 : 1) }));
    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: 'POST' });
      if (res.ok) {
        const { liked, likes } = await res.json();
        setState((s) => ({ ...s, liked, likes }));
      } else {
        setState((s) => ({ ...s, liked: !s.liked, likes: s.likes + (s.liked ? -1 : 1) }));
      }
    } finally {
      setLiking(false);
    }
  }, [slug, liking]);

  const setComments = useCallback(
    (comments: Comment[]) => setState((s) => ({ ...s, comments, commentCount: countComments(comments) })),
    [],
  );

  return (
    <EngagementContext.Provider value={{ ...state, slug, toggleLike, liking, setComments }}>{children}</EngagementContext.Provider>
  );
}

/** Thin bar at the top of the window showing how far down the article the reader is. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-secondary to-accent"
      style={{ scaleX }}
    />
  );
}

/** Like button with views and comment counts. */
export function EngagementBar() {
  const { loading, likes, liked, views, commentCount, commentsEnabled, toggleLike, liking } = useEngagement();
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <motion.button
        type="button"
        onClick={toggleLike}
        disabled={loading || liking}
        whileTap={{ scale: 0.9 }}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
          liked ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-border text-foreground hover:bg-muted',
        )}
      >
        <motion.span key={String(liked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
          <Heart className={cn('h-5 w-5', liked && 'fill-rose-500 text-rose-500')} />
        </motion.span>
        {liked ? 'Liked' : 'Like'}
        <span className="tabular-nums text-muted-foreground">{loading ? '–' : compact(likes)}</span>
      </motion.button>
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span className="tabular-nums">{loading ? '–' : compact(views)}</span> {views === 1 ? 'view' : 'views'}
      </span>
      {commentsEnabled && (
        <a href="#comments" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="tabular-nums">{loading ? '–' : commentCount}</span> {commentCount === 1 ? 'comment' : 'comments'}
        </a>
      )}
    </div>
  );
}

const timeAgo = (iso: string) => {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (s < 60) return 'just now';
  if (s < 3600) return rtf.format(-Math.round(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
  if (s < 86400 * 30) return rtf.format(-Math.round(s / 86400), 'day');
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const SAVED_KEY = 'fgl-commenter';

/** Comment form. Name and email are remembered in this browser for next time. */
function CommentForm({ parentId, onDone, compactForm }: { parentId?: string; onDone?: () => void; compactForm?: boolean }) {
  const { slug, setComments } = useEngagement();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [sending, setSending] = useState(false);
  const startedAt = useRef(0);

  // One-time read of browser-only storage after mount (reading it during render would
  // mismatch the server-rendered HTML).
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '{}');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from localStorage once
      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
    } catch {}
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, body, parentId, website, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError({ message: data.error ?? 'Something went wrong.', field: data.field });
      localStorage.setItem(SAVED_KEY, JSON.stringify({ name, email }));
      setComments(data.comments);
      setBody('');
      onDone?.();
    } catch {
      setError({ message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  }

  const id = parentId ? `reply-${parentId}` : 'comment';
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div className={cn('grid gap-3', compactForm ? 'sm:grid-cols-2' : 'sm:grid-cols-2')}>
        <div>
          <label htmlFor={`${id}-name`} className="sr-only">Name</label>
          <Input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} required aria-invalid={error?.field === 'name'} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="sr-only">Email</label>
          <Input id={`${id}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (not shown)" maxLength={254} required aria-invalid={error?.field === 'email'} />
        </div>
      </div>
      <label htmlFor={`${id}-body`} className="sr-only">Comment</label>
      <Textarea
        id={`${id}-body`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? 'Write a reply…' : 'Share your thoughts…'}
        rows={compactForm ? 3 : 4}
        maxLength={3000}
        required
        aria-invalid={error?.field === 'body'}
      />
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Be kind. Your email is never published.</p>
        <div className="flex gap-2">
          {onDone && (
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {parentId ? 'Reply' : 'Post comment'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({ comment, isReply }: { comment: Comment; isReply?: boolean }) {
  const [replying, setReplying] = useState(false);
  const initials = comment.authorName.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <li className={cn('flex gap-3', isReply && 'mt-4')} id={`comment-${comment.id}`}>
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          comment.isStaff ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
        aria-hidden
      >
        {comment.isStaff ? 'FG' : initials || '?'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-foreground">{comment.authorName}</span>
          {comment.isStaff && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
              <BadgeCheck className="h-3.5 w-3.5" /> First Grade Lingua
            </span>
          )}
          <time dateTime={comment.createdAt} className="text-xs text-muted-foreground" suppressHydrationWarning>
            {timeAgo(comment.createdAt)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-line break-words text-foreground/85">{comment.body}</p>
        {!isReply && (
          <button
            type="button"
            onClick={() => setReplying((r) => !r)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Reply className="h-4 w-4" /> Reply
          </button>
        )}
        {replying && (
          <div className="mt-3">
            <CommentForm parentId={comment.id} onDone={() => setReplying(false)} compactForm />
          </div>
        )}
        {comment.replies.length > 0 && (
          <ul className="border-l-2 border-border pl-4">
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} isReply />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function CommentsSection() {
  const { loading, commentsEnabled, comments, commentCount } = useEngagement();
  if (!loading && !commentsEnabled) {
    return (
      <section id="comments" className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Comments are closed for this article.
      </section>
    );
  }
  return (
    <section id="comments" className="mt-12 scroll-mt-28" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="mb-6 flex items-center gap-2 font-display text-2xl font-bold">
        <MessageCircle className="h-6 w-6" />
        {loading ? 'Comments' : `${commentCount} ${commentCount === 1 ? 'Comment' : 'Comments'}`}
      </h2>
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <CommentForm />
      </div>
      {loading ? (
        <div className="mt-6 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="mt-6 text-center text-muted-foreground">Be the first to comment.</p>
      ) : (
        <ul className="mt-8 space-y-8">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}
    </section>
  );
}
