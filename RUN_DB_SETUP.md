# 🗄️ Database Setup Guide for Railway

## ✅ Step 1: SSL Config Updated (COMPLETE)

I've successfully updated both database scripts:
- ✅ `backend/scripts/migrate.ts` - SSL always enabled
- ✅ `backend/scripts/seed.ts` - SSL always enabled
- ✅ Committed: `15f994a` - "fix: always use SSL for Railway DB migrations"
- ✅ Pushed to GitHub main branch
- ✅ Railway should auto-deploy (wait ~1 minute)

---

## 📋 Step 2: Run Migrations and Seeds (YOU NEED TO DO THIS)

Since Railway CLI requires interactive selection, please run these commands in your terminal:

### Navigate to Backend Folder

```bash
cd backend
```

### Link to Railway Service

```bash
railway service
```

**When prompted, select:**
- Service: **R11** (press Enter)

### Run Migration

```bash
railway run npm run db:migrate
```

**Expected Output:**
```
═══════════════════════════════════════
  TastyFund Database Migration Tool
═══════════════════════════════════════

Environment: production
Database: ✓ Configured

🔌 Checking database connection...
✓ Database connection successful!

🔄 Starting database migration...

📄 Reading schema.sql...
   Location: /app/src/database/schema.sql
   Size: XXXX characters

⚙️  Executing schema...

✅ Migration completed successfully!

📊 Created tables:
   ✓ users
   ✓ restaurants
   ✓ campaigns
   ✓ rewards
   ✓ investments

🎉 Database is ready!
```

**If you see errors:**
- Check that DATABASE_URL is set in Railway
- Verify PostgreSQL service is running
- Make sure SSL is enabled in Railway PostgreSQL

### Run Seed

```bash
railway run npm run db:seed
```

**Expected Output:**
```
═══════════════════════════════════════
  TastyFund Database Seed Tool
═══════════════════════════════════════

Environment: production
Database: ✓ Configured

🗑️  Clearing existing data...
   ✓ Cleared investments
   ✓ Cleared rewards
   ✓ Cleared campaigns
   ✓ Cleared restaurants
   ✓ Cleared users

👥 Creating 10 users...
   ✓ Created admin user: admin@tastyfund.com
   ✓ Created 9 investor users

🏪 Creating 10 restaurants...
   ✓ Created 10 restaurants

🎯 Creating 15 campaigns...
   ✓ Created 15 campaigns

🎁 Creating 20 rewards...
   ✓ Created 20 rewards

💰 Creating 25 investments...
   ✓ Created 25 investments

✅ Database seeded successfully!

📊 Summary:
   Users: 10
   Restaurants: 10
   Campaigns: 15
   Rewards: 20
   Investments: 25
```

---

## 🧪 Step 3: Verify the API Works

After running both scripts, test the endpoints:

```bash
cd ../tests
node check-backend.js
```

**Expected Results:**
```
✅ Backend Health: 200 OK
✅ Backend API (/api/campaigns): 200 OK (with data!)
✅ Backend API (/api/restaurants): 200 OK (with data!)
```

**Or test manually:**
```bash
# Should return campaigns array with data
curl https://r11-production.up.railway.app/api/campaigns

# Should return restaurants array with data
curl https://r11-production.up.railway.app/api/restaurants
```

---

## 🎯 Current Status

### Backend Deployment
- ✅ Backend is running on Railway
- ✅ Health check working: `/health` returns 200 OK
- ✅ Database connected
- ⏳ Tables need to be created (run migration)
- ⏳ Data needs to be seeded (run seed)

### What's Working Now
- ✅ `/health` - Returns JSON with database connected
- ✅ `/api-docs` - Swagger UI accessible
- ❌ `/api/campaigns` - Returns 500 (no tables yet)
- ❌ `/api/restaurants` - Returns 500 (no tables yet)

### After Running Migration & Seed
- ✅ `/api/campaigns` - Will return array of campaigns
- ✅ `/api/restaurants` - Will return array of restaurants
- ✅ `/api/auth/register` - Will work
- ✅ `/api/auth/login` - Will work

---

## 🆘 Troubleshooting

### Error: "Database connection failed"
**Solution:** Make sure you're running with `railway run` prefix:
```bash
railway run npm run db:migrate
```

### Error: "Schema file not found"
**Solution:** Make sure you're in the `backend` directory:
```bash
cd backend
railway run npm run db:migrate
```

### Error: "SSL connection required"
**Solution:** Already fixed! The new code always uses SSL.

### Error: "Table already exists"
**Solution:** The migration script handles this. If you want to start fresh:
1. Go to Railway dashboard
2. Open PostgreSQL service
3. Go to "Data" tab
4. Drop all tables manually
5. Run migration again

---

## 📝 Summary of Changes Made

### Files Updated:
1. `backend/scripts/migrate.ts`
   - Changed SSL config from conditional to always enabled
   - Now works with Railway PostgreSQL SSL requirement

2. `backend/scripts/seed.ts`
   - Changed SSL config from conditional to always enabled
   - Now works with Railway PostgreSQL SSL requirement

### Commit:
- **Hash**: `15f994a`
- **Message**: "fix: always use SSL for Railway DB migrations"
- **Status**: ✅ Pushed to GitHub
- **Deployment**: ✅ Railway should auto-deploy

---

## ✅ Next Steps for You

1. **Wait 1-2 minutes** for Railway to finish deploying the new code
2. **Open your terminal** and navigate to the backend folder
3. **Link Railway service**: `railway service` → Select **R11**
4. **Run migration**: `railway run npm run db:migrate`
5. **Run seed**: `railway run npm run db:seed`
6. **Test API**: `cd ../tests && node check-backend.js`

---

**All code changes are complete! Just run the migration and seed commands.** 🚀

**Last Updated**: December 4, 2025, 11:30 AM
