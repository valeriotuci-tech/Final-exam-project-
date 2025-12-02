# Database Migration and Seeding Scripts

Comprehensive database management tools for TastyFund backend.

## 📋 Overview

Three powerful scripts for managing your PostgreSQL database:

1. **`migrate.ts`** - Run database migrations
2. **`seed.ts`** - Populate database with sample data
3. **`reset.ts`** - Drop and recreate database (development only)

---

## 🚀 Quick Start

### Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `@faker-js/faker` - Generate realistic test data
- `@types/pg` - PostgreSQL type definitions
- `ts-node` - Run TypeScript scripts directly

### Setup Database

```bash
# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Or do both at once
npm run db:setup
```

---

## 📝 Available Scripts

### `npm run db:migrate`

Runs database migrations from `schema.sql`.

**What it does**:
- ✅ Connects to PostgreSQL database
- ✅ Reads and executes `schema.sql`
- ✅ Creates all tables with proper constraints
- ✅ Creates indexes for performance
- ✅ Verifies migration success
- ✅ Rolls back on error

**Output**:
```
═══════════════════════════════════════
  TastyFund Database Migration Tool
═══════════════════════════════════════

Environment: development
Database: ✓ Configured

🔌 Checking database connection...
✅ Connected to PostgreSQL
   Time: 2024-12-02 23:30:00
   Version: PostgreSQL 15.3

🔄 Starting database migration...

📄 Reading schema.sql...
   Location: /backend/src/database/schema.sql
   Size: 2156 characters

⚙️  Executing schema...

✅ Migration completed successfully!

📊 Created tables:
   - users
   - restaurants
   - campaigns
   - rewards
   - investments

📇 Created indexes:
   - idx_restaurants_owner_id
   - idx_campaigns_restaurant_id
   - idx_investments_user_id
   - idx_investments_campaign_id

✨ Database is ready!

🎉 Migration process completed successfully!
```

**Error Handling**:
- Automatically rolls back on failure
- Displays detailed error messages
- Safe to run multiple times (idempotent)

---

### `npm run db:seed`

Populates database with realistic sample data using Faker.js.

**What it does**:
- ✅ Clears existing data (development only)
- ✅ Creates 15 users (1 admin, 3 owners, 11 regular users)
- ✅ Creates 8 restaurants with realistic details
- ✅ Creates 12 campaigns with various statuses
- ✅ Creates reward tiers for each campaign
- ✅ Creates 30 investments
- ✅ Updates campaign amounts automatically

**Generated Data**:

**Users**:
- Admin: `admin@tastyfund.com` / `password123`
- 3 Restaurant owners
- 11 Regular users (investors)
- All passwords: `password123`

**Restaurants**:
- Realistic names and descriptions
- Various cuisine types (Italian, Japanese, Mexican, etc.)
- Random locations
- Placeholder images

**Campaigns**:
- Target amounts: $5,000 - $100,000
- Statuses: active, successful, draft
- Realistic start/end dates
- Current amounts based on status

**Rewards**:
- 5 tier levels: Supporter, Bronze, Silver, Gold, Platinum
- Minimum amounts: $20 - $500
- Limited and unlimited quantities
- Realistic descriptions

**Investments**:
- Random amounts: $20 - $500
- Confirmed and pending statuses
- Transaction IDs for confirmed investments
- Automatically updates campaign totals

**Output**:
```
═══════════════════════════════════════
  TastyFund Database Seeding Tool
═══════════════════════════════════════

Environment: development
Database: ✓ Configured

🌱 Starting database seeding...

🗑️  Clearing existing data...

   ✓ Cleared investments
   ✓ Cleared rewards
   ✓ Cleared campaigns
   ✓ Cleared restaurants
   ✓ Cleared users

👥 Creating 15 users...
   ✓ Created admin user (admin@tastyfund.com / password123)
   ✓ Created 3 restaurant owners
   ✓ Created 11 regular users

🍽️  Creating 8 restaurants...
   ✓ Created 8 restaurants

🎯 Creating 12 campaigns...
   ✓ Created 12 campaigns

🎁 Creating rewards...
   ✓ Created 36 reward tiers

💰 Creating 30 investments...
   ✓ Created 30 investments

✅ Seeding completed successfully!

📊 Seeding Summary:
═══════════════════════════════════════
   Users:        15
   Restaurants:  8
   Campaigns:    12
   Rewards:      36
   Investments:  30
═══════════════════════════════════════

🎉 Database seeded successfully!

📝 Test Credentials:
   Email:    admin@tastyfund.com
   Password: password123
```

**Safety Features**:
- Only clears data in development/test environments
- Warns before seeding production
- 5-second delay for production confirmation
- Transaction-based (all or nothing)

---

### `npm run db:reset`

Drops all tables and recreates database structure.

**⚠️ WARNING**: This is a DESTRUCTIVE operation!

**What it does**:
- ✅ Drops all tables in correct order
- ✅ Handles foreign key dependencies
- ✅ Requires double confirmation
- ✅ Blocked in production environment

**Output**:
```
═══════════════════════════════════════
  TastyFund Database Reset Tool
═══════════════════════════════════════

Environment: development
Database: ✓ Configured

⚠️  WARNING: This will DELETE ALL DATA in your database!
   All tables will be dropped and cannot be recovered.
   This action is IRREVERSIBLE!

Are you sure you want to continue? (yes/no): yes

⚠️  FINAL WARNING: This is your last chance to cancel!
Type "yes" to proceed with database reset: yes

🔄 Starting database reset...

🗑️  Dropping all tables...

   ✓ Dropped table: investments
   ✓ Dropped table: rewards
   ✓ Dropped table: campaigns
   ✓ Dropped table: restaurants
   ✓ Dropped table: users

✅ All tables dropped successfully!

✅ Database reset completed!

💡 Next steps:
   1. Run: npm run db:migrate
   2. Run: npm run db:seed
```

