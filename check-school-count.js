import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to create slug from university name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Simple CSV parser to handle quoted fields properly
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
}

async function checkSchoolCount() {
  try {
    console.log('🔍 Analyzing school count discrepancies...\n');

    // Step 1: Load our summary data (what we processed from API)
    console.log('📊 Loading processed summary data...');
    const summaryPath = path.join(__dirname, 'public', 'data', 'summary.json');
    const summaryContent = await fs.readFile(summaryPath, 'utf-8');
    const summaryData = JSON.parse(summaryContent);
    console.log(`✅ Processed schools in summary.json: ${summaryData.length}`);

    // Create a lookup for our processed schools by UNITID
    const processedSchools = new Map();
    summaryData.forEach(school => {
      processedSchools.set(String(school.id), school);
    });

    // Step 2: Read the CSV source file to get the complete list
    console.log('📁 Reading College Scorecard CSV source file...');
    const csvPath = path.join(__dirname, 'scripts', 'data_source', 'Most-Recent-Cohorts-Institution_05192025.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const csvLines = csvContent.split('\n').filter(line => line.trim()); // Remove empty lines
    
    // Parse CSV header and clean it (remove BOM and special characters)
    const rawHeader = csvLines[0];
    const cleanHeader = rawHeader.replace(/^\uFEFF/, ''); // Remove BOM if present
    const header = cleanHeader.split(',').map(field => field.trim().replace(/^"|"$/g, '')); // Clean quotes
    
    const unitidIndex = header.findIndex(field => field.toUpperCase() === 'UNITID');
    const nameIndex = header.findIndex(field => field.toUpperCase() === 'INSTNM');
    const cityIndex = header.findIndex(field => field.toUpperCase() === 'CITY');
    const stateIndex = header.findIndex(field => field.toUpperCase() === 'STABBR');
    
    console.log(`✅ CSV source file: ${csvLines.length - 1} schools (excluding header)`);
    console.log(`📋 Field positions - UNITID: ${unitidIndex}, INSTNM: ${nameIndex}, CITY: ${cityIndex}, STATE: ${stateIndex}`);
    console.log(`📋 First few header fields: ${header.slice(0, 10).join(', ')}\n`);
    
    if (unitidIndex === -1 || nameIndex === -1) {
      throw new Error('Required fields (UNITID or INSTNM) not found in CSV header');
    }

    // Step 3: Process CSV data and find missing schools
    const csvSchools = [];
    const missingSchools = [];
    
    for (let i = 1; i < csvLines.length; i++) {
      const line = csvLines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const fields = parseCSVLine(line);
      if (fields.length < Math.max(unitidIndex, nameIndex, cityIndex, stateIndex) + 1) {
        continue; // Skip malformed lines
      }
      
      const unitid = fields[unitidIndex]?.trim();
      const name = fields[nameIndex]?.trim().replace(/^"|"$/g, ''); // Remove quotes
      const city = fields[cityIndex]?.trim().replace(/^"|"$/g, '');
      const state = fields[stateIndex]?.trim().replace(/^"|"$/g, '');
      
      if (unitid && name) {
        const schoolData = {
          unitid: unitid,
          name: name,
          city: city,
          state: state,
          slug: createSlug(name)
        };
        
        csvSchools.push(schoolData);
        
        // Check if this school exists in our processed data (convert unitid to string)
        if (!processedSchools.has(String(unitid))) {
          missingSchools.push(schoolData);
        }
      }
    }

    console.log('📈 **COUNT ANALYSIS:**');
    console.log(`📋 Total schools in CSV source: ${csvSchools.length}`);
    console.log(`✅ Schools processed from API: ${summaryData.length}`);
    console.log(`❌ Missing schools: ${missingSchools.length}`);
    console.log(`📊 Processing success rate: ${((summaryData.length / csvSchools.length) * 100).toFixed(2)}%\n`);

    // Step 4: Check for duplicates in our processed data
    const processedUnitIds = new Set();
    const duplicates = [];
    summaryData.forEach(school => {
      if (processedUnitIds.has(school.id)) {
        duplicates.push(school);
      } else {
        processedUnitIds.add(school.id);
      }
    });

    if (duplicates.length > 0) {
      console.log(`🔄 **DUPLICATE ANALYSIS:**`);
      console.log(`❗ Found ${duplicates.length} duplicate entries in processed data`);
      console.log('First 10 duplicates:');
      duplicates.slice(0, 10).forEach(school => {
        console.log(`  - ${school.name} (${school.city}, ${school.state}) - ID: ${school.id}`);
      });
      console.log('');
    }

    // Step 5: Show missing schools details
    if (missingSchools.length > 0) {
      console.log('❌ **MISSING SCHOOLS:**');
      console.log(`\nThe following ${missingSchools.length} schools are in the CSV but NOT in our processed data:\n`);
      
      // Group by state for better readability
      const missingByState = {};
      missingSchools.forEach(school => {
        if (!missingByState[school.state]) {
          missingByState[school.state] = [];
        }
        missingByState[school.state].push(school);
      });

      // Show first 50 missing schools grouped by state
      let showCount = 0;
      for (const [state, schools] of Object.entries(missingByState)) {
        if (showCount >= 50) {
          console.log(`\n... and ${missingSchools.length - showCount} more schools`);
          break;
        }
        
        console.log(`🏛️  **${state}:**`);
        for (const school of schools.slice(0, Math.min(10, 50 - showCount))) {
          console.log(`   • ${school.name} (${school.city}) - ID: ${school.unitid}`);
          showCount++;
          if (showCount >= 50) break;
        }
        if (schools.length > 10) {
          console.log(`   ... and ${schools.length - 10} more schools in ${state}`);
        }
        console.log('');
      }

      // Save missing schools to a file for processing
      console.log('💾 Saving missing schools data...');
      const missingDataPath = path.join(__dirname, 'missing-schools.json');
      await fs.writeFile(missingDataPath, JSON.stringify(missingSchools, null, 2));
      console.log(`✅ Missing schools saved to: missing-schools.json`);
    } else {
      console.log('🎉 **GREAT NEWS!** All schools from the CSV source have been processed successfully!');
    }

    // Step 6: Summary
    console.log('\n📋 **SUMMARY:**');
    console.log(`• Source CSV file: ${csvSchools.length} schools`);
    console.log(`• Successfully processed: ${summaryData.length} schools`);
    console.log(`• Missing from processing: ${missingSchools.length} schools`);
    console.log(`• Duplicates in processed data: ${duplicates.length} entries`);
    console.log(`• Unique processed schools: ${processedUnitIds.size} schools\n`);

    if (missingSchools.length > 0) {
      console.log('🎯 **NEXT STEPS:**');
      console.log('1. Review the missing schools list above');
      console.log('2. Check missing-schools.json for complete details');
      console.log('3. Consider running a targeted API fetch for missing schools');
      console.log('4. Investigate why these schools were not returned by the API');
    }

  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    if (error.code === 'ENOENT') {
      console.error('💡 Make sure all required files exist:');
      console.error('   • public/data/summary.json');
      console.error('   • scripts/data_source/Most-Recent-Cohorts-Institution_05192025.csv');
    }
  }
}

// Run the analysis
checkSchoolCount(); 