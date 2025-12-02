# Testing Guide

Comprehensive testing setup for TastyFund project with unit tests, integration tests, and E2E tests.

## 📋 Overview

### Backend Testing
- **Unit Tests**: Jest for services and utilities
- **Integration Tests**: Supertest for API endpoints
- **Database Tests**: Migration and schema validation

### Frontend Testing
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright for user flows
- **API Mocking**: MSW (Mock Service Worker)

---

## 🚀 Quick Start

### Install Dependencies

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd frontend
npm install
npx playwright install  # Install Playwright browsers
```

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run all Jest tests with coverage
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

---

## 📁 Test Structure

### Backend (`/backend/tests/`)

```
tests/
├── setup.ts                          # Test configuration
├── unit/
│   ├── auth.service.test.ts         # Auth service tests
│   └── validation.test.ts           # Validation tests
└── integration/
    ├── auth.integration.test.ts     # Auth API tests
    ├── campaigns.integration.test.ts # Campaigns API tests
    └── database.migration.test.ts   # Database tests
```

### Frontend (`/frontend/`)

```
frontend/
├── __tests__/
│   └── components/
│       ├── AuthForm.test.tsx        # Auth form component tests
│       └── CampaignCard.test.tsx    # Campaign card tests
├── e2e/
│   ├── auth.spec.ts                 # Authentication E2E tests
│   ├── campaign.spec.ts             # Campaign management E2E tests
│   └── investment.spec.ts           # Investment flow E2E tests
└── lib/
    └── mocks/
        ├── handlers.ts              # MSW API handlers
        ├── server.ts                # MSW server (Node)
        └── browser.ts               # MSW browser worker
```

---

## 🎯 Test Coverage

### Backend Unit Tests

**Auth Service** (`auth.service.test.ts`):
- ✅ Password hashing
- ✅ Password comparison
- ✅ JWT token generation
- ✅ JWT token verification
- ✅ Token expiration handling

**Validation** (`validation.test.ts`):
- ✅ Email format validation
- ✅ Password strength validation
- ✅ UUID format validation
- ✅ Amount validation
- ✅ Date validation

### Backend Integration Tests

**Auth API** (`auth.integration.test.ts`):
- ✅ User registration
- ✅ User login
- ✅ Logout
- ✅ Token refresh
- ✅ Validation errors

**Campaigns API** (`campaigns.integration.test.ts`):
- ✅ List campaigns
- ✅ Get campaign by ID
- ✅ Create campaign (authenticated)
- ✅ Update campaign (authenticated)
- ✅ Delete campaign (authenticated)
- ✅ Validation errors

**Database** (`database.migration.test.ts`):
- ✅ Database connection
- ✅ Table existence
- ✅ Table structure
- ✅ Constraints and indexes
- ✅ Data integrity
- ✅ Transaction support

### Frontend Component Tests

**AuthForm** (`AuthForm.test.tsx`):
- ✅ Login form rendering
- ✅ Register form rendering
- ✅ Form submission
- ✅ Field validation

**CampaignCard** (`CampaignCard.test.tsx`):
- ✅ Campaign information display
- ✅ Progress calculation
- ✅ Amount formatting
- ✅ Status display

### Frontend E2E Tests

**Authentication** (`auth.spec.ts`):
- ✅ User registration flow
- ✅ User login flow
- ✅ User logout
- ✅ Protected routes
- ✅ Form validation

**Campaign Management** (`campaign.spec.ts`):
- ✅ View campaigns list
- ✅ View campaign details
- ✅ Create campaign
- ✅ Update campaign
- ✅ Delete campaign
- ✅ Filter campaigns

**Investment Flow** (`investment.spec.ts`):
- ✅ Make investment
- ✅ View investments
- ✅ Investment validation
- ✅ Investment confirmation
- ✅ Investment history

---

## 🔧 Configuration Files

### Backend

**`jest.config.js`**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

**`.env.test.example`**:
```env
NODE_ENV=test
DATABASE_URL=postgresql://user:password@localhost:5432/tastyfund_test
JWT_SECRET=test_jwt_secret
JWT_REFRESH_SECRET=test_refresh_secret
PORT=4001
```

### Frontend

**`jest.config.js`**:
- Uses Next.js Jest configuration
- jsdom environment for React components
- Module path mapping
- Coverage collection

**`playwright.config.ts`**:
- Tests in `/e2e` directory
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Automatic dev server startup

---

## 🎨 Writing Tests

### Backend Unit Test Example

```typescript
import bcrypt from 'bcryptjs';