**Safety Features**:
- **BLOCKED in production** - Cannot run in production environment
- Requires TWO confirmations
- Interactive prompts
- Clear warnings about data loss

---

## 🔧 Configuration

### Environment Variables

Required in `.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
```

**Railway PostgreSQL**:
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
NODE_ENV=production
```

### Database Connection

Scripts automatically configure SSL based on environment:
- **Development**: No SSL
- **Production**: SSL with `rejectUnauthorized: false`

---

## 📊 Database Schema

### Tables Created

1. **users**
   - id (UUID, primary key)
   - email (unique)
   - password_hash
   - name
   - role (user, owner, admin)
   - timestamps

2. **restaurants**
   - id (UUID, primary key)
   - owner_id (foreign key → users)
   - name, description, location
   - cuisine_type, image_url
   - created_at

3. **campaigns**
   - id (UUID, primary key)
   - restaurant_id (foreign key → restaurants)
   - title, description
   - target_amount, current_amount
   - start_date, end_date
   - status (draft, active, successful, failed, cancelled)
   - rewards_json (JSONB)
   - created_at

4. **rewards**
   - id (UUID, primary key)
   - campaign_id (foreign key → campaigns)
   - tier_name, minimum_amount
   - description
   - limit_quantity, claimed_quantity

5. **investments**
   - id (UUID, primary key)
   - user_id (foreign key → users)
   - campaign_id (foreign key → campaigns)
   - amount, reward_tier
   - transaction_id
   - status (pending, confirmed, refunded, failed)
   - created_at

### Indexes

Performance indexes on foreign keys:
- `idx_restaurants_owner_id`
- `idx_campaigns_restaurant_id`
- `idx_investments_user_id`
- `idx_investments_campaign_id`

---

## 🎯 Common Workflows

### Initial Setup

```bash
# 1. Create database
createdb tastyfund

# 2. Set DATABASE_URL in .env
echo "DATABASE_URL=postgresql://localhost:5432/tastyfund" > .env

# 3. Run migrations and seed
npm run db:setup
```

### Development Reset

```bash
# Drop everything and start fresh
npm run db:reset

# Recreate schema and data
npm run db:setup
```

### Update Schema

```bash
# 1. Edit src/database/schema.sql
# 2. Reset and migrate
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Production Deployment

```bash
# Only run migrations (no reset, no seed)
npm run db:migrate
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"

**Solution**: Check DATABASE_URL is correct
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### "Permission denied"

**Solution**: Ensure database user has proper permissions
```sql
GRANT ALL PRIVILEGES ON DATABASE tastyfund TO your_user;
```

### "Table already exists"

**Solution**: Reset database first
```bash
npm run db:reset
npm run db:migrate
```

### "Module not found: @faker-js/faker"

**Solution**: Install dependencies
```bash
npm install
```

### Scripts won't run

**Solution**: Ensure ts-node is installed
```bash
npm install --save-dev ts-node @types/node
```

---

## 🔒 Security Best Practices

### Development

- ✅ Use separate database from production
- ✅ Use test data, not real user information
- ✅ Keep `.env` in `.gitignore`

### Production

- ✅ Never run `db:reset` in production
- ✅ Use strong database passwords
- ✅ Enable SSL connections
- ✅ Backup before running migrations
- ✅ Test migrations on staging first

---

## 📚 Script Details

### migrate.ts

**Features**:
- Transaction-based migration
- Automatic rollback on error
- Connection verification
- Table and index verification
- Detailed logging
- Idempotent (safe to run multiple times)

**Exit Codes**:
- `0` - Success
- `1` - Failure

### seed.ts

**Features**:
- Realistic data generation with Faker.js
- Configurable data counts
- Relationship integrity
- Transaction-based seeding
- Environment-aware data clearing
- Production safety warnings

**Customization**:
Edit counts in `seed.ts`:
```typescript
const userIds = await seedUsers(client, 15);      // Number of users
const restaurantIds = await seedRestaurants(client, userIds, 8);  // Restaurants
const campaignIds = await seedCampaigns(client, restaurantIds, 12);  // Campaigns
```

### reset.ts

**Features**:
- Interactive confirmation
- Production blocking
- Cascade deletion
- Transaction-based reset
- Helpful next steps

**Safety**:
- Requires TWO confirmations
- Blocked in production
- Clear warnings

---

## 🚀 CI/CD Integration

Scripts are integrated into GitHub Actions workflows:

### Backend Deploy Workflow

```yaml
- name: Run database migrations
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    railway link PROJECT_ID
    railway run npm run db:migrate
```

---

## 📝 Examples

### Custom Seeding

Create your own seed script:

```typescript
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function customSeed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Your custom seeding logic
    await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
    `, [
      faker.internet.email(),
      'hashed_password',
      faker.person.fullName(),
      'user'
    ]);
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## ✅ Checklist

Before deploying:
- [ ] Test migrations locally
- [ ] Verify schema.sql is correct
- [ ] Backup production database
- [ ] Test on staging environment
- [ ] Review migration logs
- [ ] Verify data integrity

---

## 🆘 Support

If you encounter issues:

1. Check DATABASE_URL is set correctly
2. Verify PostgreSQL is running
3. Check user permissions
4. Review error messages in logs
5. Try resetting in development

---

## 🎉 You're All Set!

Your database management scripts are ready to use. Start with:

```bash
npm run db:setup
```

Happy coding! 🚀
