'use client';

import { useActionState, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageField } from '@/components/admin/image-field';
import { SubmitButton } from '@/components/admin/submit-button';
import { saveSimpleItem, type ActionState } from './actions';

export type FieldDef = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'image' | 'email' | 'url';
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  required?: boolean;
};

/** Add/edit dialog for small content types (team, portfolio, testimonials). */
export function SimpleItemDialog({
  table,
  title,
  fields,
  initial,
  imageFolder = 'site',
}: {
  table: 'team_members' | 'portfolio_items' | 'testimonials';
  title: string;
  fields: FieldDef[];
  initial?: { id: number } & Record<string, string>;
  imageFolder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.filter((f) => f.type === 'image').map((f) => [f.name, initial?.[f.name] ?? ''])),
  );
  const [state, action] = useActionState(async (prev: ActionState, fd: FormData) => {
    const result = await saveSimpleItem(prev, fd);
    if (result?.success) {
      toast.success(result.success);
      setOpen(false);
    } else if (result?.error) {
      toast.error(result.error);
    }
    return result;
  }, undefined);
  const errors = state?.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initial ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${title}`}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" /> Add {title.toLowerCase()}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? `Edit ${title.toLowerCase()}` : `Add ${title.toLowerCase()}`}</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="table" value={table} />
          {initial && <input type="hidden" name="id" value={initial.id} />}
          {fields.map((f) => {
            const id = `${table}-${initial?.id ?? 'new'}-${f.name}`;
            return (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={id}>
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </Label>
                {f.type === 'image' ? (
                  <>
                    <input type="hidden" name={f.name} value={images[f.name]} />
                    <ImageField
                      value={images[f.name]}
                      onChange={(url) => setImages((v) => ({ ...v, [f.name]: url }))}
                      folder={imageFolder}
                      aspect="aspect-[4/3] max-w-[240px]"
                    />
                  </>
                ) : f.type === 'textarea' ? (
                  <Textarea id={id} name={f.name} defaultValue={initial?.[f.name] ?? ''} maxLength={f.maxLength} rows={4} placeholder={f.placeholder} required={f.required} />
                ) : (
                  <Input
                    id={id}
                    name={f.name}
                    type={f.type === 'email' ? 'email' : f.type === 'url' ? 'url' : 'text'}
                    defaultValue={initial?.[f.name] ?? ''}
                    maxLength={f.maxLength}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                )}
                {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
                {errors[f.name] && <p className="text-sm text-destructive">{errors[f.name]}</p>}
              </div>
            );
          })}
          <SubmitButton className="w-full" pendingText="Saving…">
            Save
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
