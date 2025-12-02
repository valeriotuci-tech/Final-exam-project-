# Testing Setup Instructions

Quick setup guide to get testing infrastructure running.

## 🚀 One-Time Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `jest` - Test framework
- `ts-jest` - TypeScript support for Jest
- `supertest` - HTTP testing
- `@types/jest` - TypeScript definitions
- `@types/supertest` - TypeScript definitions

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- `jest` - Test framework
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - DOM matchers
- `@playwright/test` - E2E testing
- `msw` - API mocking
- All necessary type definitions

### 3. Install Playwright Browsers

```bash
cd frontend
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for E2E testing.

### 4. Setup Test Database (Backend)

```bash
# Create test database
createdb tastyfund_test

# Run schema
psql tastyfund_test < backend/src/database/schema.sql
```

Or copy `.env.test.example` to `.env.test` and configure:
```bash
cd backend
cp .env.test.example .env.test
# Edit .env.test with your test database credentials
```

---

## ✅ Verify Installation

### Backend

```bash
cd backend
npm run test:unit
```

Expected output:
```
PASS tests/unit/auth.service.test.ts
PASS tests/unit/validation.test.ts

Test Suites: 2 passed, 2 total
Tests:       XX passed, XX total
```

### Frontend

```bash
cd frontend
npm test -- --passWithNoTests
```

Expected output:
```
No tests found
```

(This is normal - tests will run once you have actual components)

### E2E Tests

```bash
cd frontend
npm run test:e2e
```

Expected output:
```
Running XX tests using X workers
  XX passed (XXs)
```

---

## 🎯 Quick Test Commands

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# E2E
cd frontend && npm run test:e2e
```

### Development Mode

```bash
# Backend (watch mode)
cd backend && npm run test:watch

# Frontend (watch mode)
cd frontend && npm run test:watch
```

### Coverage Reports

```bash
# Backend
cd backend && npm run test:coverage
open coverage/index.html

# Frontend
cd frontend && npm run test:coverage
open coverage/index.html
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors

**Solution**: Install dependencies
```bash
cd backend && npm install
cd frontend && npm install
```

### "Playwright browsers not installed"

**Solution**: Install Playwright browsers
```bash
cd frontend
npx playwright install
```

### "Database connection failed"

**Solution**: Check database is running and credentials are correct
```bash
# Check PostgreSQL is running
pg_isready

# Create test database if it doesn't exist
createdb tastyfund_test
```

### "Port already in use" (E2E tests)

**Solution**: Kill process on port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Tests timing out

**Solution**: Increase timeout in jest.config.js
```javascript
module.exports = {
  // ...
  testTimeout: 30000, // 30 seconds
};
```

---

## 📊 Expected Coverage

After running all tests, you should see:

**Backend**:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

**Frontend**:
- Statements: > 70%
- Branches: > 65%
- Functions: > 70%
- Lines: > 70%

---

## 🔄 CI/CD Integration

Tests are automatically run in GitHub Actions:

1. **On Pull Requests**: All tests run
2. **Before Deployment**: Tests must pass
3. **Coverage Reports**: Generated and uploaded

No additional setup needed - workflows are already configured!

---

## 📝 Next Steps

1. ✅ Install all dependencies
2. ✅ Verify tests run successfully
3. ✅ Review test files in `/tests` and `/__tests__`
4. ✅ Add tests for your specific features
5. ✅ Push to GitHub and watch CI/CD run tests

---

## 🆘 Need Help?

Check the comprehensive guide: `TESTING_GUIDE.md`

Or run:
```bash
# Backend
cd backend && npm test -- --help

# Frontend  
cd frontend && npm test -- --help

# E2E
cd frontend && npx playwright test --help
```

---

## ✨ You're All Set!

Your testing infrastructure is ready. Start writing tests and watch your code quality improve! 🎉
