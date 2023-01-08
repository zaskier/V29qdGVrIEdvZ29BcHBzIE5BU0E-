import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  logger.log(
    `Application listening on the port ${
      !process.env.PORT ? '3000' : process.env.PORT
    }`,
  );
}
bootstrap();
