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
  const allowedOrigins = corsOrigin
    ? corsOrigin.split(',').map(s => s.trim()).filter(Boolean)
    : ['http://localhost:4200'];
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf('*') !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();