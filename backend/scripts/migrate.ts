import { config } from 'dotenv';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

interface MigrationResult {
  success: boolean;
  message: string;
  error?: Error;
}

async function runMigration(): Promise<MigrationResult> {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migration...\n');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('📄 Reading schema.sql...');
    console.log(`   Location: ${schemaPath}`);
    console.log(`   Size: ${schemaSql.length} characters\n`);
    
    // Execute schema
    console.log('⚙️  Executing schema...');
    await client.query(schemaSql);
    
    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 Created tables:');
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Check indexes
    const indexesResult = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY indexname;
    `);
    
    if (indexesResult.rows.length > 0) {
      console.log('\n📇 Created indexes:');
      indexesResult.rows.forEach((row) => {
        console.log(`   - ${row.indexname}`);
      });
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n✨ Database is ready!\n');
    
    return {
      success: true,
      message: 'Migration completed successfully',
    };
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    
    console.error('\n❌ Migration failed!\n');
    console.error('Error details:', error);
    
    return {
      success: false,
      message: 'Migration failed',
      error: error as Error,
    };
    
  } finally {
    client.release();
  }
}

async function checkConnection(): Promise<boolean> {
  try {
    console.log('🔌 Checking database connection...');
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`✅ Connected to PostgreSQL`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].pg_version.split(',')[0]}\n`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  TastyFund Database Migration Tool');
  console.log('═══════════════════════════════════════\n');
  
  // Check environment
  const env = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${env}`);
  console.log(`Database: ${process.env.DATABASE_URL ? '✓ Configured' : '✗ Not configured'}\n`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your .env file\n');
    process.exit(1);
  }
  
  // Check connection
  const connected = await checkConnection();
  if (!connected) {
    console.error('\n❌ Cannot proceed without database connection\n');
    process.exit(1);
  }
  
  // Run migration
  const result = await runMigration();
  
  // Close pool
  await pool.end();
  
  // Exit with appropriate code
  if (result.success) {
    console.log('🎉 Migration process completed successfully!\n');
    process.exit(0);
  } else {
    console.error('💥 Migration process failed!\n');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { runMigration, checkConnection };
