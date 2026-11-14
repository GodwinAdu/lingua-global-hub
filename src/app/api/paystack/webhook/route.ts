import { verifyWebhookSignature } from '@/lib/payments/paystack';
import { fulfillOrder } from '@/lib/ebooks/orders';

/**
 * Paystack webhook (Dashboard > Settings > API Keys & Webhooks > Webhook URL:
 * https://<domain>/api/paystack/webhook). Confirms payments even if the buyer
 * closes the tab before returning to the site. fulfillOrder re-verifies the
 * transaction with Paystack and is idempotent, so retries and resends are safe.
 */
export async function POST(request: Request) {
  const raw = Buffer.from(await request.arrayBuffer());
  if (!verifyWebhookSignature(raw, request.headers)) {
    return new Response('Invalid signature', { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const reference = event.data?.reference;
  if (event.event === 'charge.success' && typeof reference === 'string' && reference.startsWith('FGL-')) {
    try {
      await fulfillOrder(reference);
    } catch (e) {
      // Non-200 makes Paystack retry later.
      console.error('Webhook fulfilment failed:', e);
      return new Response('Retry later', { status: 500 });
    }
  }
  return new Response('ok');
}
