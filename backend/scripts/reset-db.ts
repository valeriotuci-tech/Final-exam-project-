import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Always use SSL for Railway PostgreSQL
});

async function resetDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Dropping all tables...\n');
    
    // Drop tables in reverse order of dependencies
    await client.query('DROP TABLE IF EXISTS investments CASCADE');
    console.log('   ✓ Dropped investments');
    
    await client.query('DROP TABLE IF EXISTS rewards CASCADE');
    console.log('   ✓ Dropped rewards');
    
    await client.query('DROP TABLE IF EXISTS campaigns CASCADE');
    console.log('   ✓ Dropped campaigns');
    
    await client.query('DROP TABLE IF EXISTS restaurants CASCADE');
    console.log('   ✓ Dropped restaurants');
    
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('   ✓ Dropped users');
    
    console.log('\n✅ Database reset complete!\n');
    console.log('Now run: npm run db:migrate\n');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
