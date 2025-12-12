const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfYjvDYcbUkUYFZrbEYkPsIeTKmPaObs@maglev.proxy.rlwy.net:19923/railway'
});

async function checkUsersTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('Users table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Also get a sample user
    const userSample = await pool.query('SELECT * FROM users LIMIT 1');
    console.log('\nSample user:', userSample.rows[0]);

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

checkUsersTable();
