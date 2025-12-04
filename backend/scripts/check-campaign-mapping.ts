import { config } from 'dotenv';
import { Pool } from 'pg';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkMapping() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Checking campaign to milestone mapping...\n');
    
    // Get campaigns
    const campaigns = await client.query(`
      SELECT id, title, created_at 
      FROM campaigns 
      ORDER BY created_at
    `);
    
    console.log('Campaigns (in order):');
    campaigns.rows.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.title}`);
      console.log(`     UUID: ${c.id}`);
    });
    
    console.log('\n📌 Milestones:');
    const milestones = await client.query(`
      SELECT campaign_id, COUNT(*) as count
      FROM milestones
      GROUP BY campaign_id
      ORDER BY campaign_id
    `);
    
    milestones.rows.forEach(m => {
      console.log(`  Campaign ID ${m.campaign_id}: ${m.count} milestones`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkMapping();
