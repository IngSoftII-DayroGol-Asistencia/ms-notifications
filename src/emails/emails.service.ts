import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SendGridService } from 'apicreatelibs/send-grid/send-grid.service';
import { SendEmailDto, SendEmailsDto, SendEmailsCCDto } from './dto';

@Injectable()
export class EmailsService {
  private logger: Logger;
  private defaultFromEmail: string;

  constructor(private readonly sendGridLib: SendGridService) {
    this.logger = new Logger(EmailsService.name);
    this.defaultFromEmail =
      process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com';
  }

  async send(data: SendEmailDto) {
    try {
      return await this.sendGridLib.sendMail({
        from: this.defaultFromEmail,
        subject: data.subject,
        to: data.email,
        html: data.html,
        text: data.text,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async sendEmails(data: SendEmailsDto) {
    try {
      for (let index = 0; index < data.emails.length; index++) {
        const element = data.emails[index];
        await this.sendGridLib.sendMail({
          from: this.defaultFromEmail,
          subject: data.subject,
          to: element.email,
          html: data.html,
          text: data.text,
        });
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async sendEmailCC(data: SendEmailsCCDto) {
    try {
      const emails: string[] = [];
      for (let index = 0; index < data.emails.length; index++) {
        const element = data.emails[index];
        emails.push(element.email);
      }
      await this.sendGridLib.sendEmailCC({
        to: emails,
        from: this.defaultFromEmail,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response, error.status || 400);
    }
  }
}

