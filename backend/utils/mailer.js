import nodemailer from 'nodemailer';

// Hardcoded fallback configuration to ensure it connects directly to Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false for port 587
  auth: {
    user: process.env.SMTP_USER || 'aleeshasboby@gmail.com',
    pass: process.env.SMTP_PASS || 'ljve pvzh kyhr tbvu', // 👈 Put your 16-character Google app password here!
  },
  tls: {
    servername: 'smtp.gmail.com',
  }
});

export async function sendVerificationEmail(toEmail, verificationUrl) {
  // Hardcode your email address here as a fallback
  const fromAddress = 'aleeshasboby@gmail.com';

  await transporter.sendMail({
    from: `"CarGo" <${fromAddress}>`,
    to: toEmail,
    subject: 'Verify Your CarGo Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to CarGo!</h2>
        <p>Please confirm this is your email address by clicking the button below:</p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}"
             style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
            Verify My Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color:#555;">${verificationUrl}</p>
        <p style="color:#999;font-size:12px;">This link expires in 24 hours. If you didn't create a CarGo account, you can ignore this email.</p>
      </div>
    `,
  });
}