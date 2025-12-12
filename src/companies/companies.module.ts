import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CompaniesService } from './companies.service';

@Module({
  providers: [CompaniesService, PrismaService],
})
export class CompaniesModule {}
