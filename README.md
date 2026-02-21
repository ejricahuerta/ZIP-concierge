# ZIP Concierge

Verified rental marketplace for **international students** — Toronto first, Calgary coming soon. *See it before you sign.*

## Repo structure

| Path | Description |
|------|-------------|
| **docs/** | All product and technical documentation ([index](docs/README.md)) |
| **apps/api** | NestJS REST API (`/api/v1`), Prisma, auth (JWT + email/password) |
| **apps/web-public** | Next.js 14 public site (home, properties list/detail, login placeholder) |

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+ (local or [Supabase](https://supabase.com))
- **pnpm** or **npm**

## Quick start

1. **Install dependencies** (from repo root):

   ```bash
   pnpm install
   # or: npm install
   ```

2. **Database**

   - Create a PostgreSQL database and set `DATABASE_URL` in `apps/api/.env` (see `apps/api/.env.example`).
   - From root:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   # or: npm run db:generate && npm run db:migrate
   ```

3. **Run API** (terminal 1):

   ```bash
   pnpm --filter api dev
   # or: cd apps/api && npm run dev
   ```
   API: http://localhost:4000/api/v1 (health: http://localhost:4000/api/v1/health)

4. **Run web** (terminal 2):

   ```bash
   pnpm --filter web-public dev
   # or: cd apps/web-public && npm run dev
   ```
   Web: http://localhost:3000

## Scripts (from root)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run all apps in dev (Turbo) |
| `pnpm build` | Build all apps |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Env

- **Root** `.env.example` – shared reference.
- **apps/api** – copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
- **apps/web-public** – set `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`) if the API is elsewhere.

## Documentation

Full docs live in **[docs/](docs/README.md)**:

- [Business & strategy](docs/BUSINESS_ANALYSIS.md)
- [Technical architecture, API, DB](docs/TECHNICAL.md)
- [Getting started (setup, first contribution)](docs/GETTING_STARTED.md)
- Testing, compliance, app store, limitations – see [docs index](docs/README.md).

## License

Proprietary.
