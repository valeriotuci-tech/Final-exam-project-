const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'frontend/app/campaigns/[id]/page.tsx',
  'frontend/app/login/page.tsx',
  'frontend/app/register/page.tsx',
  'frontend/app/restaurants/page.tsx',
  'frontend/app/test-login/page.tsx',
  'frontend/app/api-check/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/emerald/g, 'amber');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Updated: ${file}`);
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Color replacement complete!');
