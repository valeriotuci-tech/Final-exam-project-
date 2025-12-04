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
    
    // Replace amber with blue tones
    // For text, use lighter blue (200-300) for visibility
    // For backgrounds, use darker blue (500-600)
    
    // Text colors - use light blue for visibility on dark background
    updated = updated.replace(/text-amber-400/g, 'text-blue-300');
    updated = updated.replace(/text-amber-500/g, 'text-blue-200');
    updated = updated.replace(/text-amber-300/g, 'text-blue-200');
    
    // Background colors - use navy blue
    updated = updated.replace(/bg-amber-500\/10/g, 'bg-blue-500/10');
    updated = updated.replace(/bg-amber-500\/20/g, 'bg-blue-500/20');
    updated = updated.replace(/bg-amber-500\/5/g, 'bg-blue-500/5');
    updated = updated.replace(/bg-amber-500/g, 'bg-blue-600');
    updated = updated.replace(/bg-amber-600/g, 'bg-blue-700');
    
    // Ring/border colors
    updated = updated.replace(/ring-amber-500\/40/g, 'ring-blue-500/40');
    updated = updated.replace(/ring-amber-500\/20/g, 'ring-blue-500/20');
    updated = updated.replace(/border-amber-500\/50/g, 'border-blue-500/50');
    updated = updated.replace(/border-amber-500\/20/g, 'border-blue-500/20');
    
    // Hover states
    updated = updated.replace(/hover:bg-amber-500\/20/g, 'hover:bg-blue-500/20');
    updated = updated.replace(/hover:bg-amber-600/g, 'hover:bg-blue-700');
    updated = updated.replace(/hover:text-amber-300/g, 'hover:text-blue-200');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Changed to blue: ${file}`);
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Color change complete - from gold to navy blue!');
