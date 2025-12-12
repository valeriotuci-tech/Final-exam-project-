const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfYjvDYcbUkUYFZrbEYkPsIeTKmPaObs@maglev.proxy.rlwy.net:19923/railway'
});

async function createInvestor() {
  try {
    console.log('👤 Creating investor user...');

    // Hash password
    const hashedPassword = await bcrypt.hash('investor123', 10);

    // Create investor user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, updated_at = NOW()
       RETURNING id, email, name, role`,
      ['investor@tastyfund.com', hashedPassword, 'Maria Investor', 'investor']
    );

    const userId = userResult.rows[0].id;
    console.log('✅ Created investor:', userResult.rows[0]);

    // Get some campaigns
    const campaignsResult = await pool.query('SELECT id FROM campaigns LIMIT 3');
    
    console.log(`✅ Found ${campaignsResult.rows.length} campaigns`);

    // Create investments
    const investments = [
      { amount: 100000, campaign: campaignsResult.rows[0]?.id },
      { amount: 250000, campaign: campaignsResult.rows[1]?.id },
      { amount: 500000, campaign: campaignsResult.rows[2]?.id }
    ];

    for (const inv of investments) {
      if (inv.campaign) {
        await pool.query(
          `INSERT INTO investments (user_id, campaign_id, amount, status, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT DO NOTHING`,
          [userId, inv.campaign, inv.amount, 'completed']
        );
        console.log(`✅ Created investment: ₩${inv.amount.toLocaleString()}`);
      }
    }

    console.log('\n✅ Investor created successfully!');
    console.log('📧 Email: investor@tastyfund.com');
    console.log('🔑 Password: investor123');
    console.log('💰 Total invested: ₩850,000');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

createInvestor();
