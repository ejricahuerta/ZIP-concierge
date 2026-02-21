# ZIP Platform Documentation

Complete documentation for the ZIP Platform MVP - a rental marketplace for international students with paid on-demand property verification.

## 📋 Documentation Index

### Business & Strategy
- **[BUSINESS_ANALYSIS.md](./BUSINESS_ANALYSIS.md)** - Business model, stakeholders, pricing, target audience, market analysis

### Technical
- **[TECHNICAL.md](./TECHNICAL.md)** - Complete technical documentation: architecture, tech stack, database schema, API design, hosting, security, and development workflow
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Developer onboarding: setup, installation, local development (Docker & manual), first contribution
- **[TESTING_STRATEGY.md](./TESTING_STRATEGY.md)** - Comprehensive testing strategy: unit, integration, and E2E tests
- **[MOBILE_APP_STORE_SUBMISSION.md](./MOBILE_APP_STORE_SUBMISSION.md)** - Complete guide for iOS and Android app store submission
- **[KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md)** - MVP scope, known limitations, and planned improvements
- **[COMPLIANCE_LEGAL.md](./COMPLIANCE_LEGAL.md)** - PIPEDA compliance, privacy requirements, and legal considerations

---

## 🚀 Quick Start

1. **Understand the Business**: Read [BUSINESS_ANALYSIS.md](./BUSINESS_ANALYSIS.md)
2. **Review Technical Documentation**: Read [TECHNICAL.md](./TECHNICAL.md)
3. **Quick Reference**: See Quick Reference section below

---

## 📊 Document Overview

| Document | Purpose | Audience |
|----------|---------|----------|
| **BUSINESS_ANALYSIS.md** | Business model, market, stakeholders | Business, Investors |
| **TECHNICAL.md** | Complete technical documentation: architecture, implementation, hosting | Developers, Tech Leads, DevOps |

---

## 🎯 Key Decisions Summary

- **Architecture**: API-first with separate NestJS backend
- **Frontend**: Next.js 14+ for web apps
- **Web UI**: shadcn/ui + Tailwind CSS
- **Mobile**: React Native (Expo) for code sharing
- **Database**: PostgreSQL + Prisma
- **Hosting**: Railway (backend), Vercel (web), Supabase (database)
- **Timeline**: 7-8 weeks MVP

### Product Rule: Listings vs Verification
- **Listings**: Users can browse all property listings without paying.
- **Verification**: Users pay to book a verification package (Standard/Comprehensive/Premium) for a property.
- **Verification reports**: Reports are available after paid booking and completion.

### Tenant Flow (Current App)
1. Tenant signs up or logs in.
2. Tenant browses all listings and opens a property detail.
3. Tenant chooses **Verify This Property**.
4. Tenant selects a package and proceeds to payment.
5. After payment, the verification purchase appears in the tenant profile under **Verifications**.

Stripe (current Standard package integration):
- Standard package uses hosted Stripe Checkout.
- App creates a pending verification payment reference before redirect.
- Stripe webhook marks payment as paid and verification appears in profile even if the user does not return immediately.
- `/verify/success` is now a confirmation/status page only.

---

## 📦 Quick Tech Stack Reference

### Core Stack
- **Backend API**: NestJS (TypeScript) - REST API, WebSocket, GraphQL (future)
- **Frontend Web**: Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS
- **Mobile Apps**: React Native (Expo) - iOS & Android
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (Upstash - serverless)
- **Search**: PostgreSQL → Algolia
- **File Storage**: Cloudinary → AWS S3
- **Maps**: Google Maps API
- **Email**: Mailchimp
- **Analytics**: PostHog
- **Payments**: Stripe
- **Error Monitoring**: Sentry

### Authentication
- **Backend**: NestJS Passport + JWT
- **Web**: NextAuth.js
- **Mobile**: Direct API with JWT
- **Providers**: Google, Email/Password, Kakao, Naver, LINE, Yahoo Japan (coming soon)

### App Communication
```
Mobile Apps ──┐
              ├──> [NestJS API] ──> [PostgreSQL]
Web Apps   ───┘         │
                        ├──> [Redis Cache]
                        └──> [WebSocket]
```

### Development Timeline
- **MVP**: 7-8 weeks
  - Week 1-2: Backend API setup
  - Week 3-4: Web applications
  - Week 5-6: Mobile applications
  - Week 7-8: Polish & deploy

### Cost Estimates
- **MVP**: ~$210-230/month (mostly Google Maps API)
- **Production**: ~$550-900/month

### Scalability Path
1. **MVP**: Monolithic NestJS API
2. **Year 1**: Modular services (same codebase)
3. **Year 2+**: Microservices (split modules)

**For detailed information, see the full documentation files above.**

---

*Last Updated: [Current Date]*
