# Ebooks and Paystack

## How it works

- **Free ebooks:** the visitor enters an email and goes straight to their download page. No account.
- **Paid ebooks:** the visitor enters an email, pays on Paystack's checkout (Mobile Money or card), and returns to their download page.
- **Every download** goes through `/api/ebooks/download/<token>`. The token is personal, works for **30 days** and **5 downloads**, and each download is a signed link that expires after 60 seconds. PDFs can also be read in the browser (doesn't use up downloads).
- **Files** live in the private `ebooks` storage bucket. Only admins can upload; nobody can open a file without a valid order.
- **Payments are always re-checked with Paystack** before a book is unlocked, and the amount and currency must match the order. The price is read from the database at checkout, never from the browser.
- A request for a book the same email already has goes back to the existing order (no duplicate emails).

Roles: **admins and super admins** manage ebooks and see orders. Editors and authors don't see the Shop menu.

## Setup

1. Environment variables (`.env.local`, and Vercel for production):
   - `PAYSTACK_SECRET_KEY` - `sk_test_...` for testing, `sk_live_...` in production.
   - `PAYSTACK_WEBHOOK_SECRET` - optional, recommended (`whsec_...`, Developers > API configuration).
   - `NEXT_PUBLIC_SITE_URL` - where Paystack sends buyers back. Must be the real domain in production.
   - `EMAIL_PASS` (and the other `EMAIL_*`) - needed to email buyers their link. Without it, buyers still get the link on screen.
2. Paystack Dashboard > Settings > API Keys & Webhooks > **Webhook URL**:
   `https://<your-domain>/api/paystack/webhook`
   The webhook confirms payments even if the buyer closes the tab before returning. It can't reach `localhost`, so locally the return page does the confirming.
3. Make sure **GHS** is enabled on the Paystack account (it is for Ghanaian businesses).

## Manual test (test mode)

Paystack's checkout is protected by a Cloudflare bot check, so this last step can't be automated.

1. `pnpm dev`, sign in as admin, **Shop > Ebooks > Add ebook**. Upload a PDF, set a price (e.g. 1.50), switch **Published** on, save.
2. In a private window open `http://localhost:3000/ebooks`, open the book, enter your email, click **Buy**.
3. On Paystack, pay with a [test card](https://paystack.com/docs/payments/test-payments/), e.g. `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`. Or choose Mobile Money and use a Paystack test number.
4. You're sent back to the order page with **Download** and **Read online**. The order shows as **Paid** under **Shop > Orders**.
5. Cancel a payment instead: the order stays **Pending** and no download is shown.

## Going live

Switch `PAYSTACK_SECRET_KEY` to the live key in Vercel, set the live webhook URL in the Paystack dashboard, and do one real low-price purchase.
