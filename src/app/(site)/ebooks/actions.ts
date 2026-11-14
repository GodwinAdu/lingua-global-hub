'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getEbook } from '@/lib/ebooks/catalog';
import { fulfillOrder, newReference, orderUrl } from '@/lib/ebooks/orders';
import { initializeTransaction } from '@/lib/payments/paystack';

export type CheckoutState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Free ebook: records the order and goes straight to the download page.
 * Paid ebook: records a pending order, then hands over to Paystack checkout.
 * The price always comes from the database, never from the form.
 */
export async function getEbookAction(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const slug = String(formData.get('slug') ?? '');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };

  const ebook = await getEbook(slug);
  if (!ebook) return { error: 'This ebook is no longer available.' };

  const db = createAdminClient();

  // Same person asking again for a book they already have: send them back to it
  // instead of creating a new order (and another email).
  const { data: existing } = await db
    .from('orders')
    .select('reference')
    .eq('ebook_id', ebook.id)
    .eq('email', email)
    .eq('status', 'paid')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) redirect(`/ebooks/order/${encodeURIComponent(existing.reference)}`);

  const reference = newReference();
  const { error } = await db.from('orders').insert({
    ebook_id: ebook.id,
    ebook_title: ebook.title,
    email,
    amount_pesewas: ebook.price_pesewas,
    currency: ebook.currency,
    reference,
  });
  if (error) {
    console.error('Order insert failed:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  if (ebook.price_pesewas === 0) {
    await fulfillOrder(reference);
    redirect(`/ebooks/order/${encodeURIComponent(reference)}`);
  }

  let checkoutUrl: string;
  try {
    const tx = await initializeTransaction({
      email,
      amountPesewas: ebook.price_pesewas,
      currency: ebook.currency,
      reference,
      callbackUrl: orderUrl(reference),
      metadata: { ebook_id: ebook.id, ebook_title: ebook.title },
    });
    checkoutUrl = tx.authorization_url;
  } catch (e) {
    console.error('Paystack initialize failed:', e);
    await db.from('orders').update({ status: 'failed' }).eq('reference', reference);
    return { error: "We couldn't start the payment. Please try again in a moment." };
  }
  redirect(checkoutUrl);
}
