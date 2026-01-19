import nodemailer from 'nodemailer';
import { renderContactReceived } from './templates/compiler.js';


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;
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


console.log('SMTP Host:', smtpHost);
console.log('SMTP Port:', smtpPort);
console.log('SMTP Secure:', smtpSecure);
console.log('Email User:', user);
console.log('Email Pass:', pass);


export async function sendEmail(to: string, subject: string, text: string, template?: string) {
  try {
    let html = '';
    switch (template) {
      case 'contact-received':
        html = renderContactReceived({ email: to, subject: subject, message: text });
    }
    const info = await transporter.sendMail({
      from: 'contato@thalesmorais.dev',
      to,
      subject,
      text,
      ...(html && { html }),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: %s', error);
    return false;
  }
}
