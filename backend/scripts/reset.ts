import { config } from 'dotenv';
import { Pool } from 'pg';
import * as readline from 'readline';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function dropAllTables(client: any): Promise<void> {
  console.log('🗑️  Dropping all tables...\n');
  
  // Drop tables in reverse order of dependencies
  const tables = [
    'investments',
    'rewards',
    'campaigns',
    'restaurants',
    'users'
  ];
  
  for (const table of tables) {
    try {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`   ✓ Dropped table: ${table}`);
    } catch (error) {
      console.error(`   ✗ Failed to drop table: ${table}`);
      throw error;
    }
  }
  
  console.log('\n✅ All tables dropped successfully!\n');
}

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function resetDatabase(): Promise<void> {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database reset...\n');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Drop all tables
    await dropAllTables(client);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Database reset completed!\n');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run db:migrate');
    console.log('   2. Run: npm run db:seed\n');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('\n❌ Database reset failed!');
    console.error('Error:', error);
    throw error;
    
  } finally {
    client.release();
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  TastyFund Database Reset Tool');
  console.log('═══════════════════════════════════════\n');
  
  // Check environment
  const env = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${env}`);
  console.log(`Database: ${process.env.DATABASE_URL ? '✓ Configured' : '✗ Not configured'}\n`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    process.exit(1);
  }
  
  // Block production resets
  if (env === 'production') {
    console.error('❌ DATABASE RESET IS DISABLED IN PRODUCTION!');
    console.error('   This is a safety measure to prevent accidental data loss.');
    console.error('   If you really need to reset production, do it manually.\n');
    process.exit(1);
  }
  
  // Warn about data loss
  console.log('⚠️  WARNING: This will DELETE ALL DATA in your database!');
  console.log('   All tables will be dropped and cannot be recovered.');
  console.log('   This action is IRREVERSIBLE!\n');
  
  // Ask for confirmation
  const confirmed = await askConfirmation('Are you sure you want to continue? (yes/no): ');
  
  if (!confirmed) {
    console.log('\n❌ Database reset cancelled.\n');
    await pool.end();
    process.exit(0);
  }
  
  // Double confirmation
  console.log('\n⚠️  FINAL WARNING: This is your last chance to cancel!');
  const doubleConfirmed = await askConfirmation('Type "yes" to proceed with database reset: ');
  
  if (!doubleConfirmed) {
    console.log('\n❌ Database reset cancelled.\n');
    await pool.end();
    process.exit(0);
  }
  
  console.log('\n');
  
  // Run reset
  await resetDatabase();
  
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

export { resetDatabase, dropAllTables };
