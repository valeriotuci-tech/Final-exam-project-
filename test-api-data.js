const https = require('https');

async function testEndpoint(path, name) {
  return new Promise((resolve) => {
    https.get(`https://r11-production.up.railway.app${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`\n✅ ${name}:`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Count: ${json.data ? json.data.length : 'N/A'}`);
          if (json.data && json.data.length > 0) {
            console.log(`First item: ${JSON.stringify(json.data[0], null, 2).substring(0, 200)}...`);
          }
          resolve(json);
        } catch (e) {
          console.log(`❌ ${name}: Parse error - ${e.message}`);
          console.log(`Raw: ${data.substring(0, 200)}`);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.log(`❌ ${name}: ${e.message}`);
      resolve(null);
    });
  });
}

(async () => {
  console.log('🧪 Testing Backend API Data\n');
  await testEndpoint('/api/campaigns', 'Campaigns');
  await testEndpoint('/api/restaurants', 'Restaurants');
  console.log('\n✅ Done!');
})();
