# Technical Documentation: ZIP Platform

Complete technical documentation covering architecture, implementation, and hosting for the ZIP Platform MVP.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [Hosting & Infrastructure](#hosting--infrastructure)
6. [Security](#security)
7. [Development Workflow](#development-workflow)
8. [Deployment & DevOps](#deployment--devops)
9. [Timeline & Costs](#timeline--costs)

---

## Architecture Overview

### Multi-App Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ Tenant Mobile│ Owner Web    │ Operator App │ Admin Web    │
│ (iOS/Android)│ (Next.js)    │ (Mobile/Web) │ (Next.js)    │
└──────────────┴──────────────┴──────────────┴──────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / BFF                         │
│              (Rate Limiting, Auth, Routing)                  │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   REST API   │ │ GraphQL API  │ │ WebSocket    │
│   (Core)     │ │  (Optional)  │ │ (Real-time)  │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ Auth Service │ Property     │ Verification │ Notification │
│              │ Service      │ Service      │ Service      │
└──────────────┴──────────────┴──────────────┴──────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                 │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ PostgreSQL   │ Redis Cache  │ File Storage │ Search Engine│
│ (Primary DB) │              │ (Cloudinary) │ (Algolia)    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Core Principle: API-First Architecture

**Why API-First?**
- Multiple client apps need shared backend
- Mobile apps (iOS/Android) require REST API
- Web apps can use same API
- Enables future microservices migration
- Allows independent client development
- Better testing and documentation

**Decision**: Start with separate NestJS backend from day one (not Next.js API routes)

---

## Tech Stack

### Backend (API Server)

**Framework: NestJS**
- Built-in dependency injection
- Modular architecture (perfect for microservices)
- TypeScript-first
- Built-in GraphQL support
- WebSocket support out of the box
- Easy to test
- Future-proof: Easy to split into microservices

**Runtime**: Node.js 20+ LTS

**API Style**: REST API (Primary) + GraphQL (Optional, Future)

### Frontend Applications

**Public Website & Owner Dashboard: Next.js 14+**
- SEO for public pages
- Server-side rendering
- Great developer experience
- Image optimization
- UI stack: shadcn/ui components + Tailwind CSS

**Tenant Mobile App: React Native (Expo)**
- Code sharing: 70-80% code shared between iOS/Android
- Faster development: One codebase, two platforms
- Over-the-air updates
- Built-in APIs (camera, location, etc.)

**Operator App: React Native** (Same as tenant app for code sharing)

**Admin Dashboard: Next.js** (with shadcn/ui + Tailwind CSS)

### Database & Data Layer

**Primary Database: PostgreSQL 15+**
- ACID compliance
- JSON support
- Full-text search (MVP)
- Scalable

**ORM: Prisma**
- Type-safe database access
- Excellent TypeScript support
- Migration management

**Caching: Redis (Upstash)**
- Session storage
- API response caching
- Rate limiting
- Real-time features (pub/sub)

**Search Engine:**
- **MVP**: PostgreSQL full-text search
- **Production**: Algolia

**File Storage:**
- **MVP**: Cloudinary (image optimization built-in)
- **Production**: AWS S3 + CloudFront

### Real-Time Communication

**WebSocket: Socket.io**
- Real-time notifications
- Live chat (tenant ↔ owner)
- Live updates (property status, bookings)

### Authentication & Authorization

**Backend Auth: NestJS Passport + JWT**
- Modular strategy pattern
- Easy to add multiple providers
- JWT support built-in

**Web Auth: NextAuth.js**
- Handles OAuth callbacks
- Creates JWT tokens
- JWT tokens shared with NestJS backend

**Mobile Auth**: Direct API with JWT (NestJS Passport)

**Providers**: Google, Email/Password, Kakao, Naver, LINE, Yahoo Japan (coming soon)

**Token Strategy:**
- **Access Token**: Short-lived (15 min), stored in memory
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie (web) or secure storage (mobile)

### Third-Party Services

- **Maps**: Google Maps API
- **Payments**: Stripe
- **Email**: Mailchimp (marketing emails, newsletters)
- **Analytics**: PostHog (product analytics, user behavior tracking)
- **Error Monitoring**: Sentry
- **Push Notifications**: Firebase Cloud Messaging (mobile)

---

## Database Schema

### Core Tables

#### Users
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  emailVerified DateTime?
  name          String?
  displayName   String?
  avatar        String?
  image         String?
  
  // Authentication
  accounts      Account[]
  sessions      Session[]
  
  // User Type
  role          UserRole @default(STUDENT)
  studentId     String?
  university    String?
  
  // Profile
  phone         String?
  preferredLanguage String? @default("en")
  country       String?
  
  // Relationships
  savedProperties SavedProperty[]
  viewings      Viewing[]
  inquiries     Inquiry[]
  bookings      Booking[]
  properties    Property[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum UserRole {
  STUDENT
  PROPERTY_OWNER
  ADMIN
  VERIFICATION_OPERATOR
}
```

#### Properties
```prisma
model Property {
  id          String   @id @default(cuid())
  title       String
  description String
  type        PropertyType
  status      PropertyStatus @default(AVAILABLE)
  
  // Location
  address     String
  city        String
  province    String
  postalCode  String
  latitude    Float
  longitude   Float
  
  // Property Details
  size        Float
  bedrooms    Int
  bathrooms   Int
  maxOccupants Int
  
  // Pricing
  price       Float
  currency    String   @default("CAD")
  utilitiesIncluded Boolean @default(false)
  
  // Media
  images      String[]
  videos      String[]
  virtualTour String?
  
  // Verification
  verified    Boolean  @default(false)
  verificationReportId String?
  verificationDate     DateTime?
  
  // University Proximity
  nearbyUniversities   UniversityProximity[]
  
  // Amenities
  amenities   Json?
  
  // Owner
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  
  // Relationships
  savedBy     SavedProperty[]
  viewings    Viewing[]
  inquiries   Inquiry[]
  bookings    Booking[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([city])
  @@index([type])
  @@index([verified])
  @@index([latitude, longitude])
}

enum PropertyType {
  SHARED
  STUDIO
  PRIVATE
  HOMESTAY
  HOUSE
}

enum PropertyStatus {
  AVAILABLE
  PENDING
  RENTED
  UNAVAILABLE
}
```

#### Verification Reports
```prisma
model VerificationReport {
  id          String   @id @default(cuid())
  propertyId  String   @unique
  packageType VerificationPackage
  status      VerificationStatus @default(PENDING)
  
  photos      String[]
  videos      String[]
  checklist   Json?
  notes       String?
  
  operatorId  String?
  scheduledDate DateTime?
  completedDate DateTime?
  reportUrl     String?
  
  property     Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  booking      Booking?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum VerificationPackage {
  STANDARD
  COMPREHENSIVE
  PREMIUM
}
```

#### Universities
```prisma
model University {
  id          String   @id @default(cuid())
  name        String
  shortName   String?
  city        String
  province    String
  latitude    Float
  longitude   Float
  website     String?
  logo        String?
  
  proximity   UniversityProximity[]
  partnerships UniversityPartnership[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

*See full schema in Prisma format for all tables (Accounts, Sessions, SavedProperty, Viewing, Inquiry, Booking, UniversityProximity, UniversityPartnership)*

---

## API Design

### API Versioning

- Base path: `/api/v1/` (version 1 for MVP)
- Future versions: `/api/v2/` when breaking changes needed
- Deprecation policy: Support previous version for 6 months

### RESTful API Endpoints

#### Authentication
```
POST   /api/v1/auth/signin
POST   /api/v1/auth/signout
POST   /api/v1/auth/signup
GET    /api/v1/auth/session
POST   /api/v1/auth/oauth/[provider]
POST   /api/v1/auth/refresh
```

#### Properties
```
GET    /api/v1/properties              // List with filters
GET    /api/v1/properties/:id          // Get details
POST   /api/v1/properties              // Create (owner)
PUT    /api/v1/properties/:id          // Update (owner)
DELETE /api/v1/properties/:id          // Delete (owner)
GET    /api/v1/properties/nearby       // Properties near university
```

#### Users
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
GET    /api/v1/users/me/saved
POST   /api/v1/users/me/saved
DELETE /api/v1/users/me/saved/:id
GET    /api/v1/users/me/viewings
POST   /api/v1/users/me/viewings
```

#### Verification
```
POST   /api/v1/verification/book
GET    /api/v1/verification/reports/:id
GET    /api/v1/verification/packages
POST   /api/v1/verification/orders
GET    /api/v1/verification/orders/me
POST   /api/v1/verification/checkout-link
POST   /api/v1/verification/webhooks/stripe
```

Verification model:
- Property listings are publicly viewable.
- Verification is a paid workflow initiated by the user.
- A verification report is generated and accessible after successful package booking/payment and completion.
- Paid verification orders are stored per-user and shown in the tenant profile.
- Standard package can use Stripe hosted checkout with webhook confirmation (`checkout.session.completed`).

#### Universities
```
GET    /api/v1/universities
GET    /api/v1/universities/:id
GET    /api/v1/universities/:id/properties
POST   /api/v1/universities/partnership
```

### API Response Format

```typescript
// Success
{
  success: true,
  data: T,
  meta?: {
    page?: number,
    limit?: number,
    total?: number
  }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### WebSocket Events

```typescript
// Client → Server
'property:inquiry'      // Send inquiry
'viewing:schedule'      // Schedule viewing
'chat:message'         // Send chat message

// Server → Client
'notification:new'      // New notification
'property:updated'      // Property status changed
'booking:status'        // Booking status update
'chat:message'          // Receive chat message
```

---

## Hosting & Infrastructure

### MVP Hosting Stack

| Service | Provider | Cost | Notes |
|---------|----------|------|-------|
| **Backend API** | Railway | $10-20/month | Free tier available |
| **Web Apps** | Vercel | **Free** | Perfect for MVP |
| **Mobile Builds** | EAS | **Free** | 30 builds/month |
| **Database** | Supabase | **Free** | 500MB, perfect for MVP |
| **Redis Cache** | Upstash | **Free** | 10K commands/day |
| **File Storage** | Cloudinary | **Free** | 25GB storage |
| **Search** | PostgreSQL | **Free** | Built-in full-text |
| **Email** | Mailchimp | **Free** | 500 contacts, 2.5K emails/month |
| **Analytics** | PostHog | **Free** | 1M events/month |
| **Error Monitoring** | Sentry | **Free** | 5K events/month |
| **Maps** | Google Maps | ~$200/month | Main cost |
| **App Stores** | Apple/Google | $124/year | One-time fees |

**Total MVP Cost: ~$210-230/month** (mostly Google Maps)

### Production Hosting Stack

| Service | Provider | Cost |
|---------|----------|------|
| **Backend API** | Railway Pro | $20-50/month |
| **Web Apps** | Vercel Pro | $20/month |
| **Mobile Builds** | EAS Production | $29/month |
| **Database** | Neon/Railway | $19-25/month |
| **Redis Cache** | Redis Cloud | $10/month |
| **File Storage** | Cloudinary Plus | $99/month |
| **Search** | Algolia | $99/month |
| **Email** | Mailchimp Essentials | $13/month | 500 contacts, 5K emails |
| **Analytics** | PostHog | **Free** | 1M events/month (or $450/month for 10M) |
| **Error Monitoring** | Sentry Team | $26/month |
| **Maps** | Google Maps | $200-500/month |

**Total Production Cost: ~$550-900/month**

### Hosting Details

#### Backend API: Railway (Recommended)
- Excellent for NestJS
- PostgreSQL included
- Simple deployment: Git push to deploy
- Free tier: $5 credit/month
- Estimated MVP Cost: $10-20/month

#### Frontend Web Apps: Vercel
- Made for Next.js
- Zero configuration
- Edge network: Global CDN
- Free tier: Generous
- Preview deployments for PRs

#### Mobile Apps: EAS (Expo Application Services)
- Built for Expo
- Over-the-air updates
- Cloud builds for iOS/Android
- Free tier: 30 builds/month

#### Database: Supabase (MVP) → Neon (Production)
- **MVP**: Supabase free tier (500MB)
- **Production**: Neon ($19/month, 10GB) or Railway ($20/month, 10GB)

#### Cache: Upstash (MVP) → Redis Cloud (Production)
- **MVP**: Upstash free tier (10K commands/day)
- **Production**: Redis Cloud ($10/month, 100MB)

#### File Storage: Cloudinary (MVP) → AWS S3 (Production)
- **MVP**: Cloudinary free tier (25GB)
- **Production**: Cloudinary Plus ($99/month) or AWS S3 + CloudFront

#### Email Service: Mailchimp
- **MVP**: Free tier (500 contacts, 2.5K emails/month)
- **Production**: Essentials ($13/month) or Standard ($20/month)
- **Use Cases**: Marketing emails, newsletters, transactional emails
- **Integration**: Mailchimp API for automated campaigns

#### Analytics: PostHog
- **MVP**: Free tier (1M events/month)
- **Production**: Free tier sufficient for most use cases (or $450/month for 10M events)
- **Features**: Product analytics, user behavior tracking, feature flags, session recordings
- **Integration**: PostHog JavaScript SDK for web, React Native SDK for mobile

### Regional Considerations

**Target Markets**: Toronto, Calgary (Canada)

- **Data Residency**: US East region (closest to Canada, acceptable for PIPEDA)
- **Performance**: Vercel edge network covers Canada, <50ms latency
- **Compliance**: Ensure data processing agreements with providers

---

## Security

### Authentication & Authorization
- **JWT Tokens**: Short-lived access tokens (15 min), long-lived refresh tokens (7 days)
- **HTTPS Only**: All communication encrypted
- **CSRF Protection**: Token-based CSRF protection for web apps
- **Rate Limiting**: 
  - Auth endpoints: 5 requests/minute per IP
  - API endpoints: 100 requests/minute per user
  - Implement using Redis + NestJS throttler
- **Password Hashing**: bcrypt with salt rounds (10+)
- **Token Storage**: 
  - Web: httpOnly cookies for refresh tokens
  - Mobile: Secure storage (Keychain/Keystore)

### Data Protection
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Prisma ORM (parameterized queries)
- **XSS Prevention**: React auto-escaping, sanitize user inputs
- **CORS Configuration**: Whitelist allowed origins
- **Environment Variables**: Never commit secrets, use secure storage

### Payment Security
- **PCI Compliance**: Handled by Stripe (no card data stored)
- **Webhook Verification**: Verify Stripe webhook signatures
- **Secure Payment Flow**: Server-side payment processing only

### Additional Security Measures
- **Rate Limiting**: Per-user and per-IP limits
- **Request Size Limits**: Prevent DoS attacks
- **Input Sanitization**: Sanitize all user inputs
- **Error Messages**: Don't expose sensitive information
- **Logging**: Log security events (failed logins, suspicious activity)
- **Monitoring**: Alert on security anomalies

---

## Development Workflow

### Monorepo Structure

**Tools**: Nx (Recommended) or Turborepo

```
zip-platform/
├── apps/
│   ├── api/                 # NestJS backend
│   ├── web-public/          # Public Next.js site
│   ├── web-owner/           # Owner dashboard
│   ├── mobile-tenant/       # React Native tenant app
│   └── mobile-operator/     # React Native operator app
├── packages/
│   ├── shared/              # Shared TypeScript types
│   ├── ui-components/        # Shared shadcn/ui primitives and composed UI components
│   ├── database/            # Prisma schema & client
│   └── config/              # Shared configs
└── package.json
```

### Version Control
- **Repository**: GitHub
- **Branching Strategy**: Git Flow
  - `main`: Production
  - `develop`: Development
  - `feature/*`: Feature branches
  - `hotfix/*`: Hotfix branches

### Code Quality
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: 
  - Unit Tests: Jest + React Testing Library (frontend), Jest (NestJS backend)
  - Integration Tests: Test API endpoints with test database
  - E2E Tests: Playwright (future, post-MVP)
  - Coverage Goal: 70%+ for critical paths
- **Pre-commit**: Husky + lint-staged
- **Code Review**: Required for all PRs

### Deployment & DevOps

#### Version Control: GitHub
- **Repository**: GitHub (private or public)
- **Branching Strategy**: Git Flow
  - `main`: Production (protected branch)
  - `develop`: Development (staging deployments)
  - `feature/*`: Feature branches
  - `hotfix/*`: Hotfix branches
- **Pull Requests**: Required for all merges to `main` and `develop`
- **Code Review**: Required before merging

#### Environments
- **Development**: Local development
- **Staging**: Auto-deploy on `develop` branch (Railway + Vercel)
- **Production**: Manual deployment from `main` branch
- **Preview**: Automatic preview deployments for PRs (Vercel)

#### CI/CD Pipeline (GitHub Actions)

**Workflow Structure:**
```yaml
# .github/workflows/ci.yml
- On push to develop/main
- Run linting (ESLint)
- Run type checking (TypeScript)
- Run tests (Jest)
- Build applications
- Deploy to staging/production
```

**Pipeline Stages:**
1. **Lint & Type Check**: ESLint + TypeScript
2. **Test**: Unit tests + Integration tests
3. **Build**: Build all applications
4. **Deploy**: Deploy to appropriate environment

#### Deployment Process

**Backend (Railway)**
1. Connect GitHub repository to Railway
2. Railway auto-detects NestJS project
3. Configure environment variables in Railway dashboard
4. Push to `main` branch → Railway auto-builds
5. Runs database migrations (Prisma) automatically
6. Health check before going live
7. Rollback available via Railway dashboard

**Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Vercel auto-detects Next.js projects
3. Configure environment variables in Vercel dashboard
4. Push to `main` branch → Vercel auto-builds and deploys
5. Preview deployments for all PRs (automatic)
6. Rollback available via Vercel dashboard

**Database Migrations**
1. Create migration: `npx prisma migrate dev --name migration_name`
2. Test migration on local/staging database
3. Backup production database before migration
4. Run migration: `npx prisma migrate deploy`
5. Verify migration success
6. Rollback plan ready (if needed)

**Mobile Apps (EAS Build)**
1. Configure `eas.json` with build profiles
2. Run `eas build --platform ios/android`
3. Builds run in cloud (EAS)
4. Download builds or submit to app stores
5. Over-the-air updates: `eas update`

#### Environment Variables Management

**Development (Local)**
- Use `.env` files (never commit to Git)
- `.env.example` template in repository
- Required variables documented in README

**Staging/Production**
- **Railway**: Environment variables in dashboard
- **Vercel**: Environment variables in dashboard
- **Supabase**: Connection strings in dashboard
- **Never commit secrets to Git**

**Required Environment Variables:**
```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Services
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
POSTHOG_API_KEY=
POSTHOG_HOST=
GOOGLE_MAPS_API_KEY=
SENTRY_DSN=

# OAuth (Coming Soon)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
LINE_CHANNEL_ID=
LINE_CHANNEL_SECRET=
YAHOO_JAPAN_CLIENT_ID=
YAHOO_JAPAN_CLIENT_SECRET=
```

#### Monitoring & Logging

**Error Monitoring: Sentry**
- Automatic error tracking
- Performance monitoring
- Release tracking
- Alerts on errors

**Analytics: PostHog**
- User behavior tracking
- Feature flags
- Session recordings
- Product analytics

**Application Logs**
- **Railway**: Built-in logs dashboard
- **Vercel**: Built-in logs dashboard
- **Structured Logging**: Use Winston or Pino for backend

**Health Checks**
- **Backend**: `/health` endpoint for Railway
- **Frontend**: Vercel automatically monitors
- **Database**: Connection health checks

#### Rollback Strategy

**Backend (Railway)**
- Instant rollback to previous deployment
- Access via Railway dashboard
- No downtime during rollback

**Frontend (Vercel)**
- Instant rollback to previous deployment
- Access via Vercel dashboard
- Automatic rollback on build failure

**Database Migrations**
- Prisma migrations can be rolled back
- Always test rollback on staging first
- Keep database backups before migrations
- Document rollback steps

**Mobile Apps**
- Previous builds available in EAS
- Can rollback to previous app version
- Over-the-air updates can be reverted

#### Deployment Checklist

**Before Deploying to Production:**
- [ ] All tests passing
- [ ] Code review approved
- [ ] Environment variables configured
- [ ] Database migrations tested on staging
- [ ] Database backup created
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Rollback plan documented
- [ ] Team notified of deployment

**After Deployment:**
- [ ] Verify all services are running
- [ ] Check error monitoring (Sentry)
- [ ] Verify analytics tracking (PostHog)
- [ ] Test critical user flows
- [ ] Monitor logs for errors
- [ ] Verify database migrations applied
- [ ] Check API endpoints responding
- [ ] Verify frontend loads correctly

---

## Timeline & Costs

### Development Timeline

**MVP: 7-8 Weeks**

- **Week 1-2**: Setup monorepo, NestJS backend API, database
- **Week 3-4**: Public website + Owner dashboard (Next.js)
- **Week 5-6**: Mobile app (React Native/Expo)
- **Week 7-8**: Polish, testing, deployment

### Cost Estimates

**MVP Monthly Costs: ~$210-230/month**
- Railway (Backend): $10-20/month
- Vercel (Web Apps): Free
- Supabase (Database): Free
- Upstash (Redis): Free
- Cloudinary (Storage): Free
- Google Maps: ~$200/month (main cost)
- Mailchimp (Email): Free (500 contacts, 2.5K emails/month)
- PostHog (Analytics): Free (1M events/month)
- Sentry (Error Monitoring): Free (5K events/month)

**Production Monthly Costs: ~$550-900/month**
- Railway Pro: $20-50/month
- Vercel Pro: $20/month
- Database: $19-25/month
- Redis Cloud: $10/month
- Cloudinary Plus: $99/month
- Algolia: $99/month
- Mailchimp Essentials: $13/month (or Standard $20/month)
- PostHog: Free (or $450/month for 10M events)
- Google Maps: $200-500/month
- Sentry Team: $26/month

### Scalability Path

1. **MVP**: Monolithic NestJS API
2. **Year 1**: Modular services (same codebase)
3. **Year 2+**: Microservices (split modules)

**Migration Path**: NestJS modules → Separate services (gradual)

---

## Next Steps

1. **Set up development environment**
   - Install Node.js, Git
   - Create GitHub repository
   - Set up Railway account (backend)
   - Set up Vercel account (frontend)
   - Set up Supabase account (database)
   - Set up Upstash account (Redis)
   - Set up Mailchimp account (email marketing)
   - Set up PostHog account (analytics)
   - Set up Sentry account (error monitoring)

2. **Initialize project**
   - Set up monorepo (Nx or Turborepo)
   - Create NestJS backend API
   - Create Next.js frontend apps
   - Install dependencies
   - Set up Prisma
   - Configure environment variables

3. **Build core features**
   - NestJS API endpoints
   - Authentication system
   - Database schema and migrations
  - Frontend pages (Next.js)
  - shadcn/ui component implementation
   - API integration (frontend → backend)

4. **Add integrations**
   - Google Maps
   - Cloudinary
   - Stripe
   - Mailchimp (email marketing)
   - PostHog (analytics)
   - Sentry (error monitoring)

5. **Deploy and test**
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Configure environment variables
   - Test all features
   - Gather feedback
   - Iterate

---

*Last Updated: [Current Date]*
*Version: 1.0 - Merged Technical Documentation*
