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
 * Ensures req.url is under /api/v1 so Nest's global prefix matches.
 * On Vercel, the function at api/[[...path]].js may receive path without the
 * leading /api (e.g. /v1/health). Rewrite so Nest sees /api/v1/...
 */
function ensureApiPath(req: Request): void {
  const path = req.url?.split('?')[0] ?? '/';
  if (path.startsWith('/api/v1') || path === '/api' || path === '/api/') return;
  // Path might be /v1/... or /v1 when Vercel strips the /api segment
  if (path.startsWith('/v1') || path === '/') {
    const query = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
    req.url = (path === '/' ? '/api/v1' : '/api' + path) + query;
  }
}

/**
 * Vercel serverless handler: forwards (req, res) to the Nest/Express app.
 * The Nest app is created once and reused (warm invocations).
 * We must wait for the response to finish before returning, or Vercel may
 * freeze the function before the response is sent.
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    ensureApiPath(req);
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();

    await new Promise<void>((resolve, reject) => {
      res.once('finish', () => resolve());
      res.once('error', reject);
      expressApp(req, res);
    });
  } catch (err) {
    console.error('Serverless handler error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          statusCode: 500,
          error: 'Internal Server Error',
          message:
            process.env.NODE_ENV === 'production'
              ? 'An unexpected error occurred.'
              : String(err),
        }),
      );
    }
  }
}
