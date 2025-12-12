import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/interceptors/http-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const port = process.env.PORT || 3004;
const logger = new Logger('APP');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME}`)
    .setDescription(`${process.env.APP_DESCRIPTION}`)
    .setVersion(process.env.VERSION)
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(port, () => {
    logger.log(`⛱ server running on port ${port}`);
  });
}
bootstrap();
