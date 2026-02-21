# Testing Strategy: ZIP Platform

Comprehensive testing strategy covering unit tests, integration tests, and E2E tests.

---

## Testing Philosophy

- **Test Critical Paths**: Focus on user-facing features and business logic
- **Test Edge Cases**: Handle error scenarios and boundary conditions
- **Fast Feedback**: Tests should run quickly for developer productivity
- **Maintainable Tests**: Tests should be easy to read and update
- **Coverage Goal**: 70%+ for critical paths, 50%+ overall

---

## Testing Stack

### Backend (NestJS)
- **Framework**: Jest
- **Test Runner**: Jest
- **Assertions**: Jest built-in
- **Mocks**: Jest mocks
- **HTTP Testing**: Supertest
- **Database Testing**: Test database with Prisma

### Frontend (Next.js/React)
- **Framework**: Jest + React Testing Library
- **Test Runner**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright (future)
- **Visual Testing**: (Future consideration)

### Mobile (React Native)
- **Framework**: Jest + React Native Testing Library
- **Test Runner**: Jest
- **Component Testing**: React Native Testing Library
- **E2E Testing**: Detox (future)

---

## Test Structure

### Directory Structure

```
apps/
├── api/
│   ├── src/
│   │   ├── users/
│   │   │   ├── users.controller.spec.ts
│   │   │   ├── users.service.spec.ts
│   │   │   └── users.controller.integration.spec.ts
│   └── test/
│       ├── setup.ts
│       ├── helpers.ts
│       └── fixtures/
│           └── user.fixture.ts
├── web-public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Button/
│   │   │       └── Button.test.tsx
│   └── __tests__/
│       └── pages/
│           └── index.test.tsx
└── mobile-tenant/
    └── src/
        └── __tests__/
            └── components/
```

---

## Unit Tests

### Backend Unit Tests

**Purpose**: Test individual functions, services, and utilities in isolation.

**Example: User Service Test**

```typescript
// apps/api/src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', email: 'test@example.com' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('User not found');
    });
  });
});
```

### Frontend Unit Tests

**Example: Button Component Test**

```typescript
// apps/web-public/src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

---

## Integration Tests

### Backend Integration Tests

**Purpose**: Test API endpoints with database interactions.

**Example: Users Controller Integration Test**

```typescript
// apps/api/src/users/users.controller.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersController (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current user', async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      // Mock authentication (JWT token)
      const token = 'valid-jwt-token';

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401);
    });
  });
});
```

### Test Database Setup

```typescript
// apps/api/test/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/zip_platform_test',
    },
  },
});

beforeAll(async () => {
  // Run migrations on test database
  await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS zip_platform_test`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.$executeRaw`TRUNCATE TABLE users, properties, ... CASCADE`;
});
```

---

## E2E Tests (Future - Post-MVP)

### Playwright Setup

```typescript
// apps/web-public/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('user can search for properties', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Search for properties
  await page.fill('[data-testid="search-input"]', 'Toronto');
  await page.click('[data-testid="search-button"]');
  
  // Verify results
  await expect(page.locator('[data-testid="property-card"]')).toBeVisible();
});
```

---

## Test Data Management

### Fixtures

```typescript
// apps/api/test/fixtures/user.fixture.ts
import { PrismaClient, User } from '@prisma/client';

export const createTestUser = async (
  prisma: PrismaClient,
  overrides?: Partial<User>
): Promise<User> => {
  return prisma.user.create({
    data: {
      email: overrides?.email || 'test@example.com',
      name: overrides?.name || 'Test User',
      role: overrides?.role || 'STUDENT',
      ...overrides,
    },
  });
};

export const createTestProperty = async (
  prisma: PrismaClient,
  ownerId: string,
  overrides?: Partial<Property>
): Promise<Property> => {
  return prisma.property.create({
    data: {
      title: overrides?.title || 'Test Property',
      description: 'Test description',
      type: 'PRIVATE',
      city: 'Toronto',
      price: 1000,
      ownerId,
      ...overrides,
    },
  });
};
```

### Mock Data

```typescript
// apps/api/test/helpers.ts
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'STUDENT',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProperty = {
  id: '1',
  title: 'Test Property',
  description: 'Test description',
  type: 'PRIVATE',
  city: 'Toronto',
  price: 1000,
  ownerId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

---

## Running Tests

### Run All Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Run Tests for Specific App

```bash
# Backend tests
npx nx test api

# Frontend tests
npx nx test web-public

# Mobile tests
npx nx test mobile-tenant
```

### Run Specific Test File

```bash
# Backend
npx nx test api --testPathPattern=users.service.spec

# Frontend
npx nx test web-public --testPathPattern=Button.test
```

### Run Tests in CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## Test Coverage

### Coverage Goals

- **Critical Paths**: 70%+ coverage
- **Overall**: 50%+ coverage
- **Business Logic**: 80%+ coverage

### Generate Coverage Report

```bash
# Generate coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Configuration

```json
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './src/users/': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## Testing Best Practices

### 1. Test Naming

```typescript
// Good
describe('UsersService', () => {
  describe('findOne', () => {
    it('should return a user when user exists', () => {});
    it('should throw NotFoundException when user does not exist', () => {});
  });
});

// Bad
describe('UsersService', () => {
  it('test 1', () => {});
  it('works', () => {});
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should create a user', async () => {
  // Arrange
  const userData = { email: 'test@example.com', name: 'Test' };
  
  // Act
  const result = await service.create(userData);
  
  // Assert
  expect(result.email).toBe(userData.email);
});
```

### 3. Test Isolation

- Each test should be independent
- Clean up after each test
- Don't rely on test execution order

### 4. Mock External Services

```typescript
// Mock external API calls
jest.mock('@nestjs/axios', () => ({
  HttpService: {
    get: jest.fn().mockResolvedValue({ data: { result: 'success' } }),
  },
}));
```

### 5. Test Error Cases

```typescript
it('should handle database errors', async () => {
  jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error('DB Error'));
  
  await expect(service.create(userData)).rejects.toThrow('DB Error');
});
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: zip_platform_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Testing Checklist

### Before Committing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Test coverage meets requirements
- [ ] No skipped or disabled tests
- [ ] Tests are fast (< 5 seconds for unit tests)

### Before Merging PR
- [ ] All tests pass in CI/CD
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Test coverage hasn't decreased
- [ ] Code review includes test review

---

*Last Updated: [Current Date]*
