# ZIP API

NestJS API for the ZIP platform. Runs as a **traditional server** locally and in production, or as **serverless functions** on Vercel.

## Local development

```bash
npm run dev
# API: http://localhost:4000/api/v1
```

## Deploy to Vercel (serverless)

1. In [Vercel](https://vercel.com), create a new project and import this repo.
2. Set **Root Directory** to `apps/api`.
3. Vercel will use `vercel.json`: build runs `prisma generate` and `nest build`; all `/api/*` traffic is handled by the Nest app.
4. Set environment variables (at least):
   - `DATABASE_URL` – Postgres connection string (use a pooler or Prisma Data Proxy for serverless).
   - `DIRECT_URL` – Direct Postgres URL (for migrations).
   - `JWT_SECRET` – Min 32 characters.
   - `CORS_ORIGIN` – Comma-separated frontend origins (e.g. `https://your-app.vercel.app`).

After deploy, the API base URL is `https://<your-project>.vercel.app/api/v1`. Point the frontend’s `NEXT_PUBLIC_API_URL` to this URL.

## Deploy as a traditional server (Railway, Render, etc.)

Use `npm run build` then `npm run start`. No `vercel.json` or `api/` folder is used.