describe('Password Hashing', () => {
  it('should hash password correctly', async () => {
    const password = 'testPassword123';
    const hashed = await bcrypt.hash(password, 10);
    
    expect(hashed).not.toBe(password);
    expect(await bcrypt.compare(password, hashed)).toBe(true);
  });
});
```

### Backend Integration Test Example

```typescript
import request from 'supertest';
import app from '../src/app';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });
});
```

### Frontend Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from './AuthForm';

describe('AuthForm', () => {
  it('should submit login form', async () => {
    const mockSubmit = jest.fn();
    render(<AuthForm onSubmit={mockSubmit} type="login" />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(mockSubmit).toHaveBeenCalled();
  });
});
```

### Frontend E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

---

## 🔍 API Mocking with MSW

### Setup MSW Handlers

```typescript
// lib/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      user: { id: '123', email: body.email },
      accessToken: 'mock-token',
    });
  }),
];
```

### Use in Tests

```typescript
import { server } from '@/lib/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 📊 Coverage Reports

### View Coverage

**Backend**:
```bash
cd backend
npm run test:coverage
open coverage/index.html  # or start coverage/index.html on Windows
```

**Frontend**:
```bash
cd frontend
npm run test:coverage
open coverage/index.html  # or start coverage/index.html on Windows
```

### Coverage Targets

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

---

## 🐛 Debugging Tests

### Backend

```bash
# Run specific test file
npm test -- auth.service.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should hash password"

# Run with verbose output
npm test -- --verbose
```

### Frontend

```bash
# Run specific test file
npm test -- AuthForm.test.tsx

# Run E2E tests in debug mode
npm run test:e2e:headed

# Run E2E tests with UI
npm run test:e2e:ui
```

### Playwright Debugging

```bash
# Debug specific test
npx playwright test auth.spec.ts --debug

# Generate test code
npx playwright codegen http://localhost:3000
```

---

## 🔄 CI/CD Integration

Tests are automatically run in GitHub Actions workflows:

### PR Checks (`pr-checks.yml`)
- Runs on every pull request
- Executes all unit and integration tests
- Generates coverage reports
- Fails if tests don't pass

### Deployment Workflows
- Backend: Runs tests before deploying to Railway
- Frontend: Runs tests before deploying to Vercel

---

## 📝 Best Practices

### General
1. **Write tests first** (TDD) when possible
2. **Keep tests isolated** - no dependencies between tests
3. **Use descriptive test names** - explain what is being tested
4. **Mock external dependencies** - databases, APIs, etc.
5. **Test edge cases** - not just happy paths

### Unit Tests
- Test one thing at a time
- Use mocks for dependencies
- Fast execution (< 1s per test)
- No database or network calls

### Integration Tests
- Test API endpoints end-to-end
- Use test database
- Clean up after each test
- Test error scenarios

### E2E Tests
- Test critical user flows
- Use realistic data
- Handle async operations properly
- Take screenshots on failure

---

## 🆘 Troubleshooting

### Backend Tests Failing

**Database connection errors**:
```bash
# Create test database
createdb tastyfund_test

# Run migrations
psql tastyfund_test < backend/src/database/schema.sql
```

**Module not found errors**:
```bash
cd backend
npm install
```

### Frontend Tests Failing

**Playwright browser not installed**:
```bash
npx playwright install
```

**MSW errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Port already in use**:
```bash
# Kill process on port 3000
npx kill-port 3000
```

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MSW Documentation](https://mswjs.io/)

---

## ✅ Testing Checklist

Before committing:
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Coverage meets targets (>80%)
- [ ] No console errors or warnings
- [ ] E2E tests pass for critical flows

Before deploying:
- [ ] All CI/CD tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass in CI
- [ ] No failing tests in PR

---

## 🎯 Next Steps

1. **Run tests locally** to ensure everything works
2. **Add more test cases** for your specific features
3. **Integrate with CI/CD** (already configured)
4. **Monitor coverage** and improve over time
5. **Update tests** when features change

Happy testing! 🧪
