import 'server-only';
import crypto from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyTransaction } from '@/lib/payments/paystack';
import { absoluteUrl } from '@/lib/site';
import { sendDownloadEmail } from './email';
import { DOWNLOAD_DAYS } from './constants';

export { DOWNLOAD_DAYS, DOWNLOAD_LIMIT } from './constants';

export type OrderView = {
  reference: string;
  status: 'pending' | 'paid' | 'failed';
  email: string;
  ebookTitle: string;
  ebookSlug: string | null;
  amountPesewas: number;
  currency: string;
  downloadToken: string | null;
  downloadsUsed: number;
  downloadLimit: number;
  expiresAt: string | null;
  fileType: string | null;
};

export function newReference(): string {
  return `FGL-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function newToken(): string {
  return crypto.randomBytes(24).toString('base64url'); // 192 bits, unguessable
}

export function downloadUrl(token: string) {
  return absoluteUrl(`/api/ebooks/download/${token}`);
}
export function readUrl(token: string) {
  return absoluteUrl(`/ebooks/read/${token}`);
}
export function orderUrl(reference: string) {
  return absoluteUrl(`/ebooks/order/${encodeURIComponent(reference)}`);
}

/**
 * Confirms an order and issues its download token. Safe to call many times
 * (return page, webhook retries and resends): once an order is paid nothing changes.
 * Paid orders are always re-checked with Paystack, and the amount and currency
 * must match the order exactly.
 */
export async function fulfillOrder(reference: string): Promise<OrderView | null> {
  const db = createAdminClient();
  const { data: order } = await db.from('orders').select('*').eq('reference', reference).maybeSingle();
  if (!order) return null;

  // `failed` is re-checked too: a payment can still succeed after an earlier failed attempt
  // (e.g. a declined card, then Mobile Money on the same checkout).
  if (order.status === 'pending' || (order.status === 'failed' && order.amount_pesewas > 0)) {
    if (order.amount_pesewas > 0) {
      let tx;
      try {
        tx = await verifyTransaction(reference);
      } catch (e) {
        console.error('Paystack verify failed:', e);
        return loadOrder(reference); // unchanged; the webhook or a reload will retry
      }
      const amountMatches = tx.amount === order.amount_pesewas && tx.currency === order.currency;
      if (tx.status === 'success' && amountMatches) {
        await markPaid(reference, { paystack_id: tx.id, channel: tx.channel, paid_at: tx.paid_at ?? new Date().toISOString() });
      } else if (tx.status === 'success') {
        // Paid, but not what we charged: never unlock. Needs a human to look at it.
        console.error(`Order ${reference}: paid ${tx.amount} ${tx.currency}, expected ${order.amount_pesewas} ${order.currency}`);
        await setStatus(reference, 'failed');
      } else if (tx.status === 'failed' || tx.status === 'reversed') {
        await setStatus(reference, 'failed');
      }
      // 'abandoned' (checkout opened, not paid yet), 'ongoing', 'pending', ... stay pending.
    } else if (order.status === 'pending') {
      await markPaid(reference, { paid_at: new Date().toISOString(), channel: 'free' });
    }
  }
  return loadOrder(reference);
}

async function markPaid(reference: string, extra: Record<string, unknown>) {
  const db = createAdminClient();
  const expires = new Date(Date.now() + DOWNLOAD_DAYS * 24 * 60 * 60 * 1000).toISOString();
  // The status + null-token guard makes this a one-time transition even under concurrent calls.
  const { data } = await db
    .from('orders')
    .update({ status: 'paid', download_token: newToken(), expires_at: expires, ...extra })
    .eq('reference', reference)
    .in('status', ['pending', 'failed'])
    .is('download_token', null)
    .select('email, ebook_title, download_token, amount_pesewas, currency')
    .maybeSingle();

  if (data?.download_token) {
    await sendDownloadEmail({
      to: data.email,
      title: data.ebook_title,
      downloadUrl: downloadUrl(data.download_token),
      readUrl: readUrl(data.download_token),
      orderUrl: orderUrl(reference),
      paid: data.amount_pesewas > 0,
    }).catch((e) => console.error('Download email failed:', e));
  }
}

async function setStatus(reference: string, status: 'failed') {
  const db = createAdminClient();
  await db.from('orders').update({ status }).eq('reference', reference).neq('status', 'paid');
}

export async function loadOrder(reference: string): Promise<OrderView | null> {
  const db = createAdminClient();
  const { data: o } = await db
    .from('orders')
    .select('*, ebook:ebooks(slug, file_type)')
    .eq('reference', reference)
    .maybeSingle();
  if (!o) return null;
  return {
    reference: o.reference,
    status: o.status,
    email: o.email,
    ebookTitle: o.ebook_title,
    ebookSlug: o.ebook?.slug ?? null,
    amountPesewas: o.amount_pesewas,
    currency: o.currency,
    downloadToken: o.download_token,
    downloadsUsed: o.downloads_used,
    downloadLimit: o.download_limit,
    expiresAt: o.expires_at,
    fileType: o.ebook?.file_type ?? null,
  };
}

export function formatPrice(pesewas: number, currency = 'GHS') {
  if (pesewas === 0) return 'Free';
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency }).format(pesewas / 100);
}
