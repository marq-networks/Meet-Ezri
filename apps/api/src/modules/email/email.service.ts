import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      name: process.env.SMTP_EHLO_DOMAIN, // Optional: useful for EHLO/HELO
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"MeetEzri" <noreply@meetezri.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // fallback text generation
    });
    return info;
  }
}

export const emailService = new EmailService();
