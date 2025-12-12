import { pool } from '../src/config/database';

async function seedInvestments() {
  try {
    console.log('🌱 Seeding investments...');

    // Get admin user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@tastyfund.com' LIMIT 1"
    );

    if (userResult.rows.length === 0) {
      console.error('❌ Admin user not found');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log('✅ Found user:', userId);

    // Get some campaigns
    const campaignsResult = await pool.query(
      'SELECT id FROM campaigns LIMIT 5'
    );

    if (campaignsResult.rows.length === 0) {
      console.error('❌ No campaigns found');
      return;
    }

    console.log(`✅ Found ${campaignsResult.rows.length} campaigns`);

    // Create investments for each campaign
    for (const campaign of campaignsResult.rows) {
      const amount = Math.floor(Math.random() * 500000) + 50000; // Random between 50k-550k KRW
      
      await pool.query(
        `INSERT INTO investments (user_id, campaign_id, amount, status, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT DO NOTHING`,
        [userId, campaign.id, amount, 'completed']
      );

      console.log(`✅ Created investment: ₩${amount.toLocaleString()} for campaign ${campaign.id}`);
    }

    console.log('✅ Investments seeded successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding investments:', error);
    await pool.end();
    process.exit(1);
  }
}

seedInvestments();
