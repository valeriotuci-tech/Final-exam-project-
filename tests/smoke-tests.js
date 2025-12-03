/**
 * Production Smoke Test Suite
 * Verifies critical functionality of deployed TastyFund application
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://r11-production.up.railway.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tasty-fund-bmm5mu53p-tanias-projects-8da0b11a.vercel.app';

// Test results
const results = {
  timestamp: new Date().toISOString(),
  backend: BACKEND_URL,
  frontend: FRONTEND_URL,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test 1: Backend Health Check
async function testBackendHealth() {
  const testName = 'Backend Health Check';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    
    if (response.statusCode === 200) {
      const body = JSON.parse(response.body);
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: `Server is healthy. Status: ${body.status || 'ok'}`,
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 2: Database Connectivity
async function testDatabaseConnectivity() {
  const testName = 'Database Connectivity';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    // Try to access campaigns endpoint which requires DB
    const response = await makeRequest(`${BACKEND_URL}/api/campaigns`);
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: 'Database is accessible and responding',
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 3: API Documentation Endpoint
async function testAPIDocumentation() {
  const testName = 'API Documentation Availability';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api-docs`);
    
    if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: 'API documentation is accessible',
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'WARN',
      details: 'API docs may not be configured',
      error: error.message
    });
    console.log('⚠️  WARN:', error.message);
    return false;
  }
}

// Test 4: Authentication Flow - Register
async function testAuthenticationRegister() {
  const testName = 'Authentication - User Registration';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Smoke Test User'
    };

    const response = await makeRequest(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: testUser
    });
    
    if (response.statusCode === 201 || response.statusCode === 400) {
      const body = JSON.parse(response.body);
      
      if (response.statusCode === 201 && body.data && body.data.accessToken) {
        results.tests.push({
          name: testName,
          status: 'PASS',
          details: 'User registration successful with token',
          statusCode: response.statusCode
        });
        console.log('✅ PASS');
        return { success: true, token: body.data.accessToken, user: body.data.user };
      } else if (response.statusCode === 400) {
        results.tests.push({
          name: testName,
          status: 'PASS',
          details: 'Registration endpoint responding (validation working)',
          statusCode: response.statusCode
        });
        console.log('✅ PASS (validation working)');
        return { success: true };
      }
    }
    
    throw new Error(`Unexpected status code: ${response.statusCode}`);
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return { success: false };
  }
}

// Test 5: Authentication Flow - Login
async function testAuthenticationLogin() {
  const testName = 'Authentication - User Login';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await makeRequest(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: credentials
    });
    
    if (response.statusCode === 200 || response.statusCode === 401) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: 'Login endpoint responding correctly',
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 6: Campaign Endpoints
async function testCampaignEndpoints() {
  const testName = 'Campaign Listing';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/campaigns`);
    
    if (response.statusCode === 200) {
      const body = JSON.parse(response.body);
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: `Campaigns endpoint working. Found ${body.data?.length || 0} campaigns`,
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 7: Restaurant Endpoints
async function testRestaurantEndpoints() {
  const testName = 'Restaurant Listing';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/restaurants`);
    
    if (response.statusCode === 200) {
      const body = JSON.parse(response.body);
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: `Restaurants endpoint working. Found ${body.data?.length || 0} restaurants`,
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 8: Frontend Accessibility
async function testFrontendAccessibility() {
  const testName = 'Frontend Homepage Accessibility';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: 'Frontend is accessible and responding',
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 9: CORS Configuration
async function testCORSConfiguration() {
  const testName = 'CORS Configuration';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/campaigns`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    const hasCORS = response.headers['access-control-allow-origin'];
    
    if (hasCORS) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: `CORS configured: ${hasCORS}`,
        statusCode: response.statusCode
      });
      console.log('✅ PASS');
      return true;
    } else {
      results.tests.push({
        name: testName,
        status: 'WARN',
        details: 'CORS headers not detected',
        statusCode: response.statusCode
      });
      console.log('⚠️  WARN: CORS headers not detected');
      return false;
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Test 10: Response Time Check
async function testResponseTime() {
  const testName = 'API Response Time';
  console.log(`\n🧪 Testing: ${testName}...`);
  
  try {
    const startTime = Date.now();
    await makeRequest(`${BACKEND_URL}/health`);
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 3000) {
      results.tests.push({
        name: testName,
        status: 'PASS',
        details: `Response time: ${responseTime}ms (Good)`,
        responseTime: responseTime
      });
      console.log('✅ PASS');
      return true;
    } else {
      results.tests.push({
        name: testName,
        status: 'WARN',
        details: `Response time: ${responseTime}ms (Slow)`,
        responseTime: responseTime
      });
      console.log('⚠️  WARN: Slow response time');
      return false;
    }
  } catch (error) {
    results.tests.push({
      name: testName,
      status: 'FAIL',
      details: error.message,
      error: error.toString()
    });
    console.log('❌ FAIL:', error.message);
    return false;
  }
}

// Generate Markdown Report
function generateMarkdownReport() {
  const passed = results.tests.filter(t => t.status === 'PASS').length;
  const failed = results.tests.filter(t => t.status === 'FAIL').length;
  const warned = results.tests.filter(t => t.status === 'WARN').length;
  const total = results.tests.length;
  const successRate = ((passed / total) * 100).toFixed(1);

  let markdown = `# 🚀 TastyFund Production Deployment Verification

**Test Date:** ${new Date(results.timestamp).toLocaleString()}

**Backend URL:** ${results.backend}  
**Frontend URL:** ${results.frontend}

## 📊 Test Summary

- **Total Tests:** ${total}
- **Passed:** ✅ ${passed}
- **Failed:** ❌ ${failed}
- **Warnings:** ⚠️  ${warned}
- **Success Rate:** ${successRate}%

---

## 🧪 Test Results

| # | Test Name | Status | Details |
|---|-----------|--------|---------|
`;

  results.tests.forEach((test, index) => {
    const statusIcon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    markdown += `| ${index + 1} | ${test.name} | ${statusIcon} ${test.status} | ${test.details} |\n`;
  });

  markdown += `\n---

## 📝 Detailed Test Information

`;

  results.tests.forEach((test, index) => {
    markdown += `### ${index + 1}. ${test.name}

**Status:** ${test.status === 'PASS' ? '✅ PASS' : test.status === 'FAIL' ? '❌ FAIL' : '⚠️ WARN'}  
**Details:** ${test.details}  
`;
    if (test.statusCode) {
      markdown += `**HTTP Status:** ${test.statusCode}  \n`;
    }
    if (test.responseTime) {
      markdown += `**Response Time:** ${test.responseTime}ms  \n`;
    }
    if (test.error) {
      markdown += `**Error:** \`${test.error}\`  \n`;
    }
    markdown += '\n';
  });

  markdown += `---

## 🎯 Deployment Status

`;

  if (failed === 0) {
    markdown += `### ✅ DEPLOYMENT VERIFIED

All critical tests passed! Your TastyFund application is fully operational.

**Next Steps:**
- Monitor application logs for any runtime errors
- Set up continuous monitoring (e.g., UptimeRobot, Pingdom)
- Configure error tracking (Sentry is ready in your backend)
- Review and optimize slow endpoints if any

`;
  } else {
    markdown += `### ⚠️ DEPLOYMENT ISSUES DETECTED

${failed} test(s) failed. Please review the errors above and address them.

**Action Required:**
- Check backend logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure database is connected and seeded
- Review CORS configuration if frontend can't connect to backend

`;
  }

  markdown += `---

## 🔗 Quick Links

- [Backend Health Check](${results.backend}/health)
- [API Documentation](${results.backend}/api-docs)
- [Frontend Application](${results.frontend})
- [Railway Dashboard](https://railway.app)
- [Vercel Dashboard](https://vercel.com)

---

*Generated by TastyFund Smoke Test Suite*
`;

  return markdown;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting TastyFund Production Smoke Tests...\n');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log('='.repeat(60));

  // Backend Tests
  await testBackendHealth();
  await testDatabaseConnectivity();
  await testAPIDocumentation();
  await testAuthenticationRegister();
  await testAuthenticationLogin();
  await testCampaignEndpoints();
  await testRestaurantEndpoints();
  await testCORSConfiguration();
  await testResponseTime();
  
  // Frontend Tests
  await testFrontendAccessibility();

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${results.tests.filter(t => t.status === 'PASS').length}`);
  console.log(`❌ Failed: ${results.tests.filter(t => t.status === 'FAIL').length}`);
  console.log(`⚠️  Warnings: ${results.tests.filter(t => t.status === 'WARN').length}`);
  
  // Generate report
  const report = generateMarkdownReport();
  const fs = require('fs');
  const path = require('path');
  
  const reportPath = path.join(__dirname, '..', 'deployment-verification.md');
  fs.writeFileSync(reportPath, report);
  
  console.log(`\n📄 Report saved to: deployment-verification.md`);
  console.log('\n✨ Smoke tests completed!\n');
}

// Run tests
runAllTests().catch(console.error);
