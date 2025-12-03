const https = require('https');

const BACKEND_URL = 'https://r11-production.up.railway.app';

async function checkEndpoint(path) {
  return new Promise((resolve) => {
    const url = new URL(path, BACKEND_URL);
    console.log(`\nTesting: ${url.href}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data.substring(0, 500)}`);
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  console.log('🔍 Checking Railway Backend Deployment\n');
  console.log('='.repeat(60));
  
  await checkEndpoint('/');
  await checkEndpoint('/health');
  await checkEndpoint('/api/campaigns');
  await checkEndpoint('/api-docs');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 If all return 404, the backend may not be properly deployed.');
  console.log('   Check Railway dashboard: https://railway.app');
}

main();
