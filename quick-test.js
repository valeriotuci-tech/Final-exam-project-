const axios = require('axios');

async function quickTest() {
  try {
    // Test 1: Check version
    console.log('1️⃣ Checking backend version...');
    const versionRes = await axios.get('https://r11-production.up.railway.app/version');
    console.log('✅ Version:', versionRes.data);

    // Test 2: Check if endpoint exists
    console.log('\n2️⃣ Checking if my-investments endpoint exists...');
    try {
      await axios.get('https://r11-production.up.railway.app/api/campaigns/my-investments');
    } catch (err) {
      console.log('Status:', err.response?.status);
      console.log('Error:', err.response?.data);
      
      if (err.response?.status === 401) {
        console.log('✅ Endpoint exists! (401 = needs auth, which is correct)');
      } else if (err.response?.status === 404) {
        console.log('❌ Endpoint NOT found (404)');
      } else if (err.response?.status === 400) {
        console.log('⚠️ Bad request (400) - endpoint exists but something is wrong');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
