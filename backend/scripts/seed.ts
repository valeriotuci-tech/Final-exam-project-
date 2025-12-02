import { config } from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

interface SeedStats {
  users: number;
  restaurants: number;
  campaigns: number;
  rewards: number;
  investments: number;
}

async function clearData(client: any): Promise<void> {
  console.log('🗑️  Clearing existing data...\n');
  
  // Delete in reverse order of dependencies
  await client.query('DELETE FROM investments');
  console.log('   ✓ Cleared investments');
  
  await client.query('DELETE FROM rewards');
  console.log('   ✓ Cleared rewards');
  
  await client.query('DELETE FROM campaigns');
  console.log('   ✓ Cleared campaigns');
  
  await client.query('DELETE FROM restaurants');
  console.log('   ✓ Cleared restaurants');
  
  await client.query('DELETE FROM users');
  console.log('   ✓ Cleared users\n');
}

async function seedUsers(client: any, count: number = 10): Promise<string[]> {
  console.log(`👥 Creating ${count} users...`);
  
  const userIds: string[] = [];
  const password = await bcrypt.hash('password123', 10);
  
  // Create admin user
  const adminResult = await client.query(`
    INSERT INTO users (email, password_hash, name, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `, ['admin@tastyfund.com', password, 'Admin User', 'admin']);
  
  userIds.push(adminResult.rows[0].id);
  console.log('   ✓ Created admin user (admin@tastyfund.com / password123)');
  
  // Create restaurant owners
  for (let i = 0; i < 3; i++) {
    const result = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [
      faker.internet.email().toLowerCase(),
      password,
      faker.person.fullName(),
      'owner'
    ]);
    
    userIds.push(result.rows[0].id);
  }
  console.log('   ✓ Created 3 restaurant owners');
  
  // Create regular users
  for (let i = 0; i < count - 4; i++) {
    const result = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [
      faker.internet.email().toLowerCase(),
      password,
      faker.person.fullName(),
      'user'
    ]);
    
    userIds.push(result.rows[0].id);
  }
  console.log(`   ✓ Created ${count - 4} regular users\n`);
  
  return userIds;
}

async function seedRestaurants(client: any, ownerIds: string[], count: number = 5): Promise<string[]> {
  console.log(`🍽️  Creating ${count} restaurants...`);
  
  const restaurantIds: string[] = [];
  const cuisineTypes = ['Italian', 'Japanese', 'Mexican', 'French', 'Thai', 'Indian', 'Chinese', 'Korean', 'Mediterranean', 'American'];
  
  for (let i = 0; i < count; i++) {
    const ownerId = ownerIds[1 + (i % 3)]; // Use owner accounts
    const cuisine = faker.helpers.arrayElement(cuisineTypes);
    
    const result = await client.query(`
      INSERT INTO restaurants (owner_id, name, description, location, cuisine_type, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      ownerId,
      faker.company.name() + ' ' + cuisine + ' Restaurant',
      faker.lorem.paragraph(),
      faker.location.city() + ', ' + faker.location.country(),
      cuisine,
      faker.image.urlLoremFlickr({ category: 'food' })
    ]);
    
    restaurantIds.push(result.rows[0].id);
  }
  
  console.log(`   ✓ Created ${count} restaurants\n`);
  return restaurantIds;
}

async function seedCampaigns(client: any, restaurantIds: string[], count: number = 8): Promise<string[]> {
  console.log(`🎯 Creating ${count} campaigns...`);
  
  const campaignIds: string[] = [];
  const statuses = ['active', 'active', 'active', 'active', 'successful', 'draft'];
  
  for (let i = 0; i < count; i++) {
    const restaurantId = faker.helpers.arrayElement(restaurantIds);
    const targetAmount = faker.number.int({ min: 5000, max: 100000 });
    const status = faker.helpers.arrayElement(statuses);
    
    let currentAmount = 0;
    if (status === 'active') {
      currentAmount = faker.number.int({ min: 0, max: targetAmount * 0.8 });
    } else if (status === 'successful') {
      currentAmount = targetAmount;
    }
    
    const startDate = faker.date.past({ years: 0.1 });
    const endDate = faker.date.future({ years: 0.2 });
    
    const result = await client.query(`
      INSERT INTO campaigns (
        restaurant_id, 
        title, 
        description, 
        target_amount, 
        current_amount,
        start_date, 
        end_date, 
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      restaurantId,
      faker.company.catchPhrase(),
      faker.lorem.paragraphs(2),
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      status
    ]);
    
    campaignIds.push(result.rows[0].id);
  }
  
  console.log(`   ✓ Created ${count} campaigns\n`);
  return campaignIds;
}

