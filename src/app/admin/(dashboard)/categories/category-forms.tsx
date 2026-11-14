'use client';

import { useActionState, useRef, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/admin/submit-button';
import { deleteCategory, saveCategory, type CategoryState } from './actions';

type Category = { id: number; slug: string; label: string; label_twi: string | null; sort_order: number; posts: number };

function useSave(onSuccess?: () => void) {
  return useActionState(async (prev: CategoryState, fd: FormData) => {
    const result = await saveCategory(prev, fd);
    if (result?.error) toast.error(result.error);
    if (result?.success) {
      toast.success(result.success);
      onSuccess?.();
    }
    return result;
  }, undefined);
}

export function CategoryRow({ category }: { category: Category }) {
  const [, action] = useSave();
  const [deleting, startDelete] = useTransition();

  function onDelete() {
    const note = category.posts ? ` ${category.posts} post(s) will become uncategorised.` : '';
    if (!window.confirm(`Delete "${category.label}"?${note}`)) return;
    startDelete(async () => {
      const result = await deleteCategory(category.id);
      if (result?.error) toast.error(result.error);
      else toast.success('Category deleted.');
    });
  }

  return (
    <form action={action} className="grid grid-cols-[1fr_1fr_80px_auto] items-center gap-2 border-b px-4 py-3 last:border-0">
      <input type="hidden" name="id" value={category.id} />
      <div>
        <Input name="label" defaultValue={category.label} aria-label="Name" required maxLength={60} />
        <p className="mt-1 text-xs text-muted-foreground">
          /{category.slug} · {category.posts} post{category.posts === 1 ? '' : 's'}
        </p>
      </div>
      <Input name="label_twi" defaultValue={category.label_twi ?? ''} aria-label="Twi name" maxLength={60} className="self-start" />
      <Input name="sort_order" type="number" defaultValue={category.sort_order} aria-label="Order" className="self-start" />
      <div className="flex gap-1 self-start">
        <SubmitButton variant="outline" size="sm" pendingText="…">
          Save
        </SubmitButton>
        <Button type="button" variant="ghost" size="sm" onClick={onDelete} disabled={deleting} aria-label={`Delete ${category.label}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export function NewCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [, action] = useSave(() => formRef.current?.reset());
  return (
    <form ref={formRef} action={action} className="grid grid-cols-[1fr_1fr_80px_auto] items-start gap-2 p-4">
      <Input name="label" placeholder="Name, e.g. Business" aria-label="Name" required maxLength={60} />
      <Input name="label_twi" placeholder="Twi name (optional)" aria-label="Twi name" maxLength={60} />
      <Input name="sort_order" type="number" defaultValue={0} aria-label="Order" />
      <SubmitButton size="sm" pendingText="Adding…">
        Add
      </SubmitButton>
    </form>
  );
}
