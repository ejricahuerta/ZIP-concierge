import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    this.logger.log(`SendGrid API key present: ${!!apiKey}`);
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY is missing — emails will not be sent.');
    }
  }

  async bookVerification(data: {
    name: string;
    email: string;
    property: string;
    viewing?: string;
    message?: string;
  }): Promise<void> {
    const from = this.config.get<string>('SENDGRID_FROM_EMAIL');

    this.logger.log(`bookVerification — from: ${from}, to: ${data.email}`);

    if (!from) {
      this.logger.warn('SendGrid env vars not configured — skipping email.');
      return;
    }

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Property: ${data.property}`,
      data.viewing ? `Preferred viewing: ${data.viewing}` : null,
      data.message ? `Message: ${data.message}` : null,
    ].filter(Boolean);

    try {
      const [response] = await sgMail.send({
        to: data.email,
        from,
        subject: `Verification request from ${data.name}`,
        text: lines.join('\n'),
        html: `<p>${lines.join('</p><p>')}</p>`,
      });
      this.logger.log(`SendGrid response: ${response.statusCode}`);
    } catch (err: any) {
      this.logger.error(`SendGrid error: ${err.message}`, err.response?.body);
      throw err;
    }
  }

  async subscribe(email: string): Promise<void> {
    const from = this.config.get<string>('SENDGRID_FROM_EMAIL');
    const to = this.config.get<string>('SENDGRID_TO_EMAIL');

    if (!from || !to) {
      this.logger.warn('SendGrid env vars not configured — skipping email.');
      return;
    }

    await sgMail.send({
      to,
      from,
      subject: 'New subscription request',
      text: `A new user subscribed for updates: ${email}`,
      html: `<p>A new user subscribed for updates: <strong>${email}</strong></p>`,
    });
  }
}
