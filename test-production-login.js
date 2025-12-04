const https = require('https');

// Test the ACTUAL production URL
const frontendUrl = 'https://tasty-fund.vercel.app';
const backendUrl = 'https://r11-production.up.railway.app';

console.log('🧪 Testing PRODUCTION Login Flow\n');
console.log(`Frontend: ${frontendUrl}`);
console.log(`Backend: ${backendUrl}\n`);

// Test the actual login API call
console.log('Testing login API call from production frontend...\n');

const loginData = JSON.stringify({
  email: 'admin@tastyfund.com',
  password: 'password123'
});

const options = {
  hostname: 'r11-production.up.railway.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length,
    'Origin': frontendUrl,
    'Referer': frontendUrl + '/login'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`CORS Header: ${res.headers['access-control-allow-origin']}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse:');
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.success && parsed.data && parsed.data.accessToken) {
        console.log('\n✅ ✅ ✅ LOGIN SUCCESSFUL! ✅ ✅ ✅');
        console.log('✅ Access token received');
        console.log('✅ User:', parsed.data.user.name, `(${parsed.data.user.role})`);
        console.log('\n🎉 PRODUCTION LOGIN IS WORKING!');
        console.log(`\n👉 USE THIS URL: ${frontendUrl}/login`);
      } else {
        console.log('\n❌ LOGIN FAILED');
        console.log('Response:', parsed);
      }
    } catch (e) {
      console.log('❌ Could not parse response as JSON');
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(loginData);
req.end();
