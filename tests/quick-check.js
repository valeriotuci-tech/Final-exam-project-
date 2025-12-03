/**
 * Quick Deployment Check
 * Fast verification of deployment status
 */

const https = require('https');

const BACKEND_URL = process.env.BACKEND_URL || 'https://r11-production.up.railway.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tasty-fund-bmm5mu53p-tanias-projects-8da0b11a.vercel.app';

function checkURL(url, name) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Checking ${name}...`);
    console.log(`   URL: ${url}`);
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers:`, Object.keys(res.headers).join(', '));
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.length < 500) {
          console.log(`   Response: ${data.substring(0, 200)}`);
        }
        
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`   ✅ ${name} is accessible`);
          resolve(true);
        } else {
          console.log(`   ⚠️  ${name} returned ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`   ❌ Timeout after 10s`);
      resolve(false);
    });

    req.end();
  });
}

async function quickCheck() {
  console.log('🚀 TastyFund Quick Deployment Check\n');
  console.log('='.repeat(60));
  
  const backendHealth = await checkURL(`${BACKEND_URL}/health`, 'Backend Health');
  const backendAPI = await checkURL(`${BACKEND_URL}/api/campaigns`, 'Backend API');
  const frontend = await checkURL(FRONTEND_URL, 'Frontend');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   Backend Health: ${backendHealth ? '✅' : '❌'}`);
  console.log(`   Backend API: ${backendAPI ? '✅' : '❌'}`);
  console.log(`   Frontend: ${frontend ? '✅' : '❌'}`);
  
  if (backendHealth && backendAPI && frontend) {
    console.log('\n✨ All systems operational!\n');
  } else {
    console.log('\n⚠️  Some services need attention\n');
    console.log('💡 Troubleshooting tips:');
    if (!backendHealth) {
      console.log('   - Check Railway dashboard for backend logs');
      console.log('   - Verify DATABASE_URL is set');
      console.log('   - Ensure backend service is running');
    }
    if (!backendAPI) {
      console.log('   - Verify API routes are properly configured');
      console.log('   - Check for startup errors in logs');
    }
    if (!frontend) {
      console.log('   - Check Vercel deployment status');
      console.log('   - Verify build completed successfully');
    }
    console.log('');
  }
}

quickCheck().catch(console.error);
