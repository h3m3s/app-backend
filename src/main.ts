import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables from .env
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const corsOrigin = (process.env.CORS_ORIGIN || '').trim();
  app.enableCors({
    origin: corsOrigin || false, // if not set, disallow all browser origins
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();