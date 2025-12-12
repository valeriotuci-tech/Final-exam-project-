const axios = require('axios');

async function testInvestments() {
  try {
    // First login
    const loginResponse = await axios.post(
      'https://r11-production.up.railway.app/api/auth/login',
      {
        email: 'admin@tastyfund.com',
        password: 'password123'
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Login successful');
    const cookies = loginResponse.headers['set-cookie'];
    
    // Get investments
    const investmentsResponse = await axios.get(
      'https://r11-production.up.railway.app/api/campaigns/my-investments',
      {
        headers: {
          'Cookie': cookies ? cookies.join('; ') : ''
        }
      }
    );

    console.log('✅ Investments response:', JSON.stringify(investmentsResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testInvestments();
