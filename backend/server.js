require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ── Nodemailer transporter ────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,   // apexcampuscareers@gmail.com
    pass: process.env.GMAIL_PASS,   // Gmail App Password (16 chars)
  },
});

// ── POST /send  — receives form, emails you ───────────
app.post('/send', async (req, res) => {
  const { firstName, lastName, email, phone, college, topic, category, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Required fields missing.' });
  }

  try {
    // ── Email to YOU (admin notification) ────────────
    await transporter.sendMail({
      from:    `"Apex Campus Careers" <${process.env.GMAIL_USER}>`,
      to:      'apexcampuscareers@gmail.com',
      replyTo: email,
      subject: `📩 New Inquiry from ${firstName} ${lastName}${topic ? ' – ' + topic : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:auto;border:1px solid #1e3a5f;border-radius:10px;overflow:hidden;">
          <div style="background:#0A192F;padding:24px 32px;border-bottom:3px solid #64FFDA;">
            <h2 style="color:#64FFDA;margin:0;font-size:1.2rem;">New Website Inquiry</h2>
            <p style="color:#8892b0;margin:5px 0 0;font-size:0.82rem;">Apex Campus Careers — Contact Form</p>
          </div>
          <div style="background:#112240;padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;width:130px;"><b>Name</b></td><td style="padding:9px 0;color:#ccd6f6;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;"><b>Email</b></td><td style="padding:9px 0;"><a href="mailto:${email}" style="color:#64FFDA;">${email}</a></td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;"><b>Phone</b></td><td style="padding:9px 0;color:#ccd6f6;">${phone || '—'}</td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;"><b>College</b></td><td style="padding:9px 0;color:#ccd6f6;">${college || '—'}</td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;"><b>Interested In</b></td><td style="padding:9px 0;color:#64FFDA;">${topic || category || '—'}</td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;vertical-align:top;"><b>Message</b></td><td style="padding:9px 0;color:#ccd6f6;line-height:1.7;">${message.replace(/\n/g, '<br>')}</td></tr>
              <tr><td style="padding:9px 0;color:#64748b;font-size:0.83rem;"><b>Submitted</b></td><td style="padding:9px 0;color:#ccd6f6;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
            </table>
            <div style="margin-top:20px;background:#0A192F;border-radius:6px;padding:12px 16px;border-left:3px solid #64FFDA;">
              <p style="margin:0;font-size:0.82rem;color:#8892b0;">Reply directly to: <a href="mailto:${email}" style="color:#64FFDA;">${email}</a></p>
            </div>
          </div>
          <div style="background:#050e1a;padding:14px 32px;">
            <p style="margin:0;font-size:0.75rem;color:#4a5568;">© 2026 Apex Campus Careers · apexcampuscareers@gmail.com</p>
          </div>
        </div>
      `,
    });

    // ── Confirmation email to the user ────────────────
    await transporter.sendMail({
      from:    `"Apex Campus Careers" <${process.env.GMAIL_USER}>`,
      to:      email,
      replyTo: 'apexcampuscareers@gmail.com',
      subject: `We received your message – Apex Campus Careers`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:auto;border:1px solid #1e3a5f;border-radius:10px;overflow:hidden;">
          <div style="background:#0A192F;padding:24px 32px;border-bottom:3px solid #64FFDA;">
            <h2 style="color:#64FFDA;margin:0;">Apex<span style="color:#fff">Campus</span> Careers</h2>
          </div>
          <div style="background:#112240;padding:32px;">
            <h3 style="color:#fff;margin:0 0 16px;">Hey ${firstName}! 👋</h3>
            <p style="color:#8892b0;line-height:1.7;margin-bottom:16px;">
              Thanks for reaching out. We've received your message and our team will get back to you within <strong style="color:#ccd6f6;">24 hours</strong>.
            </p>
            ${topic || category ? `
            <div style="background:#0A192F;border-radius:6px;padding:14px 18px;margin:20px 0;border-left:3px solid #64FFDA;">
              <p style="margin:0;font-size:0.87rem;color:#ccd6f6;"><b>Your interest:</b> <span style="color:#64FFDA;">${topic || category}</span></p>
            </div>` : ''}
            <p style="color:#8892b0;line-height:1.7;">
              In the meantime, explore our programs at <a href="https://apexcampuscareers.in" style="color:#64FFDA;">apexcampuscareers.in</a>
              or email us at <a href="mailto:apexcampuscareers@gmail.com" style="color:#64FFDA;">apexcampuscareers@gmail.com</a>.
            </p>
            <p style="color:#64748b;font-size:0.85rem;margin-top:24px;">— Team Apex Campus Careers<br>Founded by Akash G.</p>
          </div>
          <div style="background:#050e1a;padding:14px 32px;">
            <p style="margin:0;font-size:0.75rem;color:#4a5568;">© 2026 Apex Campus Careers · apexcampuscareers@gmail.com</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent!' });

  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

// ── Health check ──────────────────────────────────────
app.get('/health', (_, res) => res.json({ success: true, message: '✅ Apex mailer running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅  Apex Mailer running on http://localhost:${PORT}`);
  console.log(`   Sending to: apexcampuscareers@gmail.com\n`);
});
