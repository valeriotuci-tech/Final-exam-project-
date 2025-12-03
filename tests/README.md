# 🧪 TastyFund Smoke Test Suite

Comprehensive production deployment verification tests for the TastyFund application.

## 📋 What Gets Tested

### Backend Tests
1. **Health Check** - Verifies backend is running and responding
2. **Database Connectivity** - Ensures database connection is working
3. **API Documentation** - Checks if Swagger docs are accessible
4. **Authentication Flow** - Tests user registration and login endpoints
5. **Campaign Endpoints** - Verifies campaign listing functionality
6. **Restaurant Endpoints** - Tests restaurant data retrieval
7. **CORS Configuration** - Validates cross-origin resource sharing
8. **Response Time** - Measures API performance

### Frontend Tests
9. **Homepage Accessibility** - Ensures frontend is deployed and accessible
10. **Routing Verification** - Tests Next.js routing

## 🚀 Running the Tests

### Prerequisites
- Node.js installed
- Access to production URLs

### Quick Start

```bash
# Navigate to tests directory
cd tests

# Run tests with default URLs
node smoke-tests.js

# Or run with custom URLs
BACKEND_URL=https://your-backend.railway.app FRONTEND_URL=https://your-frontend.vercel.app node smoke-tests.js
```

### Using npm scripts

```bash
# Run with production URLs
npm run test:production

# Run with default URLs
npm test
```

## 📊 Understanding Results

After running tests, a `deployment-verification.md` file is generated in the project root with:

- ✅ **PASS** - Test succeeded
- ❌ **FAIL** - Test failed, action required
- ⚠️ **WARN** - Test passed with warnings

### Success Criteria

- **80%+ pass rate** - Deployment is healthy
- **60-79% pass rate** - Deployment has issues but may be functional
- **<60% pass rate** - Critical issues, deployment needs attention

## 🔧 Troubleshooting

### All Tests Failing with 404

**Cause:** Backend routes not accessible or wrong base URL

**Solutions:**
1. Check if backend is actually running in Railway dashboard
2. Verify the Railway service URL is correct
3. Check Railway logs for startup errors
4. Ensure PORT environment variable is set correctly

### Database Connectivity Fails

**Cause:** Database not connected or DATABASE_URL not set

**Solutions:**
1. Add PostgreSQL database in Railway
2. Verify DATABASE_URL environment variable
3. Check database credentials
4. Run database migrations

### CORS Warnings

**Cause:** CORS headers not properly configured

**Solutions:**
1. Update CORS_ORIGIN in Railway environment variables
2. Add frontend URL to allowed origins
3. Restart backend service after changes

### Frontend 401 Errors

**Cause:** Authentication or Vercel configuration issue

**Solutions:**
1. Check if frontend requires authentication for homepage
2. Verify NEXT_PUBLIC_API_URL is set in Vercel
3. Check Vercel deployment logs

## 📝 Test Configuration

### Environment Variables

```bash
# Backend URL (Railway)
BACKEND_URL=https://r11-production.up.railway.app

# Frontend URL (Vercel)
FRONTEND_URL=https://tasty-fund-bmm5mu53p-tanias-projects-8da0b11a.vercel.app
```

### Customizing Tests

Edit `smoke-tests.js` to:
- Add new test cases
- Modify timeout values
- Change expected status codes
- Add custom assertions

## 🔄 CI/CD Integration

### GitHub Actions

Add to your workflow:

```yaml
- name: Run Smoke Tests
  run: |
    cd tests
    npm test
  env:
    BACKEND_URL: ${{ secrets.BACKEND_URL }}
    FRONTEND_URL: ${{ secrets.FRONTEND_URL }}
```

### Post-Deployment Hook

Run automatically after deployment:

```bash
# In your deployment script
npm run deploy
cd tests && npm test
```

## 📈 Monitoring

### Recommended Tools

- **UptimeRobot** - Continuous uptime monitoring
- **Pingdom** - Performance monitoring
- **Sentry** - Error tracking (already configured in backend)
- **LogRocket** - Session replay and monitoring

### Setting Up Alerts

1. Configure UptimeRobot to check `/health` endpoint every 5 minutes
2. Set up email/SMS alerts for downtime
3. Monitor response times and set thresholds
4. Track error rates in Sentry

## 🎯 Best Practices

1. **Run tests after every deployment**
2. **Monitor trends over time** - Track success rates
3. **Set up automated alerts** - Don't rely on manual checks
4. **Keep tests updated** - Add tests for new features
5. **Document failures** - Create runbooks for common issues

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Need Help?** Check the deployment logs in Railway and Vercel dashboards for detailed error messages.
