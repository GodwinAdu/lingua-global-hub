'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { GalleryField, ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import { slugify } from '@/lib/content/html';
import { POST_LANGUAGES } from '@/lib/content/types';
import { deletePost, savePost } from './actions';
import { StatusBadge, type PostStatus } from './status-badge';

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  gallery_urls: string[];
  category_id: string;
  language: string;
  tags: string;
  author_name: string;
  author_title: string;
  seo_title: string;
  seo_description: string;
  status: PostStatus;
};

type Props = {
  initial: PostFormValues;
  categories: { id: number; label: string }[];
  canPublish: boolean;
  canDelete: boolean;
  savedMessage?: string;
};

export function PostForm({ initial, categories, canPublish, canDelete, savedMessage }: Props) {
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [state, formAction] = useActionState(savePost, undefined);
  const [deleting, startDelete] = useTransition();

  const set = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  useEffect(() => {
    if (savedMessage) toast.success(savedMessage);
  }, [savedMessage]);

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  // Status comes from the server (refreshed after each save), not local state.
  const status = initial.status;
  const err = state?.fieldErrors ?? {};
  const isPublished = status === 'published';
  const locked = isPublished && !canPublish; // authors can't edit live posts

  function onDelete() {
    if (!values.id) return;
    startDelete(async () => {
      const result = await deletePost(values.id!);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={values.id ?? ''} />
      <input type="hidden" name="content" value={values.content} />
      <input type="hidden" name="cover_image_url" value={values.cover_image_url} />
      <input type="hidden" name="gallery_urls" value={JSON.stringify(values.gallery_urls)} />
      <input type="hidden" name="category_id" value={values.category_id} />
      <input type="hidden" name="language" value={values.language} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="h-4 w-4" /> Posts
            </Link>
          </Button>
          <StatusBadge status={status} />
          {isPublished && (
            <Link
              href={`/blog/${values.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View live <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <Actions status={status} canPublish={canPublish} locked={locked} />
      </div>

      {locked && (
        <p className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
          This post is live. Only editors can change it.
        </p>
      )}

      <fieldset disabled={locked} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={values.title}
              maxLength={200}
              className="h-12 text-lg"
              aria-invalid={Boolean(err.title)}
              onChange={(e) => {
                set('title', e.target.value);
                if (!slugTouched) set('slug', slugify(e.target.value));
              }}
            />
            <FieldError message={err.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Summary</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={values.excerpt}
              maxLength={500}
              rows={3}
              placeholder="One or two sentences shown on the blog page and in search results."
              aria-invalid={Boolean(err.excerpt)}
              onChange={(e) => set('excerpt', e.target.value)}
            />
            <FieldError message={err.excerpt} />
          </div>

          <div className="space-y-2">
            <Label>Article</Label>
            <RichTextEditor value={values.content} onChange={(html) => set('content', html)} />
            <FieldError message={err.content} />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={values.category_id || 'none'} onValueChange={(v) => set('category_id', v === 'none' ? '' : v)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={values.language} onValueChange={(v) => set('language', v)}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={err.language} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={values.tags}
                  placeholder="Comma separated"
                  onChange={(e) => set('tags', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL</Label>
                <div className="flex items-center rounded-md border bg-muted/40 pl-3 text-sm text-muted-foreground">
                  /blog/
                  <Input
                    id="slug"
                    name="slug"
                    value={values.slug}
                    className="border-0 bg-transparent pl-0.5 shadow-none focus-visible:ring-0"
                    aria-invalid={Boolean(err.slug)}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }}
                  />
                </div>
                <FieldError message={err.slug} />
                {isPublished && <p className="text-xs text-muted-foreground">Changing the URL breaks links already shared.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cover image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageField value={values.cover_image_url} onChange={(url) => set('cover_image_url', url)} folder="posts" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryField value={values.gallery_urls} onChange={(urls) => set('gallery_urls', urls)} folder="posts" />
              <p className="mt-2 text-xs text-muted-foreground">Shown below the article.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Author shown on the site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Name</Label>
                <Input id="author_name" name="author_name" value={values.author_name} maxLength={120} onChange={(e) => set('author_name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_title">Title</Label>
                <Input id="author_title" name="author_title" value={values.author_title} maxLength={120} placeholder="e.g. Reporter" onChange={(e) => set('author_title', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Search engines (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO title</Label>
                <Input id="seo_title" name="seo_title" value={values.seo_title} maxLength={200} placeholder={values.title} onChange={(e) => set('seo_title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO description</Label>
                <Textarea id="seo_description" name="seo_description" value={values.seo_description} maxLength={300} rows={3} placeholder={values.excerpt} onChange={(e) => set('seo_description', e.target.value)} />
                <p className="text-xs text-muted-foreground">{values.seo_description.length}/160 recommended</p>
              </div>
            </CardContent>
          </Card>

          {values.id && canDelete && !locked && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full text-destructive hover:text-destructive" disabled={deleting}>
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete post
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {isPublished ? 'It will be removed from the website. ' : ''}This can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function Actions({ status, canPublish, locked }: { status: PostStatus; canPublish: boolean; locked: boolean }) {
  if (locked) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {status === 'published' ? (
        <>
          <SubmitButton name="intent" value="unpublish" variant="outline" pendingText="Saving…">
            Unpublish
          </SubmitButton>
          <SubmitButton name="intent" value="publish" pendingText="Updating…">
            Update
          </SubmitButton>
        </>
      ) : (
        <>
          <SubmitButton name="intent" value="draft" variant="outline" pendingText="Saving…">
            Save draft
          </SubmitButton>
          {canPublish ? (
            <SubmitButton name="intent" value="publish" pendingText="Publishing…">
              Publish
            </SubmitButton>
          ) : (
            status !== 'review' && (
              <SubmitButton name="intent" value="review" pendingText="Submitting…">
                Submit for review
              </SubmitButton>
            )
          )}
        </>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

