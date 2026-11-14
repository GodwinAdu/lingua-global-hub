import { after } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { findPublishedPost, ipHash, isBot } from '@/lib/engagement/server';
import { getVisibleComments } from '@/lib/engagement/comments';
import { isSameOrigin, json } from '@/lib/engagement/http';
import { escapeHtml, sendMail } from '@/lib/mail';
import { absoluteUrl } from '@/lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LINKS = 2;

/**
 * Post a comment. Comments are published immediately (admins can hide or delete them),
 * so spam is stopped here: honeypot, minimum fill time, link cap, duplicates and rate limits.
 */
export async function POST(request: Request, { params }: RouteContext<'/api/posts/[slug]/comments'>) {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (await isBot()) return json({ error: 'Forbidden' }, 403);

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(input.name).replace(/\s+/g, ' ');
  const email = str(input.email).toLowerCase();
  const body = str(input.body).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  const parentId = str(input.parentId) || null;
  const startedAt = Number(input.startedAt);

  // Bots fill the hidden "website" field, or submit faster than a person can type.
  if (str(input.website) || !Number.isFinite(startedAt) || Date.now() - startedAt < 3000) {
    return json({ error: 'Please try again.' }, 400);
  }
  if (!name || name.length > 80) return json({ error: 'Enter your name (up to 80 characters).', field: 'name' }, 400);
  if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: 'Enter a valid email address.', field: 'email' }, 400);
  if (body.length < 2 || body.length > 3000) return json({ error: 'Write a comment (up to 3000 characters).', field: 'body' }, 400);
  if ((body.match(/https?:\/\/|www\./gi) ?? []).length > MAX_LINKS) {
    return json({ error: `Please include no more than ${MAX_LINKS} links.`, field: 'body' }, 400);
  }
  if (parentId && !/^[0-9a-f-]{36}$/i.test(parentId)) return json({ error: 'Invalid reply.' }, 400);

  const { slug } = await params;
  const post = await findPublishedPost(slug);
  if (!post) return json({ error: 'Not found' }, 404);
  if (!post.comments_enabled) return json({ error: 'Comments are closed on this post.' }, 403);

  const db = createAdminClient();
  const ip = await ipHash();
  const since = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

  const [byIp, byEmail, duplicate] = await Promise.all([
    db.from('comments').select('id', { count: 'exact', head: true }).eq('ip_hash', ip).gte('created_at', since(10)),
    db.from('comments').select('id', { count: 'exact', head: true }).eq('author_email', email).gte('created_at', since(24 * 60)),
    db.from('comments').select('id').eq('post_id', post.id).eq('author_email', email).eq('body', body).gte('created_at', since(60)).limit(1),
  ]);
  if ((byIp.count ?? 0) >= 5 || (byEmail.count ?? 0) >= 20) {
    return json({ error: "You're commenting too quickly. Please wait a few minutes." }, 429);
  }
  if (duplicate.data?.length) return json({ error: "You've already posted this comment." }, 409);

  const { error } = await db.from('comments').insert({
    post_id: post.id,
    parent_id: parentId,
    author_name: name,
    author_email: email,
    body,
    ip_hash: ip,
  });
  if (error) {
    if (error.message.includes('Invalid parent')) return json({ error: 'You can only reply to a comment on this post.' }, 400);
    console.error('Comment insert failed:', error);
    return json({ error: 'Could not post your comment. Please try again.' }, 500);
  }

  // Let the team know after responding (after() keeps serverless functions alive for it).
  after(() =>
    notifyTeam({ postTitle: post.title, postSlug: post.slug, name, body, isReply: Boolean(parentId) }).catch((e) =>
      console.error('Comment notification failed:', e),
    ),
  );

  return json({ ok: true, comments: await getVisibleComments(post.id) }, 201);
}

async function notifyTeam(c: { postTitle: string; postSlug: string; name: string; body: string; isReply: boolean }) {
  const { data: settings } = await createAdminClient().from('site_settings').select('email').eq('id', 1).maybeSingle();
  const to = process.env.EMAIL_TO || settings?.email;
  if (!to) return;
  await sendMail({
    to,
    subject: `New ${c.isReply ? 'reply' : 'comment'} on "${c.postTitle}"`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px">
      <p><strong>${escapeHtml(c.name)}</strong> ${c.isReply ? 'replied' : 'commented'} on <a href="${absoluteUrl(`/blog/${c.postSlug}`)}">${escapeHtml(c.postTitle)}</a>:</p>
      <blockquote style="border-left:3px solid #1e3a8a;margin:0;padding:8px 12px;background:#f5f7fb">${escapeHtml(c.body).replace(/\n/g, '<br>')}</blockquote>
      <p style="font-size:13px;color:#666">It's already live. To hide or delete it: <a href="${absoluteUrl('/admin/comments')}">Dashboard → Comments</a>.</p>
    </div>`,
  });
}
