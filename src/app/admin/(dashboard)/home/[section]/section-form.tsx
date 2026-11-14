'use client';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import type { HomeField } from '@/lib/content/home';
import { saveHomeSection } from '../../site/actions';

/** Text and image fields for one home page section. */
export function SectionForm({ sectionKey, fields, values }: { sectionKey: string; fields: HomeField[]; values: Record<string, string> }) {
  const [state, action] = useActionState(saveHomeSection, undefined);
  const [images, setImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.filter((f) => f.type === 'image').map((f) => [f.name, values[f.name] ?? ''])),
  );
  const err = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Text</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="section" value={sectionKey} />
          {fields.map((f) => (
            <div key={f.name} className="space-y-2">
              <Label htmlFor={`home-${f.name}`}>{f.label}</Label>
              {f.type === 'image' ? (
                <>
                  <input type="hidden" name={f.name} value={images[f.name]} />
                  <ImageField
                    value={images[f.name]}
                    onChange={(url) => setImages((v) => ({ ...v, [f.name]: url }))}
                    folder="home"
                    className="max-w-md"
                  />
                </>
              ) : f.type === 'textarea' || f.type === 'lines' ? (
                <Textarea id={`home-${f.name}`} name={f.name} defaultValue={values[f.name] ?? ''} rows={f.type === 'lines' ? 6 : 4} maxLength={f.maxLength} />
              ) : (
                <Input id={`home-${f.name}`} name={f.name} defaultValue={values[f.name] ?? ''} maxLength={f.maxLength} />
              )}
              {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
              {err[f.name] && <p className="text-sm text-destructive">{err[f.name]}</p>}
            </div>
          ))}
          <SubmitButton pendingText="Saving…">Save text</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