async function seedRewards(client: any, campaignIds: string[]): Promise<number> {
  console.log('🎁 Creating rewards...');
  
  let totalRewards = 0;
  const rewardTiers = [
    { name: 'Supporter', min: 20, desc: 'Thank you note and your name on our supporter wall' },
    { name: 'Bronze Backer', min: 50, desc: 'Supporter rewards plus a branded merchandise item' },
    { name: 'Silver Patron', min: 100, desc: 'Bronze rewards plus a complimentary meal for two' },
    { name: 'Gold Benefactor', min: 250, desc: 'Silver rewards plus VIP opening night invitation' },
    { name: 'Platinum Founder', min: 500, desc: 'Gold rewards plus lifetime 10% discount' },
  ];
  
  for (const campaignId of campaignIds) {
    const numRewards = faker.number.int({ min: 2, max: 4 });
    
    for (let i = 0; i < numRewards; i++) {
      const tier = rewardTiers[i];
      const hasLimit = faker.datatype.boolean();
      
      await client.query(`
        INSERT INTO rewards (
          campaign_id,
          tier_name,
          minimum_amount,
          description,
          limit_quantity,
          claimed_quantity
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        campaignId,
        tier.name,
        tier.min,
        tier.desc,
        hasLimit ? faker.number.int({ min: 10, max: 50 }) : null,
        faker.number.int({ min: 0, max: 5 })
      ]);
      
      totalRewards++;
    }
  }
  
  console.log(`   ✓ Created ${totalRewards} reward tiers\n`);
  return totalRewards;
}

async function seedInvestments(client: any, userIds: string[], campaignIds: string[], count: number = 20): Promise<number> {
  console.log(`💰 Creating ${count} investments...`);
  
  const statuses = ['confirmed', 'confirmed', 'confirmed', 'pending'];
  
  for (let i = 0; i < count; i++) {
    const userId = faker.helpers.arrayElement(userIds.slice(4)); // Use regular users
    const campaignId = faker.helpers.arrayElement(campaignIds);
    const amount = faker.number.int({ min: 20, max: 500 });
    const status = faker.helpers.arrayElement(statuses);
    
    await client.query(`
      INSERT INTO investments (
        user_id,
        campaign_id,
        amount,
        reward_tier,
        transaction_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      userId,
      campaignId,
      amount,
      amount >= 100 ? 'Silver Patron' : 'Supporter',
      status === 'confirmed' ? `txn_${faker.string.alphanumeric(10)}` : null,
      status
    ]);
    
    // Update campaign current_amount for confirmed investments
    if (status === 'confirmed') {
      await client.query(`
        UPDATE campaigns 
        SET current_amount = current_amount + $1 
        WHERE id = $2
      `, [amount, campaignId]);
    }
  }
  
  console.log(`   ✓ Created ${count} investments\n`);
  return count;
}

async function runSeed(): Promise<SeedStats> {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if we should clear data (only in development)
    const env = process.env.NODE_ENV || 'development';
    if (env === 'development' || env === 'test') {
      await clearData(client);
    } else {
      console.log('⚠️  Production environment detected - skipping data clear\n');
    }
    
    // Seed data
    const userIds = await seedUsers(client, 15);
    const restaurantIds = await seedRestaurants(client, userIds, 8);
    const campaignIds = await seedCampaigns(client, restaurantIds, 12);
    const rewardsCount = await seedRewards(client, campaignIds);
    const investmentsCount = await seedInvestments(client, userIds, campaignIds, 30);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Seeding completed successfully!\n');
    
    const stats: SeedStats = {
      users: userIds.length,
      restaurants: restaurantIds.length,
      campaigns: campaignIds.length,
      rewards: rewardsCount,
      investments: investmentsCount,
    };
    
    return stats;
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('\n❌ Seeding failed!');
    console.error('Error:', error);
    throw error;
    
  } finally {
    client.release();
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  TastyFund Database Seeding Tool');
  console.log('═══════════════════════════════════════\n');
  
  // Check environment
  const env = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${env}`);
  console.log(`Database: ${process.env.DATABASE_URL ? '✓ Configured' : '✗ Not configured'}\n`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    process.exit(1);
  }
  
  // Warn if production
  if (env === 'production') {
    console.log('⚠️  WARNING: You are about to seed the PRODUCTION database!');
    console.log('   This will add sample data to your production environment.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // Run seeding
  const stats = await runSeed();
  
  // Display summary
  console.log('📊 Seeding Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`   Users:        ${stats.users}`);
  console.log(`   Restaurants:  ${stats.restaurants}`);
  console.log(`   Campaigns:    ${stats.campaigns}`);
  console.log(`   Rewards:      ${stats.rewards}`);
  console.log(`   Investments:  ${stats.investments}`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('🎉 Database seeded successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('   Email:    admin@tastyfund.com');
  console.log('   Password: password123\n');
  
  // Close pool
  await pool.end();
  
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { runSeed };
