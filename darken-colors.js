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
    
    // Replace lighter amber shades with darker ones
    updated = updated.replace(/amber-300/g, 'amber-400');
    updated = updated.replace(/amber-400/g, 'amber-500');
    updated = updated.replace(/text-amber-500/g, 'text-amber-600');
    updated = updated.replace(/bg-amber-500/g, 'bg-amber-600');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Darkened: ${file}`);
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Color darkening complete!');
