import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findMissingSchools() {
  try {
    console.log('Analyzing missing university detail files...');
    
    // Step 1: Load summary data
    console.log('Loading summary data...');
    const summaryPath = path.join(__dirname, 'public', 'data', 'summary.json');
    console.log('Summary path:', summaryPath);
    
    const summaryContent = await fs.readFile(summaryPath, 'utf-8');
    const summaryData = JSON.parse(summaryContent);
    console.log(`Found ${summaryData.length} universities in summary.json`);
    
    // Step 2: Get list of existing detail files
    console.log('Scanning detail files directory...');
    const detailsDir = path.join(__dirname, 'public', 'data', 'details');
    console.log('Details dir:', detailsDir);
    
    const detailFiles = await fs.readdir(detailsDir);
    const existingSlugs = new Set(detailFiles.map(file => file.replace('.json', '')));
    console.log(`Found ${existingSlugs.size} detail files`);
    
    // Step 3: Identify missing schools
    console.log('Identifying missing schools...');
    const missingSchools = [];
    
    for (const school of summaryData) {
      if (!existingSlugs.has(school.slug)) {
        missingSchools.push({
          id: school.id,
          name: school.name,
          slug: school.slug,
          city: school.city,
          state: school.state
        });
      }
    }
    
    console.log(`Total universities in summary: ${summaryData.length}`);
    console.log(`Detail files found: ${existingSlugs.size}`);
    console.log(`Missing detail files: ${missingSchools.length}`);
    
    if (missingSchools.length > 0) {
      console.log(`\nMissing Universities (${missingSchools.length}):`);
      
      missingSchools.forEach((school, index) => {
        console.log(`${index + 1}. ${school.name} (${school.city}, ${school.state}) - ID: ${school.id}`);
      });
      
      // Save missing schools to a file
      const missingSchoolsPath = path.join(__dirname, 'missing-schools.json');
      await fs.writeFile(missingSchoolsPath, JSON.stringify(missingSchools, null, 2));
      console.log(`\nSaved missing schools list to: missing-schools.json`);
      
    } else {
      console.log('All universities have detail files! No missing data.');
    }
    
  } catch (error) {
    console.error('Error analyzing missing schools:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the analysis
findMissingSchools(); 