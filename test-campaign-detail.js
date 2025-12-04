const https = require('https');

// Get first campaign ID
https.get('https://r11-production.up.railway.app/api/campaigns', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.data && json.data.length > 0) {
      const firstCampaignId = json.data[0].id;
      console.log('Testing campaign detail for ID:', firstCampaignId);
      
      // Test detail endpoint
      https.get(`https://r11-production.up.railway.app/api/campaigns/${firstCampaignId}`, (detailRes) => {
        let detailData = '';
        detailRes.on('data', (chunk) => { detailData += chunk; });
        detailRes.on('end', () => {
          console.log('\n✅ Campaign Detail Response:');
          console.log(JSON.stringify(JSON.parse(detailData), null, 2));
        });
      }).on('error', (e) => {
        console.error('❌ Error:', e.message);
      });
    }
  });
}).on('error', (e) => {
  console.error('❌ Error:', e.message);
});
