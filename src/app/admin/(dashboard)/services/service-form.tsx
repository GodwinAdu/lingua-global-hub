'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import { getIcon, ICON_NAMES } from '@/lib/content/icons';
import { slugify } from '@/lib/content/html';
import type { ServiceDetail, ServiceStat } from '@/lib/content/site-types';
import { saveService } from '../site/actions';

export type ServiceFormValues = {
  id?: number;
  slug: string;
  icon: string;
  title: string;
  card_title: string;
  card_description: string;
  summary: string;
  subtitle: string;
  description: string;
  image_url: string;
  features: string;
  stats: ServiceStat[];
  details: ServiceDetail[];
};

export function ServiceForm({ initial, savedMessage }: { initial: ServiceFormValues; savedMessage?: string }) {
  const [v, setV] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [state, action] = useActionState(saveService, undefined);
  const set = <K extends keyof ServiceFormValues>(k: K, value: ServiceFormValues[K]) => setV((p) => ({ ...p, [k]: value }));
  const err = state?.fieldErrors ?? {};

  useEffect(() => {
    if (savedMessage) toast.success(savedMessage);
  }, [savedMessage]);
  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  const setStat = (i: number, patch: Partial<ServiceStat>) =>
    set('stats', v.stats.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const setDetail = (i: number, patch: Partial<ServiceDetail>) =>
    set('details', v.details.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  return (
    <form action={action} className="max-w-5xl space-y-6">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      <input type="hidden" name="icon" value={v.icon} />
      <input type="hidden" name="image_url" value={v.image_url} />
      <input type="hidden" name="stats" value={JSON.stringify(v.stats)} />
      <input type="hidden" name="details" value={JSON.stringify(v.details)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4" /> Services
            </Link>
          </Button>
          {v.id && (
            <Link href={`/services/${initial.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View on site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <SubmitButton pendingText="Saving…">{v.id ? 'Save changes' : 'Create service'}</SubmitButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service page</CardTitle>
              <CardDescription>The top of /services/{v.slug || '…'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Title" error={err.title}>
                <Input
                  name="title"
                  value={v.title}
                  maxLength={120}
                  required
                  onChange={(e) => {
                    set('title', e.target.value);
                    if (!slugTouched) set('slug', slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Subtitle" error={err.subtitle}>
                <Input name="subtitle" value={v.subtitle} maxLength={200} onChange={(e) => set('subtitle', e.target.value)} />
              </Field>
              <Field label="Introduction" error={err.description}>
                <Textarea name="description" value={v.description} maxLength={2000} rows={4} onChange={(e) => set('description', e.target.value)} />
              </Field>
              <Field label="What's included" hint="One item per line." error={err.features}>
                <Textarea name="features" value={v.features} rows={6} onChange={(e) => set('features', e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Key numbers</CardTitle>
                <CardDescription>e.g. &ldquo;50+ Languages&rdquo;. Up to 8.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={v.stats.length >= 8} onClick={() => set('stats', [...v.stats, { value: '', label: '', icon: 'Award' }])}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {v.stats.map((s, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr_150px_auto] gap-2">
                  <Input value={s.value} placeholder="50+" maxLength={20} aria-label="Value" onChange={(e) => setStat(i, { value: e.target.value })} />
                  <Input value={s.label} placeholder="Languages" maxLength={60} aria-label="Label" onChange={(e) => setStat(i, { label: e.target.value })} />
                  <IconSelect value={s.icon} onChange={(icon) => setStat(i, { icon })} />
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove" onClick={() => set('stats', v.stats.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {v.stats.length === 0 && <p className="text-sm text-muted-foreground">None.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Detail sections</CardTitle>
                <CardDescription>Headed paragraphs further down the page.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={v.details.length >= 12} onClick={() => set('details', [...v.details, { title: '', content: '' }])}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {v.details.map((d, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3">
                  <div className="flex gap-2">
                    <Input value={d.title} placeholder="Heading" maxLength={120} aria-label="Heading" onChange={(e) => setDetail(i, { title: e.target.value })} />
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove section" onClick={() => set('details', v.details.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea value={d.content} placeholder="Paragraph" maxLength={1500} rows={3} aria-label="Paragraph" onChange={(e) => setDetail(i, { content: e.target.value })} />
                </div>
              ))}
              {v.details.length === 0 && <p className="text-sm text-muted-foreground">None.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Image and icon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageField value={v.image_url} onChange={(url) => set('image_url', url)} folder="services" />
              <Field label="Icon" error={err.icon}>
                <IconSelect value={v.icon} onChange={(icon) => set('icon', icon)} />
              </Field>
              <Field label="URL" error={err.slug}>
                <div className="flex items-center rounded-md border bg-muted/40 pl-3 text-sm text-muted-foreground">
                  /services/
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Home page card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Card title" hint="Short name, e.g. Translation." error={err.card_title}>
                <Input name="card_title" value={v.card_title} maxLength={80} placeholder={v.title} onChange={(e) => set('card_title', e.target.value)} />
              </Field>
              <Field label="Card text" error={err.card_description}>
                <Textarea name="card_description" value={v.card_description} maxLength={400} rows={4} onChange={(e) => set('card_description', e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Services page summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Field label="Summary" hint="Also used for Google." error={err.summary}>
                <Textarea name="summary" value={v.summary} maxLength={400} rows={4} onChange={(e) => set('summary', e.target.value)} />
              </Field>
            </CardContent>
          </Card>
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

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label="Icon">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ICON_NAMES.map((name) => {
          const Icon = getIcon(name);
          return (
            <SelectItem key={name} value={name}>
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" /> {name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
