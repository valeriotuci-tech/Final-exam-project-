const https = require('https');

const data = JSON.stringify({
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
    'Content-Length': data.length,
    'Origin': 'https://tasty-fund-ieu2l1jgk-tanias-projects-8da0b11a.vercel.app'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    console.log(body);
    
    try {
      const parsed = JSON.parse(body);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
