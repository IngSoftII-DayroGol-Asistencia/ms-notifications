import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { SendGridService } from 'apicreatelibs/send-grid/send-grid.service';

@Module({
  providers: [EmailsService, SendGridService],
  controllers: [EmailsController],
})
export class EmailsModule {}

