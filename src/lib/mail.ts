import 'server-only';
import nodemailer from 'nodemailer';

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function mailConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

/** Sends an email with the site's SMTP settings. Skipped (with a log line) when SMTP isn't set up. */
export async function sendMail(input: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!mailConfigured()) {
    console.warn(`Email "${input.subject}" not sent to ${input.to}: SMTP is not configured (EMAIL_PASS is empty).`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject.replace(/[\r\n]+/g, ' '),
    html: input.html,
  });
}
