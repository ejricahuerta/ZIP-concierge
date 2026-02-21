# Known Limitations & MVP Scope

Document outlining what's included and excluded in the MVP, known limitations, and planned improvements.

---

## MVP Scope

### ✅ What's Included in MVP

#### Core Features
- ✅ Property browsing and search
- ✅ Property detail pages
- ✅ User authentication (Google, Email/Password)
- ✅ User profiles
- ✅ Saved properties
- ✅ Property inquiries (basic messaging)
- ✅ University proximity search
- ✅ Basic property filters (price, location, type)
- ✅ Property verification service booking
- ✅ Payment processing (Stripe)
- ✅ Owner dashboard (basic)
- ✅ Mobile apps (iOS & Android)

#### Technical Features
- ✅ REST API (NestJS backend)
- ✅ WebSocket support (basic real-time notifications)
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ Image upload (Cloudinary)
- ✅ Google Maps integration
- ✅ Email notifications (Mailchimp)
- ✅ Analytics (PostHog)
- ✅ Error monitoring (Sentry)

#### Geographic Coverage
- ✅ Toronto (fully supported)
- ⚠️ Calgary (marked as "Coming Soon" - UI only)

---

## ❌ What's NOT Included in MVP

### Authentication
- ❌ Kakao Login (Korea) - Coming Soon
- ❌ Naver Login (Korea) - Coming Soon
- ❌ LINE Login (Japan) - Coming Soon
- ❌ Yahoo Japan Login - Coming Soon
- ⚠️ Google OAuth web flow is not wired yet (email/password sign-in is available)

### Features
- ❌ Advanced search filters (multiple criteria, saved searches)
- ❌ Property comparison tool
- ❌ In-app chat (real-time messaging between tenant and owner)
- ❌ Video calls for property viewings
- ❌ Property booking/reservation system
- ❌ Review and rating system
- ❌ Property owner analytics dashboard
- ❌ Automated email campaigns
- ❌ SMS notifications
- ❌ Push notifications (mobile)
- ❌ Property recommendations (AI-powered)
- ❌ Multi-language support (English only for MVP)
- ❌ Currency conversion
- ❌ Property verification operator app
- ❌ Admin dashboard (full-featured)
- ❌ Reporting and analytics dashboard
- ❌ Bulk property upload
- ❌ Property import from other platforms

### Technical
- ❌ GraphQL API (REST only)
- ❌ Advanced caching strategies
- ❌ CDN optimization
- ❌ Database read replicas
- ❌ Microservices architecture (monolithic for MVP)
- ❌ Advanced monitoring and alerting
- ❌ Automated backup and recovery
- ❌ Multi-region deployment
- ❌ Advanced security features (2FA, etc.)

### Geographic
- ❌ Calgary (actual listings - UI shows "Coming Soon")
- ❌ Other Canadian cities
- ❌ International expansion

---

## Known Limitations

### 1. Search Limitations

**Current State:**
- Basic full-text search using PostgreSQL
- Limited filter options
- No typo tolerance
- No fuzzy matching
- No search suggestions/autocomplete

**Impact:**
- Users may not find properties if they misspell search terms
- Search may be slower with large datasets
- Limited filtering capabilities

**Workaround:**
- Use exact location names
- Use filters to narrow results
- Search by university name

**Future Solution:**
- Migrate to Algolia for advanced search
- Add autocomplete
- Add typo tolerance
- Add search suggestions

---

### 2. Real-Time Features

**Current State:**
- Basic WebSocket support
- Limited real-time notifications
- No in-app chat
- No live property updates

**Impact:**
- Users may not see updates immediately
- Communication between tenant and owner is limited
- No real-time property status updates

**Workaround:**
- Refresh page to see updates
- Use email for communication
- Check property status manually

**Future Solution:**
- Full WebSocket implementation
- Real-time chat
- Live property status updates
- Push notifications

---

### 3. Mobile App Features

**Current State:**
- Basic mobile app functionality
- No push notifications
- Limited offline support
- No app store submission (initially)

**Impact:**
- Users won't receive push notifications
- App requires internet connection
- Limited mobile-specific features

**Workaround:**
- Check app manually for updates
- Use web version if needed

**Future Solution:**
- Push notifications (FCM)
- Offline support
- App store distribution
- Mobile-specific features

---

### 4. Payment Processing

**Current State:**
- Payment flow exists for verification services; Standard package uses hosted Stripe Checkout with webhook confirmation, while other packages still use a simulated in-app MVP flow
- No subscription payments
- No rental payment processing
- No escrow services

**Impact:**
- Can only process verification service payments
- No recurring payments for property owners
- No payment protection for tenants

**Workaround:**
- Manual payment processing for subscriptions
- External payment for rentals

