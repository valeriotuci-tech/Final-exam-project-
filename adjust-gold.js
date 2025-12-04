const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'frontend/components/Navigation.tsx',
  'frontend/app/page.tsx',
  'frontend/app/campaigns/page.tsx',
  'frontend/app/campaigns/[id]/page.tsx',
  'frontend/app/login/page.tsx',
  'frontend/app/register/page.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    
    // Adjust to brighter, less orange gold tones
    // Use amber-400 (bright gold) and amber-500 (medium gold) more
    updated = updated.replace(/amber-600/g, 'amber-500');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Adjusted: ${file}`);
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Gold adjustment complete - brighter, less orange!');
