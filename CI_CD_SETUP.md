# CI/CD Setup - Quick Reference

Complete guide for setting up automated deployments for TastyFund.

## 📁 Files Created

```
.github/
├── workflows/
│   ├── backend-deploy.yml      # Backend deployment to Railway
│   ├── frontend-deploy.yml     # Frontend deployment to Vercel
│   ├── pr-checks.yml           # PR quality checks
│   └── README.md               # Workflows documentation
├── SECRETS_SETUP.md            # Secrets configuration guide
frontend/
├── vercel.json                 # Vercel deployment config
├── next.config.mjs             # Updated with API rewrites & images
├── .prettierrc.json            # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
└── .env.example                # Environment variables template
```

---

## 🚀 Setup Steps (5 Minutes)

### Step 1: Configure GitHub Secrets

Go to: **Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | How to Get It |
|-------------|---------------|
| `RAILWAY_TOKEN` | `railway login && railway whoami --token` |
| `DATABASE_URL` | `railway variables \| grep DATABASE_URL` |
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `cd frontend && vercel link && cat .vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same as above |

### Step 2: Link Vercel Project

```bash
cd frontend
npm install -g vercel
vercel login
vercel link
```

### Step 3: Set Environment Variables

**In Vercel Dashboard**:
- Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL` = `https://r11-production.up.railway.app`

**In Railway** (already set):
```bash
railway variables
# Should show: JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN
```

### Step 4: Push to GitHub

```bash
git add .
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

---

## 🎯 How It Works

### When You Push to Main

**Backend Changes** (`backend/**`):
```
1. Run tests & linting
2. Build Docker image
3. Deploy to Railway
4. Run database migrations
5. Health check
```

**Frontend Changes** (`frontend/**`):
```
1. Run tests & linting
2. Build Next.js app
3. Deploy to Vercel
4. Update Railway CORS
5. Run Lighthouse tests
```

### When You Create a PR

```
1. Detect changed files (backend/frontend)
2. Run type checking
3. Run linting (ESLint, Prettier)
4. Run tests
5. Verify builds
6. Security audit
7. Generate summary report
```

---

## 📝 Common Commands

### Deploy Manually

**Backend**:
```bash
cd backend
railway up
```

**Frontend**:
```bash
cd frontend
npm run deploy:production
```

### Test Locally

**Backend**:
```bash
cd backend
npm run lint
npm run build
npm test
```

**Frontend**:
```bash
cd frontend
npm run lint
npm run format:check
npm run build
npm test
```

### View Deployment Status

**Railway**:
```bash
railway status
railway logs
```

**Vercel**:
```bash
cd frontend
vercel ls
vercel logs
```

---

## 🔍 Monitoring

### GitHub Actions
- Go to **Actions** tab in your repository
- View workflow runs, logs, and artifacts
- Download Lighthouse reports

### Railway Dashboard
- [railway.app](https://railway.app)
- View deployments, logs, metrics
- Monitor database usage

### Vercel Dashboard
- [vercel.com](https://vercel.com)
- View deployments, analytics
- Check performance metrics

---

## 🐛 Troubleshooting

### "Railway token invalid"
```bash
# Regenerate token
railway login
railway whoami --token
# Update GitHub secret
```

### "Vercel deployment failed"
```bash
# Check project is linked
cd frontend
vercel link

# Get correct IDs
cat .vercel/project.json
# Update GitHub secrets
```

### "Database migration failed"
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Run migration manually
railway run psql $DATABASE_URL -f backend/src/database/schema.sql
```

### "Build failed"
```bash
# Test locally first
npm run build

# Check logs in GitHub Actions
# Fix errors and push again
```

---

## 🎨 Customization

### Change Deployment Region

**Vercel** (`frontend/vercel.json`):
```json
{
  "regions": ["icn1"]  // Seoul
  // Other options: "sfo1" (San Francisco), "iad1" (Washington DC)
}
```

### Add More Checks

**Backend** (`backend/package.json`):
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts"
  }
}
```

**Frontend** (`frontend/package.json`):
```json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test",
    "lint": "next lint"
  }
}
```

### Modify Workflow Triggers

Edit `.github/workflows/*.yml`:
```yaml
on:
  push:
    branches: [main, develop]  # Add more branches
    paths:
      - 'backend/**'
      - '!**.md'  # Ignore markdown files
```

---

## 📊 Performance Metrics

### Lighthouse Scores (Target)
- **Performance**: > 90
- **Accessibility**: > 90
- **Best Practices**: > 90
- **SEO**: > 90

### Build Times (Expected)
- **Backend**: ~2-3 minutes
- **Frontend**: ~3-5 minutes
- **PR Checks**: ~2-4 minutes

---

## 🔒 Security Checklist

- ✅ All secrets configured in GitHub
- ✅ No secrets in code or logs
- ✅ Branch protection enabled on main
- ✅ PR reviews required
- ✅ npm audit runs on every PR
- ✅ Tokens have minimal required permissions
- ✅ CORS configured correctly
- ✅ Environment variables set in Vercel/Railway

---

## 📚 Documentation

- **Workflows**: `.github/workflows/README.md`
- **Secrets Setup**: `.github/SECRETS_SETUP.md`
- **Vercel Config**: `frontend/vercel.json`
- **Next.js Config**: `frontend/next.config.mjs`

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Push to main triggers deployments
2. ✅ PRs show status checks
3. ✅ Deployments complete successfully
4. ✅ Apps are accessible at their URLs
5. ✅ Lighthouse tests pass
6. ✅ No errors in workflow logs

---

## 🆘 Getting Help

1. Check workflow logs in GitHub Actions
2. Review Railway/Vercel deployment logs
3. Test commands locally first
4. Verify all secrets are set correctly
5. Check service status pages

---

## 📞 Quick Links

- **GitHub Actions**: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
- **Railway Dashboard**: `https://railway.app/project/2af9b102-df34-4de0-8ef5-c79cb4443b2e`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Backend URL**: `https://r11-production.up.railway.app`
- **Frontend URL**: `https://your-app.vercel.app` (after deployment)

---

## ✅ Next Steps

1. Set up all GitHub secrets
2. Link Vercel project
3. Push workflows to GitHub
4. Test with a small change
5. Monitor first deployment
6. Add status badges to README
7. Configure branch protection rules

**Ready to deploy!** 🚀