**Future Solution:**
- Subscription payments
- Rental payment processing
- Escrow services
- Payment protection

---

### 5. Property Verification

**Current State:**
- Manual verification booking
- No operator app
- Limited verification report features
- No automated scheduling

**Impact:**
- Verification process is manual
- Limited operator tools
- Slower verification turnaround

**Workaround:**
- Manual coordination with operators
- Email-based communication

**Future Solution:**
- Operator mobile app
- Automated scheduling
- Enhanced verification reports
- Real-time verification status

---

### 6. Analytics & Reporting

**Current State:**
- Basic PostHog analytics
- No custom dashboards
- Limited reporting
- No business intelligence

**Impact:**
- Limited insights into user behavior
- No custom analytics
- Limited business metrics

**Workaround:**
- Use PostHog default reports
- Manual data analysis

**Future Solution:**
- Custom analytics dashboards
- Business intelligence tools
- Advanced reporting
- Data export capabilities

---

### 7. Scalability

**Current State:**
- Monolithic architecture
- Single database instance
- Limited horizontal scaling
- No load balancing

**Impact:**
- May experience performance issues at scale
- Limited ability to handle traffic spikes
- Single point of failure

**Workaround:**
- Optimize queries
- Use caching
- Monitor performance

**Future Solution:**
- Microservices architecture
- Database read replicas
- Load balancing
- Auto-scaling

---

### 8. Internationalization

**Current State:**
- English only
- No multi-language support
- No currency conversion
- No regional customization

**Impact:**
- Limited to English-speaking users
- No support for international students' native languages
- Currency displayed in CAD only

**Workaround:**
- Use English interface
- Manual currency conversion

**Future Solution:**
- Multi-language support (Korean, Japanese, Chinese)
- Currency conversion
- Regional customization
- Localized content

---

## Technical Debt

### 1. Database Schema
- Some fields may need optimization
- Indexes may need adjustment based on usage
- Some relationships may need refactoring

### 2. API Design
- Some endpoints may need versioning
- Response formats may need standardization
- Error handling may need improvement

### 3. Code Quality
- Some areas may need refactoring
- Test coverage may be incomplete
- Documentation may need updates

### 4. Infrastructure
- May need optimization based on usage
- Monitoring may need enhancement
- Backup strategies may need improvement

---

## Planned Improvements (Post-MVP)

### Phase 1 (Months 3-6)
- [ ] Regional login methods (Kakao, Naver, LINE, Yahoo Japan)
- [ ] Advanced search (Algolia)
- [ ] Push notifications
- [ ] In-app chat
- [ ] Calgary actual listings
- [ ] Review and rating system

### Phase 2 (Months 6-12)
- [ ] Multi-language support
- [ ] Property recommendations (AI)
- [ ] Operator mobile app
- [ ] Advanced analytics dashboard
- [ ] Subscription payments
- [ ] SMS notifications

### Phase 3 (Year 2+)
- [ ] Microservices architecture
- [ ] Multi-region deployment
- [ ] Advanced security (2FA)
- [ ] GraphQL API
- [ ] Video calls for viewings
- [ ] International expansion

---

## Workarounds for Missing Features

### For Users
- **No Chat**: Use email or phone (provided in listings)
- **No Push Notifications**: Check app manually or enable email notifications
- **Limited Search**: Use filters and exact location names
- **English Only**: Use browser translation if needed

### For Property Owners
- **No Analytics Dashboard**: Use PostHog or request reports
- **No Bulk Upload**: Upload properties one by one
- **No Automated Campaigns**: Use Mailchimp manually

### For Developers
- **No GraphQL**: Use REST API
- **No Advanced Monitoring**: Use Sentry and PostHog
- **No Microservices**: Work within monolithic structure

---

## MVP Success Criteria

### Must Have (Launch Requirements)
- ✅ Users can browse properties
- ✅ Users can search and filter properties
- ✅ Users can view property details
- ✅ Users can contact property owners
- ✅ Property owners can list properties
- ✅ Verification service can be booked
- ✅ Payment processing works
- ✅ Mobile apps function on iOS and Android

### Nice to Have (Post-Launch)
- Advanced search
- Real-time chat
- Push notifications
- Multi-language support
- Advanced analytics

---

## Risk Mitigation

### For Known Limitations
1. **Clear Communication**: Inform users about limitations
2. **Workarounds**: Provide alternative solutions
3. **Roadmap**: Share future plans with stakeholders
4. **Prioritization**: Focus on critical features first

### For Technical Debt
1. **Documentation**: Document all technical debt
2. **Prioritization**: Address high-priority items first
3. **Refactoring**: Schedule regular refactoring sprints
4. **Testing**: Ensure adequate test coverage

---

*Last Updated: [Current Date]*
*MVP Version: 1.0*
