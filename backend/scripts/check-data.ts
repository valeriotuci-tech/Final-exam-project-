import { config } from 'dotenv';
import { Pool } from 'pg';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkData() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking current database data...\n');
    
    // Check campaigns
    const campaigns = await client.query('SELECT id, title, description, target_amount, current_amount, status FROM campaigns ORDER BY created_at DESC LIMIT 5');
    console.log('📊 CAMPAIGNS (first 5):');
    campaigns.rows.forEach((c, i) => {
      console.log(`   ${i + 1}. "${c.title}"`);
      console.log(`      Target: $${c.target_amount}, Current: $${c.current_amount}, Status: ${c.status}`);
    });
    console.log(`   Total campaigns: ${campaigns.rowCount}\n`);
    
    // Check restaurants
    const restaurants = await client.query('SELECT id, name, cuisine_type, location FROM restaurants ORDER BY created_at DESC LIMIT 5');
    console.log('🍽️  RESTAURANTS (first 5):');
    restaurants.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. "${r.name}" - ${r.cuisine_type} (${r.location})`);
    });
    console.log(`   Total restaurants: ${restaurants.rowCount}\n`);
    
    // Check users
    const users = await client.query('SELECT id, email, name, role FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('👥 USERS (first 5):');
    users.rows.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.name} (${u.email}) - Role: ${u.role}`);
    });
    console.log(`   Total users: ${users.rowCount}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkData();
