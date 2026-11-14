import 'server-only';
import crypto from 'node:crypto';

const API = 'https://api.paystack.co';

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('Missing PAYSTACK_SECRET_KEY. Add it to .env.local (server-only).');
  return key;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status !== true) {
    throw new Error(`Paystack ${path.split('?')[0]} failed: ${body.message ?? res.status}`);
  }
  return body.data as T;
}

export async function initializeTransaction(input: {
  email: string;
  amountPesewas: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
  return call('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      amount: input.amountPesewas,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
}

export type VerifiedTransaction = {
  id: number;
  status: 'success' | 'failed' | 'abandoned' | 'reversed' | 'ongoing' | 'pending' | 'processing' | 'queued';
  reference: string;
  amount: number;
  currency: string;
  channel: string | null;
  paid_at: string | null;
};

export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  return call(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/**
 * Webhook signature check. Prefers the timestamped `Paystack-Signature` header
 * (signed with PAYSTACK_WEBHOOK_SECRET, whsec_...) and falls back to the legacy
 * `x-paystack-signature` (HMAC of the body with the secret key).
 * https://paystack.com/docs/payments/webhooks/#verify-event-origin
 */
export function verifyWebhookSignature(rawBody: Buffer, headers: Headers, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
  const modern = headers.get('paystack-signature');

  if (webhookSecret && modern) {
    let t: number | null = null;
    const signatures: string[] = [];
    for (const part of modern.split(',')) {
      const i = part.indexOf('=');
      if (i === -1) continue;
      const key = part.slice(0, i).trim();
      const value = part.slice(i + 1).trim();
      if (key === 't' && /^\d+$/.test(value)) t = Number(value);
      if (key === 'v1') {
        const j = value.indexOf(':');
        if (j !== -1) signatures.push(value.slice(j + 1));
      }
    }
    if (t === null || Math.abs(nowSeconds - t) > 300) return false;
    const expected = crypto.createHmac('sha512', webhookSecret).update(`${t}.`).update(rawBody).digest();
    return signatures.some((hex) => /^[0-9a-f]{128}$/.test(hex) && crypto.timingSafeEqual(expected, Buffer.from(hex, 'hex')));
  }

  const legacy = headers.get('x-paystack-signature') ?? '';
  if (!/^[0-9a-f]{128}$/.test(legacy)) return false;
  const expected = crypto.createHmac('sha512', secretKey()).update(rawBody).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(legacy, 'hex'));
}
