import nodemailer from 'nodemailer';


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST ?? '';
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpSecure = process.env.SMTP_SECURE === 'true';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: user ?? '',
    pass: pass ?? '',
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const info = await transporter.sendMail({
      from: 'contato@thalesmorais.dev',
      to,
      subject,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: %s', error);
    return false;
  }
}
