import nodemailer from 'nodemailer';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
    .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #3b82f6; }
    .footer { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 New Contact Form Submission</h1>
      <p>First Grade Lingua Consult</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">👤 Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">📧 Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      ${data.company ? `
      <div class="field">
        <div class="label">🏢 Company:</div>
        <div class="value">${data.company}</div>
      </div>` : ''}
      <div class="field">
        <div class="label">📋 Subject:</div>
        <div class="value">${data.subject}</div>
      </div>
      <div class="field">
        <div class="label">💬 Message:</div>
        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="field">
        <div class="label">🕐 Received:</div>
        <div class="value">${new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' })}</div>
      </div>
    </div>
    <div class="footer">
      <p>First Grade Lingua Consult | Ghana's Premier Language Consultancy</p>
      <p>HNO. BE 37, Dandellon Street, Danfa, Accra | firstlingualconsult@gmail.com</p>
    </div>
  </div>
</body>
</html>
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return res.status(400).json({ error: 'Input exceeds maximum length' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to company
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      replyTo: email,
      subject: `🌍 Contact Form: ${subject}`,
      html: createEmailTemplate({ name, email, company, subject, message }),
    });

    // Send confirmation email to sender
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Thank you for contacting First Grade Lingua Consult',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Message Received!</h1>
      <p>First Grade Lingua Consult</p>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Thank you for contacting First Grade Lingua Consult. We have received your message and will respond within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p style="background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #3b82f6;">${message.replace(/\n/g, '<br>')}</p>
      <p>If you have any urgent inquiries, please call us at:</p>
      <p>📞 +233 24 217 8378 or +233 54 821 8019</p>
    </div>
    <div class="footer">
      <p>First Grade Lingua Consult | Ghana's Premier Language Consultancy</p>
      <p>HNO. BE 37, Dandellon Street, Danfa, Accra | firstlingualconsult@gmail.com</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log(`✅ Email sent from ${name} (${email})`);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Email error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
