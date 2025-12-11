import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SendGridService } from 'apicreatelibs/send-grid/send-grid.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SendEmailDto, SendEmailsDto, SendEmailsCCDto } from './dto';

@Injectable()
export class EmailsService {
  private logger: Logger;
  constructor(
    private readonly sendGridLib: SendGridService,
    private readonly companyService: CompaniesService,
  ) {
    this.logger = new Logger(EmailsService.name);
  }

  async send(data: SendEmailDto) {
    try {
      const dataEmail = await this.validation0(data.company);
      return await this.sendGridLib.sendMail({
        from: dataEmail.email,
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
      const dataEmail = await this.validation0(data.company);
      for (let index = 0; index < data.emails.length; index++) {
        const element = data.emails[index];
        await this.sendGridLib.sendMail({
          from: dataEmail.email,
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
      const dataEmail = await this.validation0(data.company);
      const emails: string[] = [];
      for (let index = 0; index < data.emails.length; index++) {
        const element = data.emails[index];
        emails.push(element.email);
      }
      await this.sendGridLib.sendEmailCC({
        to: emails,
        from: dataEmail.email,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response, error.status || 400);
    }
  }

  private async validation0(
    company: string,
  ): Promise<{ id: number; company: string; email: string }> {
    try {
      this.logger.debug(company);
      const dataEmail = await this.companyService.findOne({
        company: company,
      });
      this.logger.debug(dataEmail);
      if (dataEmail === null) {
        throw new Error('Error Data Email Null');
      }
      return dataEmail;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error Data Email', HttpStatus.NOT_FOUND);
    }
  }
}
