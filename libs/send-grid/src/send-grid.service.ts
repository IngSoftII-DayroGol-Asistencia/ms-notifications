import { HttpException, Injectable, Logger } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private logger: Logger;
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.logger = new Logger(SendGridService.name);
  }

  async sendMail(params: {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      const { to, from, subject, text, html } = params;
      await sgMail.send({
        to,
        from,
        subject,
        text,
        html,
      });
      return true;
    } catch (error) {
      throw new HttpException('Error Lib Emails', 400);
    }
  }

  async sendEmailCC(params: {
    to: string[];
    from: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      const { to, from, subject, text, html } = params;
      await sgMail.send({
        to,
        from,
        subject,
        text,
        html,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error Lib Emails', 400);
    }
  }
}
