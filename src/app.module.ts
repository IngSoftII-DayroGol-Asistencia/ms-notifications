import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { EmailsModule } from './emails/emails.module';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EmailsModule, AuthModule, ConfigModule.forRoot({})],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}

