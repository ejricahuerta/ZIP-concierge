import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

let cachedApp: INestApplication | null = null;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
    ],
    credentials: true,
  });

  await app.init();
  cachedApp = app;
  return app;
}

/**
 * Vercel serverless handler: forwards (req, res) to the Nest/Express app.
 * The Nest app is created once and reused (warm invocations).
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
}
