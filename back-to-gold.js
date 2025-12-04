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
    
    // Change back from blue to amber (gold)
    updated = updated.replace(/text-blue-300/g, 'text-amber-400');
    updated = updated.replace(/text-blue-200/g, 'text-amber-500');
    
    updated = updated.replace(/bg-blue-500\/10/g, 'bg-amber-500/10');
    updated = updated.replace(/bg-blue-500\/20/g, 'bg-amber-500/20');
    updated = updated.replace(/bg-blue-500\/5/g, 'bg-amber-500/5');
    updated = updated.replace(/bg-blue-600/g, 'bg-amber-500');
    updated = updated.replace(/bg-blue-700/g, 'bg-amber-600');
    
    updated = updated.replace(/ring-blue-500\/40/g, 'ring-amber-500/40');
    updated = updated.replace(/ring-blue-500\/20/g, 'ring-amber-500/20');
    updated = updated.replace(/border-blue-500\/50/g, 'border-amber-500/50');
    updated = updated.replace(/border-blue-500\/20/g, 'border-amber-500/20');
    
    updated = updated.replace(/hover:bg-blue-500\/20/g, 'hover:bg-amber-500/20');
    updated = updated.replace(/hover:bg-blue-700/g, 'hover:bg-amber-600');
    updated = updated.replace(/hover:text-blue-200/g, 'hover:text-amber-300');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Changed back to gold: ${file}`);
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Color change complete - back to gold #FFCB4B!');
