const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfYjvDYcbUkUYFZrbEYkPsIeTKmPaObs@maglev.proxy.rlwy.net:19923/railway'
});

async function checkInvestments() {
  try {
    // Check if investments table exists and has data
    const result = await pool.query(`
      SELECT 
        i.id,
        i.user_id,
        i.campaign_id,
        i.amount,
        i.status,
        u.email,
        c.title as campaign_title
      FROM investments i
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN campaigns c ON i.campaign_id = c.id
      LIMIT 10
    `);

    console.log('✅ Investments in database:', result.rows.length);
    console.log(JSON.stringify(result.rows, null, 2));

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkInvestments();
