import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findMissingDetailFiles() {
  try {
    console.log('🔍 Finding schools with summary data but missing detail files...\n');

    // Load summary data
    const summaryPath = path.join(__dirname, 'public', 'data', 'summary.json');
    const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf-8'));
    console.log(`📊 Schools in summary.json: ${summaryData.length}`);

    // Get existing detail files
    const detailsDir = path.join(__dirname, 'public', 'data', 'details');
    const detailFiles = await fs.readdir(detailsDir);
    const detailSlugs = new Set(detailFiles.map(file => file.replace('.json', '')));
    console.log(`📁 Detail files found: ${detailFiles.length}`);

    // Find missing detail files
    const missingDetails = [];
    for (const school of summaryData) {
      if (!detailSlugs.has(school.slug)) {
        missingDetails.push(school);
      }
    }

    console.log(`\n📈 **RESULTS:**`);
    console.log(`✅ Summary entries: ${summaryData.length}`);
    console.log(`✅ Detail files: ${detailFiles.length}`);
    console.log(`❌ Missing detail files: ${missingDetails.length}\n`);

    if (missingDetails.length > 0) {
      console.log('❌ **SCHOOLS MISSING DETAIL FILES:**\n');
      
      // Group by state
      const missingByState = {};
      missingDetails.forEach(school => {
        const state = school.state || 'Unknown';
        if (!missingByState[state]) missingByState[state] = [];
        missingByState[state].push(school);
      });

      let shown = 0;
      for (const [state, schools] of Object.entries(missingByState)) {
        if (shown >= 50) {
          console.log(`\n... and ${missingDetails.length - shown} more schools`);
          break;
        }
        
        console.log(`🏛️  **${state}:**`);
        for (const school of schools.slice(0, Math.min(10, 50 - shown))) {
          console.log(`   • ${school.name} (${school.city || 'N/A'}) - ID: ${school.id} - Slug: ${school.slug}`);
          shown++;
          if (shown >= 50) break;
        }
        if (schools.length > 10) {
          console.log(`   ... and ${schools.length - 10} more in ${state}`);
        }
        console.log('');
      }

      // Save missing details list
      const missingPath = path.join(__dirname, 'missing-detail-files.json');
      await fs.writeFile(missingPath, JSON.stringify(missingDetails, null, 2));
      console.log(`💾 Missing detail files list saved to: missing-detail-files.json`);
      
      console.log('\n🎯 **RECOMMENDED ACTION:**');
      console.log('Create detail files for these missing schools using the process-missing-details.js script');
    } else {
      console.log('🎉 **PERFECT!** All summary schools have corresponding detail files!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findMissingDetailFiles(); 