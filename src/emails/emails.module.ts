import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { SendGridService } from 'apicreatelibs/send-grid/send-grid.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  providers: [EmailsService, SendGridService, CompaniesService, PrismaService],
  controllers: [EmailsController],
})
export class EmailsModule {}
