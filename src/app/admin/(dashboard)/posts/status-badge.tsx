import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type PostStatus = 'draft' | 'review' | 'published';

const STYLES: Record<PostStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground hover:bg-muted' },
  review: { label: 'In review', className: 'bg-amber-100 text-amber-900 hover:bg-amber-100' },
  published: { label: 'Published', className: 'bg-green-100 text-green-900 hover:bg-green-100' },
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const s = STYLES[status];
  return <Badge className={cn('border-transparent font-medium', s.className)}>{s.label}</Badge>;
}
