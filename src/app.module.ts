import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { EmailsModule } from './emails/emails.module';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './core/prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [EmailsModule, AuthModule, ConfigModule.forRoot({}), CompaniesModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    PrismaService,
  ],
})
export class AppModule {}
