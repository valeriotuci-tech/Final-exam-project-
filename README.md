# 🍽️ TastyFund - Restaurant Crowdfunding Platform

[![Backend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-deploy.yml)
[![Frontend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-deploy.yml)
[![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml)

Full-stack crowdfunding platform for food and restaurant projects with enterprise-grade security, monitoring, and performance optimizations.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 💰 **Campaign Management** - Create and manage crowdfunding campaigns
- 🎁 **Reward Tiers** - Multiple reward levels for backers
- 📊 **Real-time Analytics** - Track campaign progress and investments
- 🔒 **Enterprise Security** - Helmet, rate limiting, XSS protection
- 📈 **Performance Monitoring** - Sentry integration for error tracking
- 📚 **API Documentation** - Interactive Swagger/OpenAPI docs
- 🧪 **Comprehensive Testing** - Unit, integration, and E2E tests
- 🚀 **CI/CD Pipeline** - Automated testing and deployment

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library, Playwright
- **Monitoring**: Sentry
- **Deployment**: Vercel

### Backend (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Railway)
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, rate limiting, XSS protection
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Monitoring**: Sentry
- **Testing**: Jest, Supertest
- **Deployment**: Railway

### Database Schema
- Users (authentication & profiles)
- Restaurants (business entities)
- Campaigns (crowdfunding campaigns)
- Rewards (reward tiers)
- Investments (user contributions)

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Final-exam-project-.git
   cd Final-exam-project-
   ```

2. **Install dependencies**
   ```bash
   # Install all workspace dependencies
   npm install
   
   # Or install individually
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Setup environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tastyfund
   JWT_SECRET=your-secret-key-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
   CORS_ORIGIN=http://localhost:3000
   SENTRY_DSN=your-sentry-dsn (optional)
   NODE_ENV=development
   ```
   
   **Frontend** (Vercel Environment Variables):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn (optional)
   ```

4. **Setup database**
   ```bash
   cd backend
   npm run db:setup  # Runs migrations and seeds
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - API Docs: http://localhost:4000/api-docs

## 📝 Available Scripts

### Root Scripts
```bash
npm run dev          # Start both frontend and backend in development mode
npm run build        # Build both frontend and backend for production
npm run start        # Start both in production mode
npm test             # Run all tests
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm test             # Run all tests with coverage
npm run test:unit    # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch   # Run tests in watch mode
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (development only)
npm run db:setup     # Run migrations and seed
```

### Frontend Scripts
```bash
cd frontend
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🔐 Environment Variables

### Backend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret for access tokens (min 32 chars) | Yes | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (min 32 chars) | Yes | - |
| `CORS_ORIGIN` | Allowed frontend origin(s) | No | `http://localhost:3000` |
| `PORT` | Backend server port | No | `4000` |
| `NODE_ENV` | Environment (development/production) | No | `development` |
| `SENTRY_DSN` | Sentry error tracking DSN | No | - |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No | `info` |

### Frontend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | No | - |

See `.env.example` files in each directory for templates.

## 🧪 Testing

### Run All Tests
```bash
# Root
npm test

# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Test Coverage
```bash
# Backend
cd backend && npm run test:coverage

# Frontend
cd frontend && npm run test:coverage
```

### E2E Tests
```bash
cd frontend
npm run test:e2e        # Headless mode
npm run test:e2e:ui     # Interactive UI
npm run test:e2e:headed # See browser
```

## 📚 Documentation

- **[Production Readiness Checklist](./PRODUCTION_READINESS.md)** - Complete deployment guide
- **[Testing Guide](./TESTING_GUIDE.md)** - Comprehensive testing documentation
- **[Database Scripts](./backend/DATABASE_SCRIPTS.md)** - Migration and seeding guide
- **[API Documentation](http://localhost:4000/api-docs)** - Interactive Swagger docs (when running)
- **[CI/CD Workflows](./.github/workflows/README.md)** - GitHub Actions documentation

## 🚀 Deployment

### Backend (Railway)

1. **Setup Railway project**
   ```bash
   railway login
   railway link
   ```

2. **Configure environment variables** in Railway dashboard

3. **Deploy**
   ```bash
   railway up
   ```

4. **Run migrations**
   ```bash
   railway run npm run db:migrate
   ```

### Frontend (Vercel)

1. **Setup Vercel project**
   ```bash
   cd frontend
   vercel login
   vercel link
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Automated Deployment

Push to `main` branch triggers automatic deployment via GitHub Actions:
- Backend → Railway
- Frontend → Vercel

## 🔒 Security

- ✅ Helmet.js for security headers
- ✅ Rate limiting on all endpoints
- ✅ Input sanitization and validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Environment variable protection

## 📊 Monitoring

- **Error Tracking**: Sentry integration
- **Logging**: Winston with file rotation
- **Health Checks**: `/health`, `/health/ready`, `/health/live`
- **Performance**: Sentry performance monitoring
- **API Docs**: Swagger/OpenAPI at `/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Create a branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass (`npm test`)
5. Create a Pull Request
6. Wait for CI/CD checks to pass
7. Request review from team members

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend**: Express.js, PostgreSQL, Railway
- **Frontend**: Next.js, React, Vercel
- **DevOps**: GitHub Actions, Railway, Vercel

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)

## 🎯 Roadmap

- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Admin panel

## 📈 Status

- **Backend**: ✅ Production Ready
- **Frontend**: ✅ Production Ready
- **Database**: ✅ Migrated and Seeded
- **CI/CD**: ✅ Automated
- **Monitoring**: ✅ Configured
- **Documentation**: ✅ Complete

---

**Built with ❤️ by the TastyFund Team**
