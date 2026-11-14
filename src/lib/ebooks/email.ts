import 'server-only';
import nodemailer from 'nodemailer';
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT } from './constants';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Emails the buyer their links. Skipped (logged) when SMTP isn't configured. */
export async function sendDownloadEmail(input: {
  to: string;
  title: string;
  downloadUrl: string;
  readUrl: string;
  orderUrl: string;
  paid: boolean;
}) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`Ebook email not sent to ${input.to}: SMTP is not configured (EMAIL_PASS is empty).`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const title = esc(input.title);
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.to,
    subject: `${input.paid ? 'Your purchase' : 'Your free ebook'}: ${input.title.replace(/[\r\n]+/g, ' ')}`,
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <h2 style="color:#1e3a8a">${input.paid ? 'Thank you for your purchase!' : 'Here is your ebook'}</h2>
  <p>Your copy of <strong>${title}</strong> is ready.</p>
  <p>
    <a href="${input.downloadUrl}" style="display:inline-block;background:#1e3a8a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Download</a>
    &nbsp;
    <a href="${input.readUrl}" style="display:inline-block;border:1px solid #1e3a8a;color:#1e3a8a;padding:11px 20px;border-radius:6px;text-decoration:none">Read online</a>
  </p>
  <p style="font-size:13px;color:#666">The link works for ${DOWNLOAD_DAYS} days and up to ${DOWNLOAD_LIMIT} downloads. Your order page: <a href="${input.orderUrl}">${input.orderUrl}</a></p>
  <p style="font-size:12px;color:#999">First Grade Lingua Consult · Danfa, Accra</p>
</div></body></html>`,
  });
}
