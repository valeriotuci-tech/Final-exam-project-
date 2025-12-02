# Database Quick Start Guide

Get your TastyFund database up and running in 2 minutes.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

Create `.env` file:

```env
DATABASE_URL=postgresql://localhost:5432/tastyfund
NODE_ENV=development
```

**Or use Railway**:
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
NODE_ENV=production
```

### 3. Run Setup

```bash
npm run db:setup
```

This runs:
1. `db:migrate` - Creates all tables
2. `db:seed` - Adds sample data

## ✅ Done!

Your database is ready with:
- ✅ 15 users (including admin)
- ✅ 8 restaurants
- ✅ 12 campaigns
- ✅ 36 reward tiers
- ✅ 30 investments

### Test Login

```
Email:    admin@tastyfund.com
Password: password123
```

---

## 📝 Common Commands

```bash
# Run migrations only
npm run db:migrate

# Seed data only
npm run db:seed

# Reset everything (dev only)
npm run db:reset

# Full setup (migrate + seed)
npm run db:setup
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### "Database does not exist"

```bash
# Create database
createdb tastyfund
```

### "Permission denied"

```bash
# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE tastyfund TO your_user;"
```

---

## 📚 Need More Info?

See `DATABASE_SCRIPTS.md` for detailed documentation.

---

## 🎉 You're Ready!

Start your backend server:

```bash
npm run dev
```

Visit: `http://localhost:4000/health`
