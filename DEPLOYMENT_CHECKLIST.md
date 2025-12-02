# 📋 Deployment Checklist

Follow this step-by-step guide to complete your CI/CD setup.

## ✅ Pre-Deployment Setup

### Step 1: Install Required Tools
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI (if not already installed)
npm install -g @railway/cli
```

- [ ] Vercel CLI installed
- [ ] Railway CLI installed

---

### Step 2: Link Vercel Project
```bash
cd frontend
vercel login
vercel link
```

**Follow the prompts:**
1. Select your Vercel account
2. Link to existing project or create new one
3. Confirm settings

- [ ] Logged into Vercel
- [ ] Project linked
- [ ] `.vercel/project.json` created

---

### Step 3: Get Vercel Credentials
```bash
# Get project details
cat frontend/.vercel/project.json
```

**Copy these values:**
- `orgId` → This is your `VERCEL_ORG_ID`
- `projectId` → This is your `VERCEL_PROJECT_ID`

**Get Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token → This is your `VERCEL_TOKEN`

- [ ] `VERCEL_ORG_ID` copied
- [ ] `VERCEL_PROJECT_ID` copied
- [ ] `VERCEL_TOKEN` created and copied

---

### Step 4: Get Railway Credentials
```bash
# Login to Railway
railway login

# Get token
railway whoami --token

# Get database URL
railway variables | grep DATABASE_URL
```

- [ ] `RAILWAY_TOKEN` copied
- [ ] `DATABASE_URL` copied

---

## 🔑 GitHub Secrets Configuration

### Step 5: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Value | Status |
|-------------|-------|--------|
| `RAILWAY_TOKEN` | From `railway whoami --token` | [ ] |
| `DATABASE_URL` | From `railway variables` | [ ] |
| `VERCEL_TOKEN` | From Vercel dashboard | [ ] |
| `VERCEL_ORG_ID` | From `.vercel/project.json` | [ ] |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` | [ ] |

- [ ] All 5 secrets added to GitHub

---

## 🌍 Environment Variables

### Step 6: Configure Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://r11-production.up.railway.app` | Production |
| `NODE_ENV` | `production` | Production |

- [ ] Vercel environment variables configured

---

### Step 7: Verify Railway Environment Variables

```bash
railway variables
```

**Should include:**
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN` (will be auto-updated by workflow)
- `DATABASE_URL`

- [ ] Railway environment variables verified

---

## 📦 Install Dependencies

### Step 8: Install Project Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed

---

## 🧪 Local Testing

### Step 9: Test Locally Before Deploying

**Backend:**
```bash
cd backend
npm run lint
npm run build
npm test
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run format:check
npm run build
npm test
```

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] No linting errors

---

## 🚀 First Deployment

### Step 10: Commit and Push Workflows

```bash
# From project root
git add .
git commit -m "ci: add complete CI/CD pipeline with workflows"
git push origin main
```

- [ ] Changes committed
- [ ] Changes pushed to GitHub

---

### Step 11: Monitor First Deployment

1. Go to GitHub repository
2. Click **Actions** tab
3. Watch workflows execute

**Expected workflows:**
- Backend Deploy (if backend changed)
- Frontend Deploy (if frontend changed)

- [ ] Workflows triggered
- [ ] Workflows completed successfully

---

### Step 12: Verify Deployments

**Backend:**
```bash
# Check Railway deployment
railway status

# Test health endpoint
curl https://r11-production.up.railway.app/health
```

**Frontend:**
```bash
# Check Vercel deployment
cd frontend
vercel ls

# Visit the URL in browser
```

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Both apps accessible

---

## 🧪 Test PR Workflow

### Step 13: Create Test PR

```bash
# Create feature branch
git checkout -b feature/test-ci-cd

# Make a small change
echo "// CI/CD test" >> backend/src/index.ts

# Commit and push
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin feature/test-ci-cd
```

- [ ] Feature branch created
- [ ] Changes pushed

---

### Step 14: Create Pull Request

1. Go to GitHub repository
2. Click **Pull requests** → **New pull request**
3. Select `feature/test-ci-cd` → `main`
4. Create pull request

**Watch for:**
- PR checks start automatically
- All checks pass (green checkmarks)
- Summary report appears

- [ ] PR created
- [ ] PR checks running
- [ ] All checks passed

---

### Step 15: Merge Test PR

1. Review the PR checks
2. Click **Merge pull request**
3. Confirm merge
4. Watch deployment workflows trigger

- [ ] PR merged
- [ ] Deployment workflows triggered
- [ ] Deployments successful

---

## 📊 Post-Deployment Verification

### Step 16: Check Lighthouse Scores

1. Go to GitHub Actions
2. Find latest Frontend Deploy workflow
3. Check Lighthouse CI results
4. Download artifacts if needed

**Target scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

- [ ] Lighthouse tests completed
- [ ] Scores reviewed

---

### Step 17: Verify CORS Configuration

```bash
# Check Railway CORS variable
railway variables | grep CORS_ORIGIN
```

Should show your Vercel URL.

- [ ] CORS_ORIGIN updated with Vercel URL

---

## 🎨 Optional Enhancements

### Step 18: Add Status Badges (Optional)

Add to your main `README.md`:

```markdown
## CI/CD Status

![Backend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-deploy.yml/badge.svg)
![Frontend Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-deploy.yml/badge.svg)
![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml/badge.svg)
```

- [ ] Status badges added (optional)

---

### Step 19: Enable Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Select your workflow checks

- [ ] Branch protection enabled (optional)

---

## 🎉 Final Verification

### Step 20: Complete System Check

**All systems operational:**
- [ ] GitHub Actions workflows working
- [ ] Backend deploying to Railway
- [ ] Frontend deploying to Vercel
- [ ] PR checks running on pull requests
- [ ] Database migrations working
- [ ] Lighthouse tests passing
- [ ] CORS configured correctly
- [ ] All secrets configured
- [ ] Environment variables set

---

## 📝 Documentation Review

### Step 21: Review Documentation

Make sure you understand:
- [ ] How to trigger deployments
- [ ] How to check deployment status
- [ ] How to troubleshoot issues
- [ ] Where to find logs
- [ ] How to update secrets

**Key files:**
- `CI_CD_SETUP.md` - Quick reference
- `.github/SECRETS_SETUP.md` - Secrets guide
- `.github/workflows/README.md` - Workflows guide
- `.github/DEPLOYMENT_SUMMARY.md` - Complete overview

---

## 🚀 You're Done!

### Congratulations! 🎊

Your complete CI/CD pipeline is now operational:

✅ **Automated Testing** - Every PR is tested
✅ **Automated Deployment** - Every push to main deploys
✅ **Performance Monitoring** - Lighthouse tracks performance
✅ **Security Scanning** - npm audit checks vulnerabilities
✅ **Quality Checks** - Linting and type checking

---

## 📞 Next Steps

1. **Monitor your first few deployments** closely
2. **Add more tests** as you develop features
3. **Review Lighthouse reports** regularly
4. **Keep dependencies updated**
5. **Rotate secrets** every 90 days

---

## 🆘 If Something Goes Wrong

1. Check GitHub Actions logs
2. Review Railway/Vercel deployment logs
3. Verify all secrets are correct
4. Test commands locally
5. Refer to troubleshooting guides in documentation

---

## 📊 Success Metrics

Track these over time:
- Build success rate
- Deployment frequency
- Lighthouse scores
- Build times
- Test coverage (when added)

---

**Happy deploying!** 🚀

Your TastyFund project now has enterprise-grade CI/CD! 🎉
