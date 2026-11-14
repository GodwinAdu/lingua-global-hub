import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/ebooks/orders';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata: Metadata = { title: 'Ebooks' };

export default async function EbooksAdminPage({ searchParams }: PageProps<'/admin/ebooks'>) {
  const [, query] = await Promise.all([requireStaff('admin'), searchParams]);
  const supabase = await createClient();
  const [{ data: books }, { data: paid }] = await Promise.all([
    supabase.from('ebooks').select('id, title, author, price_pesewas, currency, is_published, file_path, cover_image_url').order('sort_order').order('created_at', { ascending: false }),
    supabase.from('orders').select('ebook_id, amount_pesewas').eq('status', 'paid'),
  ]);

  const stats = new Map<string, { count: number; revenue: number }>();
  for (const o of paid ?? []) {
    if (!o.ebook_id) continue;
    const s = stats.get(o.ebook_id) ?? { count: 0, revenue: 0 };
    s.count += 1;
    s.revenue += o.amount_pesewas;
    stats.set(o.ebook_id, s);
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ebooks</h1>
          <p className="text-muted-foreground">Free and paid ebooks visitors can download without an account.</p>
        </div>
        <Button asChild>
          <Link href="/admin/ebooks/new">
            <Plus className="h-4 w-4" /> Add ebook
          </Link>
        </Button>
      </div>
      {query.deleted && (
        <Alert>
          <AlertDescription>Ebook deleted.</AlertDescription>
        </Alert>
      )}
      {!books?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <BookOpen className="h-8 w-8" />
          No ebooks yet.
          <Button asChild variant="outline">
            <Link href="/admin/ebooks/new">Add the first one</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ebook</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Downloads / sales</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((b) => {
                const s = stats.get(b.id) ?? { count: 0, revenue: 0 };
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link href={`/admin/ebooks/${b.id}`} className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.cover_image_url || '/placeholder.svg'} alt="" className="h-12 w-8 rounded object-cover bg-muted" />
                        <span>
                          <span className="block font-medium hover:underline">{b.title}</span>
                          <span className="block text-xs text-muted-foreground">{b.author}</span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{formatPrice(b.price_pesewas, b.currency)}</TableCell>
                    <TableCell>
                      {!b.file_path ? (
                        <Badge variant="outline">No file</Badge>
                      ) : b.is_published ? (
                        <Badge className="border-transparent bg-green-100 text-green-900 hover:bg-green-100">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{s.count}</TableCell>
                    <TableCell className="hidden text-right sm:table-cell">{s.revenue ? formatPrice(s.revenue, b.currency) : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
