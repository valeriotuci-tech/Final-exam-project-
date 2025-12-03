# 🔍 Railway Deployment Debug Guide

## ✅ Verified Repository Structure

From repository root (what Railway clones from GitHub):

```
Final-exam-project-/
├── backend/              ← Root Directory should point here
│   ├── package.json     ✅ Exists in Git
│   ├── src/
│   │   └── index.ts     ✅ Exists in Git
│   ├── railway.json
│   └── tsconfig.json
├── frontend/
└── tests/
```

**Files verified in Git:**
- ✅ `backend/package.json` - Committed
- ✅ `backend/src/index.ts` - Committed
- ✅ 40 backend files tracked in Git

---

## 🎯 Correct Railway Configuration

### Root Directory Setting

**Set to exactly:** `backend`

**NOT:**
- ❌ `/backend` (no leading slash)
- ❌ `./backend` (no dot-slash)
- ❌ `Final-exam-project-/backend`
- ❌ `.` (empty or root)

### Build Configuration

Railway should detect from `backend/package.json`:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Builder**: Nixpacks (auto-detected)

---

## 🔧 Step-by-Step Fix in Railway Dashboard

### 1. Verify GitHub Connection

1. Go to: https://railway.app
2. Click on your project
3. Click on the backend service
4. Go to **Settings** tab
5. Scroll to **Source**
6. Verify:
   - **Repository**: `valeriotuci-tech/Final-exam-project-`
   - **Branch**: `main`
   - **Root Directory**: `backend`

### 2. Check Service Configuration

Still in Settings:
- **Service Name**: Can be anything
- **Root Directory**: `backend` ← CRITICAL
- **Watch Paths**: Leave empty or set to `backend/**`

### 3. Environment Variables

Go to **Variables** tab, ensure these exist:
- `DATABASE_URL` (auto-set by Railway PostgreSQL)
- `NODE_ENV=production`
- `PORT` (auto-set by Railway)
- `JWT_SECRET` (you must set this manually)

### 4. Force Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on latest deployment
3. Select **"Redeploy"**
4. Check **"Clear build cache"**
5. Click **"Redeploy"**

---

## 🐛 If Error Persists: "No such file or directory"

### Possible Cause 1: Wrong Repository

Railway might be connected to a fork or different repo.

**Fix:**
1. Settings → Source
2. Click **"Disconnect"**
3. Click **"Connect Repo"**
4. Select: `valeriotuci-tech/Final-exam-project-`
5. Set Root Directory: `backend`

### Possible Cause 2: Cached Configuration

Railway might have cached an old configuration.

**Fix:**
1. Delete the current service
2. Create a new service
3. Connect to GitHub repo
4. Set Root Directory: `backend`
5. Deploy

### Possible Cause 3: Railway.json Conflict

The `railway.json` in backend might be interfering.

**Test:** Temporarily rename it:
```bash
cd backend
git mv railway.json railway.json.bak
git commit -m "test: Temporarily disable railway.json"
git push
```

Then redeploy and see if Nixpacks auto-detection works better.

---

## 📋 Deployment Checklist

Before redeploying, verify:

- [ ] GitHub repo: `valeriotuci-tech/Final-exam-project-`
- [ ] Branch: `main`
- [ ] Root Directory: `backend` (no slashes)
- [ ] `backend/package.json` exists in GitHub
- [ ] `backend/src/index.ts` exists in GitHub
- [ ] Latest commit is pushed to GitHub
- [ ] Railway service is connected to correct repo
- [ ] Build cache cleared

---

## 🧪 Test Locally First

Verify the backend builds correctly:

```bash
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Check dist folder
ls dist/

# Start server
npm start
```

If this works locally, Railway should work too.

---

## 📊 Expected Railway Build Logs

When configured correctly, you should see:

```
using build driver nixpacks-v1.41.0
✓ Cloning repository
✓ Checking out branch main
✓ Entering directory: backend
✓ Found package.json
✓ Detected Node.js project
✓ Installing dependencies
✓ Running build command
✓ Build successful
✓ Starting application
```

**NOT:**
```
Error: Failed to read app source directory
Caused by: No such file or directory
```

---

## 🆘 Alternative: Deploy from Backend Directory Only

If Railway continues to fail, create a separate repo for just the backend:

### Option A: Monorepo with Railway Root Directory

**Current approach** - Should work with Root Directory = `backend`

### Option B: Separate Backend Repo

1. Create new repo: `TastyFund-Backend`
2. Copy only backend files
3. Connect Railway to new repo
4. Set Root Directory to `.` (root)

### Option C: Use Railway CLI

Deploy directly from local backend folder:

```bash
cd backend
railway login
railway link
railway up
```

This bypasses GitHub and deploys directly.

---

## 🎯 Quick Test Command

Run this to verify Railway can see your backend:

```bash
# Clone your repo like Railway does
cd /tmp
git clone https://github.com/valeriotuci-tech/Final-exam-project-.git test-railway
cd test-railway/backend
ls -la package.json
# Should show package.json exists
```

If this works, Railway should work too.

---

## 📞 Railway Support

If none of this works:

1. **Railway Discord**: https://discord.gg/railway
2. **Railway Support**: help@railway.app
3. **Railway Docs**: https://docs.railway.app

Provide them with:
- Project ID: `2af9b102-df34-4de0-8ef5-c79cb4443b2e`
- Error message: "Failed to read app source directory"
- Root Directory setting: `backend`
- Repository: `valeriotuci-tech/Final-exam-project-`

---

**Last Updated**: December 4, 2025, 1:45 AM  
**Repository**: https://github.com/valeriotuci-tech/Final-exam-project-  
**Correct Root Directory**: `backend`
