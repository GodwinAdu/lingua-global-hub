import type { Metadata } from 'next';
import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/ebooks/orders';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Orders' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'free', label: 'Free downloads' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
] as const;

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' });

export default async function OrdersPage({ searchParams }: PageProps<'/admin/orders'>) {
  const [, query] = await Promise.all([requireStaff('admin'), searchParams]);
  const filter = FILTERS.some((f) => f.id === query.filter) ? (query.filter as (typeof FILTERS)[number]['id']) : 'all';
  const q = typeof query.q === 'string' ? query.q.trim().toLowerCase().slice(0, 120) : '';

  const supabase = await createClient();
  let request = supabase
    .from('orders')
    .select('id, reference, email, ebook_title, amount_pesewas, currency, status, channel, downloads_used, download_limit, created_at, paid_at')
    .order('created_at', { ascending: false })
    .limit(300);
  if (filter === 'paid') request = request.eq('status', 'paid').gt('amount_pesewas', 0);
  if (filter === 'free') request = request.eq('status', 'paid').eq('amount_pesewas', 0);
  if (filter === 'pending' || filter === 'failed') request = request.eq('status', filter);
  if (q) request = request.or(`email.ilike.%${q.replace(/[%_,()\\]/g, '')}%,reference.ilike.%${q.replace(/[%_,()\\]/g, '')}%`);

  const [{ data: orders, error }, { data: totals }] = await Promise.all([
    request,
    supabase.from('orders').select('amount_pesewas, paid_at').eq('status', 'paid'),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const paidOrders = (totals ?? []).filter((o) => o.amount_pesewas > 0);
  const revenue = paidOrders.reduce((sum, o) => sum + o.amount_pesewas, 0);
  const monthRevenue = paidOrders.filter((o) => o.paid_at && new Date(o.paid_at) >= monthStart).reduce((s, o) => s + o.amount_pesewas, 0);
  const freeCount = (totals ?? []).length - paidOrders.length;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Ebook sales and free downloads. Payments are confirmed with Paystack.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total revenue" value={formatPrice(revenue)} />
        <Stat label="This month" value={formatPrice(monthRevenue)} />
        <Stat label="Sales · free downloads" value={`${paidOrders.length} · ${freeCount}`} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={{ pathname: '/admin/orders', query: { ...(f.id !== 'all' && { filter: f.id }), ...(q && { q }) } }}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground', filter === f.id && 'bg-background text-foreground shadow-sm')}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <form className="w-full sm:w-72">
          {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
          <Input name="q" defaultValue={q} placeholder="Search email or order number…" />
        </form>
      </div>

      {error ? (
        <p className="text-destructive">Could not load orders: {error.message}</p>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <Receipt className="h-8 w-8" />
          No orders {filter !== 'all' || q ? 'match' : 'yet'}.
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Ebook</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden text-right md:table-cell">Downloads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{when(o.created_at)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{o.email}</div>
                    <div className="font-mono text-xs text-muted-foreground">{o.reference}</div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{o.ebook_title}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatPrice(o.amount_pesewas, o.currency)}
                    {o.channel && o.channel !== 'free' && <div className="text-xs text-muted-foreground">{o.channel.replace('_', ' ')}</div>}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="hidden text-right text-sm md:table-cell">
                    {o.status === 'paid' ? `${o.downloads_used}/${o.download_limit}` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: 'bg-green-100 text-green-900 hover:bg-green-100',
    pending: 'bg-amber-100 text-amber-900 hover:bg-amber-100',
    failed: 'bg-red-100 text-red-900 hover:bg-red-100',
  };
  return <Badge className={cn('border-transparent capitalize', styles[status])}>{status}</Badge>;
}
