'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileUp, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/content/html';
import { POST_LANGUAGES } from '@/lib/content/types';
import { deleteEbook, saveEbook } from './actions';

const MAX_BYTES = 50 * 1024 * 1024;
const TYPES: Record<string, string> = { 'application/pdf': 'pdf', 'application/epub+zip': 'epub' };

export type EbookFormValues = {
  id?: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  cover_image_url: string;
  language: string;
  pages: string;
  price: string;
  is_published: boolean;
  file_path: string;
  file_name: string;
  file_size: string;
  file_type: string;
};

export function EbookForm({ initial, savedMessage, sales }: { initial: EbookFormValues; savedMessage?: string; sales?: number }) {
  const [v, setV] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [uploading, setUploading] = useState(false);
  const [deleting, startDelete] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, action] = useActionState(saveEbook, undefined);
  const set = <K extends keyof EbookFormValues>(k: K, value: EbookFormValues[K]) => setV((p) => ({ ...p, [k]: value }));
  const err = state?.fieldErrors ?? {};

  useEffect(() => {
    if (savedMessage) toast.success(savedMessage);
  }, [savedMessage]);
  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    // Some browsers report EPUB with an empty type.
    const type = file.type || (file.name.toLowerCase().endsWith('.epub') ? 'application/epub+zip' : '');
    if (!TYPES[type]) return toast.error('Upload a PDF or EPUB file.');
    if (file.size > MAX_BYTES) return toast.error('The file must be 50 MB or smaller.');

    setUploading(true);
    try {
      const path = `books/${new Date().getFullYear()}/${crypto.randomUUID()}.${TYPES[type]}`;
      const { error } = await createClient().storage.from('ebooks').upload(path, file, { contentType: type, upsert: false });
      if (error) throw error;
      setV((p) => ({ ...p, file_path: path, file_name: file.name.slice(0, 200), file_size: String(file.size), file_type: type }));
      toast.success('File uploaded. Save to keep it.');
    } catch (e) {
      toast.error(`Upload failed: ${e instanceof Error ? e.message : 'unknown error'}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const sizeLabel = v.file_size ? `${(Number(v.file_size) / (1024 * 1024)).toFixed(1)} MB` : '';

  return (
    <form action={action} className="max-w-5xl space-y-6">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      {(['cover_image_url', 'language', 'file_path', 'file_name', 'file_size', 'file_type'] as const).map((k) => (
        <input key={k} type="hidden" name={k} value={v[k]} />
      ))}
      <input type="hidden" name="is_published" value={v.is_published ? 'true' : 'false'} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/ebooks">
              <ArrowLeft className="h-4 w-4" /> Ebooks
            </Link>
          </Button>
          {v.id && initial.is_published && (
            <Link href={`/ebooks/${initial.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View on site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={v.is_published} onCheckedChange={(c) => set('is_published', c)} aria-label="Published" />
            {v.is_published ? 'Published' : 'Hidden'}
          </label>
          <SubmitButton pendingText="Saving…" disabled={uploading}>
            {v.id ? 'Save' : 'Create ebook'}
          </SubmitButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Field label="Title" error={err.title}>
                <Input
                  name="title"
                  value={v.title}
                  maxLength={200}
                  required
                  onChange={(e) => {
                    set('title', e.target.value);
                    if (!slugTouched) set('slug', slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Author" error={err.author}>
                <Input name="author" value={v.author} maxLength={160} onChange={(e) => set('author', e.target.value)} />
              </Field>
              <Field label="Description" hint="Blank lines start new paragraphs." error={err.description}>
                <Textarea name="description" value={v.description} maxLength={5000} rows={10} onChange={(e) => set('description', e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ebook file</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {v.file_path ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{v.file_name || 'Uploaded file'}</div>
                    <div className="text-xs text-muted-foreground">
                      {v.file_type === 'application/epub+zip' ? 'EPUB' : 'PDF'} {sizeLabel && `· ${sizeLabel}`} · stored privately
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />} Replace file
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-sm text-muted-foreground hover:bg-muted/50"
                >
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileUp className="h-6 w-6" />}
                  {uploading ? 'Uploading…' : 'Upload PDF or EPUB (max 50 MB)'}
                </button>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              {err.file_path && <p className="text-sm text-destructive">{err.file_path}</p>}
              <p className="text-xs text-muted-foreground">
                Buyers get a personal link that works for 30 days and 5 downloads. PDFs can also be read in the browser.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center rounded-md border pl-3 text-sm">
                <span className="text-muted-foreground">GHS</span>
                <Input
                  name="price"
                  inputMode="decimal"
                  value={v.price}
                  className="border-0 shadow-none focus-visible:ring-0"
                  onChange={(e) => set('price', e.target.value.replace(/[^\d.]/g, ''))}
                />
              </div>
              <p className="text-xs text-muted-foreground">0 makes it free (visitors only give their email).</p>
              {err.price && <p className="text-sm text-destructive">{err.price}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageField value={v.cover_image_url} onChange={(url) => set('cover_image_url', url)} folder="ebooks" aspect="aspect-[2/3]" label="Upload cover" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Language">
                <Select value={v.language} onValueChange={(val) => set('language', val)}>
                  <SelectTrigger>
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
              </Field>
              <Field label="Pages" error={err.pages}>
                <Input name="pages" inputMode="numeric" value={v.pages} onChange={(e) => set('pages', e.target.value.replace(/\D/g, ''))} />
              </Field>
              <Field label="URL" error={err.slug}>
                <div className="flex items-center rounded-md border bg-muted/40 pl-3 text-sm text-muted-foreground">
                  /ebooks/
                  <Input
                    name="slug"
                    value={v.slug}
                    className="border-0 bg-transparent pl-0.5 shadow-none focus-visible:ring-0"
                    onChange={(e) => {
                      setSlugTouched(true);
                      set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }}
                  />
                </div>
              </Field>
            </CardContent>
          </Card>

          {v.id && (
            <Button
              type="button"
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              disabled={deleting}
              onClick={() => {
                const warning = sales ? ` It has ${sales} order(s); their history is kept, but download links will stop working.` : '';
                if (!window.confirm(`Delete this ebook and its file?${warning}`)) return;
                startDelete(async () => {
                  const r = await deleteEbook(v.id!);
                  if (r?.error) toast.error(r.error);
                });
              }}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete ebook
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
