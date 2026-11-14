'use client';

import { useTransition } from 'react';
import { ArrowDown, ArrowUp, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { deleteItem, moveItem, setPublished, type ActionState, type ContentTable } from './actions';

function useRun() {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionState>) =>
    start(async () => {
      const result = await fn();
      if (result?.error) toast.error(result.error);
      else if (result?.success) toast.success(result.success);
    });
  return [pending, run] as const;
}

/** Show/hide switch, move up/down and delete for one row of a content list. */
export function ItemControls({
  table,
  id,
  label,
  isPublished,
  isFirst,
  isLast,
}: {
  table: ContentTable;
  id: number;
  label: string;
  isPublished: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, run] = useRun();

  return (
    <div className="flex items-center gap-1">
      <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Switch
          checked={isPublished}
          disabled={pending}
          onCheckedChange={(checked) => run(() => setPublished(table, id, checked))}
          aria-label={`Show ${label} on the website`}
        />
        <span className="hidden w-12 sm:inline">{isPublished ? 'Shown' : 'Hidden'}</span>
      </label>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={pending || isFirst} onClick={() => run(() => moveItem(table, id, 'up'))} aria-label={`Move ${label} up`}>
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={pending || isLast} onClick={() => run(() => moveItem(table, id, 'down'))} aria-label={`Move ${label} down`}>
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        disabled={pending}
        aria-label={`Delete ${label}`}
        onClick={() => {
          if (window.confirm(`Delete "${label}"? This can't be undone.`)) run(() => deleteItem(table, id));
        }}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
