'use client';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import { SEO_LIMITS } from '@/lib/seo/pages';
import { cn } from '@/lib/utils';
import { shownTitle as titleInResults } from '@/lib/seo/og';
import { savePageSeo } from '../site/actions';

type Props = {
  pageKey: string;
  name: string;
  path: string;
  siteUrl: string;
  defaults: { title: string; description: string };
  initial: { title: string; description: string; image_url: string };
};

/** One page's search listing: title, description, share image, with a Google-style preview. */
export function PageSeoForm({ pageKey, name, path, siteUrl, defaults, initial }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [image, setImage] = useState(initial.image_url);
  const [state, action] = useActionState(savePageSeo, undefined);
  const err = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  const shownTitle = titleInResults(title || defaults.title);
  const shownDescription = description || defaults.description;
  const host = siteUrl.replace(/^https?:\/\//, '');
  const id = (f: string) => `seo-${pageKey}-${f}`;

  return (
    <Card id={pageKey}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          {name}
          <a href={path} target="_blank" rel="noreferrer" className="text-sm font-normal text-muted-foreground hover:text-foreground">
            {path}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <input type="hidden" name="key" value={pageKey} />
          <input type="hidden" name="image_url" value={image} />
          <div className="space-y-4">
            {/* Google result preview */}
            <div className="rounded-lg border bg-background p-4" aria-label="Google preview">
              <div className="truncate text-xs text-muted-foreground">
                {host}
                {path === '/' ? '' : ` › ${path.slice(1)}`}
              </div>
              <div className="mt-1 line-clamp-1 text-lg text-[#1a0dab]">{shownTitle}</div>
              <div className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{shownDescription}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={id('title')}>Page title</Label>
                <Counter value={title} ideal={60} max={SEO_LIMITS.title} />
              </div>
              <Input id={id('title')} name="title" value={title} maxLength={SEO_LIMITS.title} placeholder={defaults.title} onChange={(e) => setTitle(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Put the main search words first, e.g. &ldquo;Twi Translation Services in Accra&rdquo;. Leave empty for the default.
              </p>
              {err.title && <p className="text-sm text-destructive">{err.title}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={id('description')}>Description</Label>
                <Counter value={description} ideal={155} max={SEO_LIMITS.description} />
              </div>
              <Textarea
                id={id('description')}
                name="description"
                rows={3}
                value={description}
                maxLength={SEO_LIMITS.description}
                placeholder={defaults.description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Shown under the title in Google and in shared links. Say what you offer and where.</p>
              {err.description && <p className="text-sm text-destructive">{err.description}</p>}
            </div>
            <SubmitButton pendingText="Saving…">Save {name}</SubmitButton>
          </div>

          <div className="space-y-2">
            <Label>Share image</Label>
            <ImageField value={image} onChange={setImage} folder="seo" aspect="aspect-[1200/630]" label="Upload 1200×630 image" />
            <p className="text-xs text-muted-foreground">Shown when the page is shared on WhatsApp, Facebook or LinkedIn. Without one, a branded card is generated.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Counter({ value, ideal, max }: { value: string; ideal: number; max: number }) {
  const n = value.length;
  return (
    <span className={cn('text-xs tabular-nums', n === 0 ? 'text-muted-foreground' : n > ideal ? 'text-amber-600' : 'text-green-700')}>
      {n === 0 ? 'using default' : `${n}/${max}${n > ideal ? ' · may be cut off' : ''}`}
    </span>
  );
}
