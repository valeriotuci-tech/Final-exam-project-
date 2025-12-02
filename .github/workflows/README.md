# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing, building, and deployment.

## 📋 Workflows Overview

### 1. Backend Deploy (`backend-deploy.yml`)
**Triggers**: Push to `main` branch with changes in `backend/`

**Pipeline**:
```
Test → Build → Deploy → Migrate → Verify
```

**Steps**:
- ✅ TypeScript type checking
- ✅ Linting
- ✅ Unit tests
- ✅ Docker image build
- ✅ Deploy to Railway
- ✅ Run database migrations
- ✅ Health check verification

**Secrets Required**:
- `RAILWAY_TOKEN`
- `DATABASE_URL`

---

### 2. Frontend Deploy (`frontend-deploy.yml`)
**Triggers**: Push to `main` branch with changes in `frontend/`

**Pipeline**:
```
Test → Build → Deploy → Performance Test
```

**Steps**:
- ✅ TypeScript type checking
- ✅ ESLint & Prettier checks
- ✅ Unit tests
- ✅ Next.js build
- ✅ Deploy to Vercel
- ✅ Update Railway CORS
- ✅ Lighthouse performance tests

**Secrets Required**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RAILWAY_TOKEN` (for CORS update)

---

### 3. PR Checks (`pr-checks.yml`)
**Triggers**: Pull requests to `main` or `develop`

**Features**:
- 🎯 Smart path detection (only checks changed code)
- 📊 Comprehensive quality checks
- 🔒 Security scanning
- 📦 Bundle size monitoring
- 📝 Automated summary reports

**Checks**:
- ✅ TypeScript type checking
- ✅ ESLint & Prettier
- ✅ Unit tests
- ✅ Build verification
- ✅ Docker build (backend)
- ✅ npm audit (security)
- ✅ Bundle size check (frontend)

**No Secrets Required** (runs on PR from forks)

---

## 🚀 Quick Start

### 1. Setup Secrets
Follow the guide in [SECRETS_SETUP.md](../SECRETS_SETUP.md)

### 2. Enable Workflows
Workflows are automatically enabled when you push them to your repository.

### 3. Test the Workflows

**Test Backend Deployment**:
```bash
# Make a change
echo "// test" >> backend/src/index.ts
git add backend/
git commit -m "test: backend deployment"
git push origin main
```

**Test Frontend Deployment**:
```bash
# Make a change
echo "// test" >> frontend/app/page.tsx
git add frontend/
git commit -m "test: frontend deployment"
git push origin main
```

**Test PR Checks**:
```bash
git checkout -b feature/test
echo "// test" >> backend/src/index.ts
git add .
git commit -m "feat: test PR checks"
git push origin feature/test
# Create PR on GitHub
```

---

## 📊 Workflow Status Badges

Add these to your main README.md:

```markdown
![Backend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-deploy.yml/badge.svg)
![Frontend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-deploy.yml/badge.svg)
![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml/badge.svg)
```

---

## 🔧 Customization

### Modify Deployment Regions

**Frontend (Vercel)**:
Edit `frontend/vercel.json`:
```json
{
  "regions": ["icn1"]  // Change to your preferred region
}
```

**Backend (Railway)**:
Railway automatically selects the optimal region.

### Add More Tests

**Backend**:
```json
// backend/package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

**Frontend**:
```json
// frontend/package.json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test"
  }
}
```

### Adjust Lighthouse Thresholds

Edit `frontend-deploy.yml`:
```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://your-app.vercel.app
    uploadArtifacts: true
    temporaryPublicStorage: true
    runs: 3
    # Add assertions
    assertions:
      performance: 0.9
      accessibility: 0.9
```

---

## 🐛 Troubleshooting

### Workflow Not Triggering

**Check**:
1. Workflow file is in `.github/workflows/`
2. File has `.yml` or `.yaml` extension
3. Syntax is valid (use GitHub's workflow editor)
4. Branch name matches trigger conditions

### Deployment Fails

**Backend**:
- Check Railway token is valid
- Verify project ID matches
- Review Railway logs: `railway logs`

**Frontend**:
- Check Vercel token permissions
- Verify org/project IDs
- Review Vercel deployment logs

### Tests Fail

**Local Testing**:
```bash
# Backend
cd backend
npm run lint
npm run build
npm test

# Frontend
cd frontend
npm run lint
npm run format:check
npm run build
npm test
```

### Secrets Not Working

1. Verify secret names match exactly (case-sensitive)
2. Check secret values don't have extra spaces
3. Ensure secrets are set at repository level (not environment)
4. Re-create secrets if issues persist

---

## 📈 Performance Monitoring

### Lighthouse Reports
- Automatically run on every frontend deployment
- View reports in GitHub Actions artifacts
- Check for performance regressions

### Build Times
Monitor workflow execution times:
1. Go to Actions tab
2. Click on a workflow run
3. Review job durations

**Optimization Tips**:
- Use caching for dependencies
- Parallelize independent jobs
- Minimize Docker layers

---

## 🔒 Security Best Practices

1. **Never log secrets** in workflow output
2. **Use environment protection rules** for production
3. **Require PR reviews** before merging to main
4. **Enable branch protection** on main branch
5. **Rotate tokens** regularly (every 90 days)
6. **Audit workflow changes** carefully
7. **Use least-privilege tokens** (minimal scopes)

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🤝 Contributing

When modifying workflows:

1. Test changes in a feature branch first
2. Use `workflow_dispatch` trigger for manual testing
3. Review workflow logs carefully
4. Update this documentation
5. Get peer review before merging

---

## 📞 Support

Issues with workflows?
1. Check workflow logs in Actions tab
2. Review [SECRETS_SETUP.md](../SECRETS_SETUP.md)
3. Test CLI commands locally
4. Check Railway/Vercel status pages
