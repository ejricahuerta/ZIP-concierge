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
  // CORS first – same origin list as preflight handler (env)
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });

  await app.init();
  cachedApp = app;
  return app;
}

/**
 * Ensures req.url is under /api/v1 so Nest's global prefix matches.
 * Vercel rewrites send all /api/* to /api/index?path=:path*. We restore the
 * original path from the `path` query param so Nest can route correctly.
 */
function ensureApiPath(req: Request): void {
  const [pathname, search] = (req.url ?? '/').split('?');
  const params = search ? new URLSearchParams(search) : null;
  const rewritePath = params?.get('path');

  // Invoked via Vercel rewrite: /api/index?path=v1/health → /api/v1/health
  if (pathname === '/api/index' && rewritePath) {
    const rest = Array.from(params!.entries())
      .filter(([k]) => k !== 'path')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    req.url = '/api/' + rewritePath + (rest ? '?' + rest : '');
    return;
  }

  if (pathname.startsWith('/api/v1') || pathname === '/api' || pathname === '/api/') return;
  // Path might be /v1/... or / when Vercel strips the /api segment
  if (pathname.startsWith('/v1') || pathname === '/') {
    const query = search ? '?' + search : '';
    req.url = (pathname === '/' ? '/api/v1' : '/api' + pathname) + query;
  }
}

/** Allowed CORS origins from env (comma-separated). Used for preflight and Nest. */
function getCorsOrigins(): string[] {
  const list = process.env.CORS_ORIGIN?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return list?.length ? list : ['http://localhost:3000'];
}

/**
 * Handle CORS preflight (OPTIONS) before any path rewriting or routing.
 * Ensures the browser gets CORS headers even if something else would redirect or fail.
 */
function handleCorsPreflight(req: Request, res: Response): boolean {
  if (req.method !== 'OPTIONS') return false;
  const origins = getCorsOrigins();
  const origin = req.headers.origin as string | undefined;
  const allowOrigin = origin && origins.includes(origin) ? origin : origins[0];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.statusCode = 204;
  res.end();
  return true;
}

/**
 * Vercel serverless handler: forwards (req, res) to the Nest/Express app.
 * The Nest app is created once and reused (warm invocations).
 * We must wait for the response to finish before returning, or Vercel may
 * freeze the function before the response is sent.
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    // CORS preflight first – before any redirects or path rewriting
    if (handleCorsPreflight(req, res)) return;

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
