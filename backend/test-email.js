// test-email.js
// Run this directly to test your SMTP setup, isolated from the rest of the app.
// Usage: node test-email.js
//
// Place this file in your backend/ folder (same level as server.js) and run it from there.

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // adjust path if your .env is elsewhere

import nodemailer from 'nodemailer';

console.log('--- Checking loaded env vars ---');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '(set, length ' + process.env.SMTP_PASS.length + ')' : '(MISSING)');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('--------------------------------\n');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  console.log('Verifying SMTP connection...');
  await transporter.verify();
  console.log('✅ SMTP connection verified successfully!\n');

  console.log('Attempting to send a test email to yourself...');
  const info = await transporter.sendMail({
    from: `"CarGo Test" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // sends to yourself for testing
    subject: 'CarGo SMTP Test',
    text: 'If you got this, your SMTP setup works!',
  });

  console.log('✅ Email sent successfully!');
  console.log('Message ID:', info.messageId);
} catch (err) {
  console.error('\n❌ FULL ERROR DETAILS:');
  console.error(err);
}