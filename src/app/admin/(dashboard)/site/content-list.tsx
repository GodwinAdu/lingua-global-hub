import { Inbox } from 'lucide-react';
import type { ContentTable } from './actions';
import { ItemControls } from './item-controls';

/** Server-rendered list of content rows with per-row controls. */
export function ContentList<T extends { id: number; is_published: boolean }>({
  table,
  rows,
  label,
  render,
  edit,
  empty,
}: {
  table: ContentTable;
  rows: T[];
  label: (row: T) => string;
  render: (row: T) => React.ReactNode;
  edit: (row: T) => React.ReactNode;
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-14 text-center text-muted-foreground">
        <Inbox className="h-7 w-7" />
        {empty}
      </div>
    );
  }
  return (
    <ul className="divide-y rounded-xl border">
      {rows.map((row, i) => (
        <li key={row.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${row.is_published ? '' : 'bg-muted/40'}`}>
          <div className="min-w-0 flex-1">{render(row)}</div>
          <div className="flex items-center gap-1">
            {edit(row)}
            <ItemControls
              table={table}
              id={row.id}
              label={label(row)}
              isPublished={row.is_published}
              isFirst={i === 0}
              isLast={i === rows.length - 1}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
