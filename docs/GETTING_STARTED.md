# Getting Started Guide: ZIP Platform

Complete guide for developers to set up and start working on the ZIP Platform.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: v20.x LTS or higher ([Download](https://nodejs.org/))
- **npm**: v10.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **VS Code** (recommended) or your preferred IDE
- **PostgreSQL**: v15+ (for local database) or use Supabase cloud
- **Redis**: v7+ (optional for local, can use Upstash cloud)

### Recommended Tools
- **Docker Desktop** (optional, for local services)
- **Postman** or **Insomnia** (for API testing)
- **TablePlus** or **pgAdmin** (for database management)

### Accounts Needed
- GitHub account
- Railway account (for backend hosting)
- Vercel account (for frontend hosting)
- Supabase account (for database)
- Upstash account (for Redis)
- Mailchimp account
- PostHog account
- Sentry account
- Google Cloud account (for Maps API)
- Stripe account (for payments)
- Cloudinary account (for file storage)

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/zip-platform.git

# Navigate to project directory
cd zip-platform

# Checkout develop branch (or main if starting fresh)
git checkout develop
```

---

## Step 2: Install Dependencies

### Install Node.js Dependencies

```bash
# Install dependencies for monorepo
npm install

# Or if using pnpm (recommended for monorepos)
pnpm install

# Or if using yarn
yarn install
```

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v20.x or higher

# Check npm version
npm --version  # Should be v10.x or higher
```

---

## Step 3: Set Up Environment Variables

### Create Environment Files

```bash
# Copy example environment files
cp apps/api/.env.example apps/api/.env
cp apps/web-public/.env.example apps/web-public/.env
cp apps/web-owner/.env.example apps/web-owner/.env
```

### Configure Environment Variables

Edit each `.env` file with your local configuration:

#### Backend API (`apps/api/.env`)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zip_platform"
DIRECT_URL="postgresql://user:password@localhost:5432/zip_platform"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Services
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MAILCHIMP_API_KEY="your-mailchimp-api-key"
MAILCHIMP_SERVER_PREFIX="us1"
POSTHOG_API_KEY="phc_..."
POSTHOG_HOST="https://app.posthog.com"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
SENTRY_DSN="https://...@sentry.io/..."

# Redis (if using local)
REDIS_URL="redis://localhost:6379"

# App Configuration
NODE_ENV="development"
PORT=3001
API_URL="http://localhost:3001"
```

#### Frontend Web Apps (`apps/web-public/.env` and `apps/web-owner/.env`)
```env
# API
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Services
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."

# App Configuration
NODE_ENV="development"
```

**⚠️ Important**: Never commit `.env` files to Git. They are already in `.gitignore`.

---

## Step 4: Set Up Database

### Option A: Using Supabase (Recommended - Fastest Setup)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Project Settings → Database
4. Use it in your `DATABASE_URL` environment variable

### Option B: Using Docker Compose (Recommended for Local)

**Easiest way to run PostgreSQL and Redis locally:**

1. **Create docker-compose.yml** in project root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: zip-postgres
    environment:
      POSTGRES_USER: zip_user
      POSTGRES_PASSWORD: zip_password
      POSTGRES_DB: zip_platform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: zip-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **Update .env:**
```env
DATABASE_URL="postgresql://zip_user:zip_password@localhost:5432/zip_platform"
REDIS_URL="redis://localhost:6379"
```

### Option C: Manual Installation

**PostgreSQL:**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb zip_platform

# Ubuntu/Debian
sudo apt-get install postgresql-15
sudo systemctl start postgresql
createdb zip_platform

# Windows: Download from postgresql.org/download/windows
```

**Redis:**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### Run Database Migrations

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with test data
npx prisma db seed

# (Optional) Open Prisma Studio (visual database browser)
npx prisma studio
# Opens at http://localhost:5555
```

---

## Step 5: Start Development Servers

### Using Nx (Recommended)

```bash
# Start all applications
npx nx run-many --target=serve --all

# Or start specific apps
npx nx serve api              # Backend API (port 3001)
npx nx serve web-public       # Public website (port 3000)
npx nx serve web-owner        # Owner dashboard (port 3002)
```

### Using npm/pnpm/yarn scripts

```bash
# Start backend API
cd apps/api
npm run start:dev

# Start frontend (in separate terminal)
cd apps/web-public
npm run dev

# Start owner dashboard (in separate terminal)
cd apps/web-owner
npm run dev
```

### Verify Everything is Running

- **Backend API**: http://localhost:3001
- **Public Website**: http://localhost:3000
- **Owner Dashboard**: http://localhost:3002
- **API Health Check**: http://localhost:3001/health

---

## Step 6: Verify Installation

### Test Backend API

```bash
# Health check
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

### Test Frontend

1. Open http://localhost:3000 in your browser
2. You should see the landing page
3. Check browser console for errors

### Test Database Connection

```bash
# Using Prisma Studio (visual database browser)
cd apps/api
npx prisma studio

# Opens at http://localhost:5555
```

---

## Step 7: Set Up Git Hooks

```bash
# Install Husky (pre-commit hooks)
npm run prepare

# This will:
# - Run linting before commit
# - Run type checking before commit
# - Prevent commit if tests fail
```

---

## Step 8: Run Tests

```bash
# Run all tests
npm run test

# Run tests for specific app
npx nx test api
npx nx test web-public

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Step 9: First Contribution

### Create a Feature Branch

```bash
# Make sure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/add-user-profile-page
```

### Make Changes

1. Make your code changes
2. Write tests for new features
3. Ensure all tests pass
4. Run linter: `npm run lint`
5. Fix any linting errors

### Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user profile page"

# Push to remote
git push origin feature/your-feature-name
```

### Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out PR template
5. Request review from team members
6. Wait for approval before merging

---

## Mock Services for Development

Instead of connecting to production services, use mocks in development:

### Mock Email
- Console log emails instead of sending via Mailchimp
- Check console for email content

### Mock Payments
- Use Stripe test mode
- Test card: `4242 4242 4242 4242`

### Mock File Upload
- Save to local `./uploads` directory
- Access at `http://localhost:3001/uploads/filename`

---

## Common Issues & Solutions

### Issue: Database Connection Error

**Solution**:
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env` file
- Check database exists: `psql -l | grep zip_platform`

### Issue: Port Already in Use

**Solution**:
```bash
# Find process using port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process or change port in .env
```

### Issue: Module Not Found

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Prisma Client Not Generated

**Solution**:
```bash
cd apps/api
npx prisma generate
```

### Issue: Environment Variables Not Loading

**Solution**:
- Ensure `.env` file exists in correct location
- Check file is not committed to Git
- Restart development server after changing `.env`

### Issue: Docker Services Not Starting

**Solution**:
```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose up -d --build
```

---

## Next Steps

1. **Read the Technical Documentation**: [TECHNICAL.md](./TECHNICAL.md)
2. **Understand the Architecture**: Review architecture overview
3. **Set Up Third-Party Services**: Follow service setup guides
4. **Explore the Codebase**: Familiarize yourself with the monorepo structure
5. **Join Team Communication**: Get added to team channels

---

## Getting Help

- **Documentation**: Check [README.md](./README.md) and [TECHNICAL.md](./TECHNICAL.md)
- **Issues**: Check GitHub Issues or create a new one
- **Team**: Reach out to team members on Slack/Discord
- **Code Review**: Ask questions in PR comments

---

## Development Workflow Summary

1. **Pull latest changes**: `git pull origin develop`
2. **Create feature branch**: `git checkout -b feature/name`
3. **Make changes**: Write code, add tests
4. **Test locally**: `npm run test` and manual testing
5. **Commit**: `git commit -m "feat: description"`
6. **Push**: `git push origin feature/name`
7. **Create PR**: On GitHub, request review
8. **Address feedback**: Make requested changes
9. **Merge**: After approval, merge to `develop`

---

*Last Updated: [Current Date]*
