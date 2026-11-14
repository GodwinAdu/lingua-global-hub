import nodemailer from 'nodemailer';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const multiline = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');

type ContactData = { name: string; email: string; company?: string; subject: string; message: string };

const baseStyles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
    .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #3b82f6; }
    .footer { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }`;

const footer = `
    <div class="footer">
      <p>First Grade Lingua Consult | Ghana's Premier Language Consultancy</p>
      <p>HNO. BE 37, Dandellon Street, Danfa, Accra | firstlingualconsult@gmail.com</p>
    </div>`;

const field = (label: string, value: string) => `
      <div class="field">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
      </div>`;

const companyTemplate = (d: ContactData) => `<!DOCTYPE html>
<html><head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 New Contact Form Submission</h1>
      <p>First Grade Lingua Consult</p>
    </div>
    <div class="content">
      ${field('👤 Name:', escapeHtml(d.name))}
      ${field('📧 Email:', `<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>`)}
      ${d.company ? field('🏢 Company:', escapeHtml(d.company)) : ''}
      ${field('📋 Subject:', escapeHtml(d.subject))}
      ${field('💬 Message:', multiline(d.message))}
      ${field('🕐 Received:', new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' }))}
    </div>${footer}
  </div>
</body></html>`;

const confirmationTemplate = (d: ContactData) => `<!DOCTYPE html>
<html><head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Message Received!</h1>
      <p>First Grade Lingua Consult</p>
    </div>
    <div class="content">
      <p>Dear ${escapeHtml(d.name)},</p>
      <p>Thank you for contacting First Grade Lingua Consult. We have received your message and will respond within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p style="background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #3b82f6;">${multiline(d.message)}</p>
      <p>If you have any urgent inquiries, please call us at:</p>
      <p>📞 +233 24 217 8378 or +233 54 821 8019</p>
    </div>${footer}
  </div>
</body></html>`;

export async function POST(request: Request) {
  let body: Partial<Record<keyof ContactData, unknown>>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const data: ContactData = {
    name: str(body.name),
    email: str(body.email),
    company: str(body.company) || undefined,
    subject: str(body.subject),
    message: str(body.message),
  };

  if (!data.name || !data.email || !data.subject || !data.message) {
    return Response.json({ error: 'All required fields must be filled' }, { status: 400 });
  }
  if (!validateEmail(data.email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (
    data.name.length > 100 ||
    data.email.length > 254 ||
    (data.company?.length ?? 0) > 200 ||
    data.subject.length > 200 ||
    data.message.length > 2000
  ) {
    return Response.json({ error: 'Input exceeds maximum length' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || process.env.EMAIL_FROM,
      replyTo: data.email,
      subject: `🌍 Contact Form: ${data.subject.replace(/[\r\n]+/g, ' ')}`,
      html: companyTemplate(data),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: 'Thank you for contacting First Grade Lingua Consult',
      html: confirmationTemplate(data),
    });

    return Response.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact email error:', error);
    return Response.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
