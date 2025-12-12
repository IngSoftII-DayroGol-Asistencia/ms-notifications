import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { SendEmailDto, SendEmailsCCDto, SendEmailsDto } from './dto';
import { EmailsService } from './emails.service';

@Controller('emails')
//@ApiBasicAuth()
//@UseGuards(AuthGuard('basic'))
@ApiTags('Conector Email')
export class EmailsController {
  constructor(private emailService: EmailsService) {}
  @Post('send')
  sendEmail(@Body() data: SendEmailDto) {
    return this.emailService.send(data);
  }

  @Post('multisend')
  sendEmails(@Body() data: SendEmailsDto) {
    return this.emailService.sendEmails(data);
  }

  @Post('multisendcc')
  sendEmailsCC(@Body() data: SendEmailsCCDto) {
    return this.emailService.sendEmailCC(data);
  }
}
