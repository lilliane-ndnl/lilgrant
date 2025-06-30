import dotenv from "dotenv";
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Field Groups for Multi-Query Strategy (same as process-data.js)
const FIELD_GROUPS = {
  group1: [
    'id', 'school.name', 'school.city', 'school.state', 'school.zip', 'school.school_url',
    'school.ownership', 'school.locale', 'school.region_id', 'location.lat', 'location.lon',
    'latest.cost.avg_net_price.overall', 'latest.cost.tuition.in_state',
    'latest.cost.tuition.out_of_state', 'latest.cost.roomboard.oncampus',
    'latest.admissions.admission_rate.overall', 'latest.admissions.admission_rate_suppressed.overall',
    'school.open_admissions_policy', 'latest.admissions.test_requirements'
  ],
  group2: [
    'latest.student.size', 'latest.student.part_time_share',
    'latest.student.demographics.race_ethnicity.white',
    'latest.student.demographics.race_ethnicity.black',
    'latest.student.demographics.race_ethnicity.hispanic',
    'latest.student.demographics.race_ethnicity.asian',
    'latest.student.demographics.men', 'latest.student.demographics.women',
    'latest.student.demographics.student_faculty_ratio'
  ],
  group3: [
    'latest.completion.rate_suppressed.overall',
    'latest.completion.completion_rate_4yr_150nt',
    'latest.student.retention_rate.four_year.full_time',
    'latest.earnings.10_yrs_after_entry.median',
    'latest.aid.median_debt_suppressed.completers.overall',
    'latest.aid.pell_grant_rate', 'latest.aid.federal_loan_rate'
  ]
};

// Utility Functions
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Load LilGrant CSV Data
async function loadLilGrantData() {
  const csvPath = path.join(__dirname, 'data_source', 'lilgrant_international_playlist_masterfile.csv');
  console.log('📂 Loading LilGrant international data...');
  try {
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(';');
    const lilGrantMap = new Map();
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(';');
      const universityName = values[0]?.trim();
      if (universityName) {
        const normalizedName = universityName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
        const rowData = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            rowData[header.trim()] = values[index].trim();
          }
        });
        lilGrantMap.set(normalizedName, rowData);
      }
    }
    console.log(`✅ Loaded ${lilGrantMap.size} universities from LilGrant data`);
    return lilGrantMap;
  } catch (error) {
    console.error('❌ Error loading LilGrant data:', error.message);
    console.log('⚠️  Continuing without LilGrant data...');
    return new Map();
  }
}

// Step 1: Get Existing School IDs from /details directory
async function getExistingSchoolIds() {
  console.log('🔍 Step 1: Reading existing school IDs from /details directory...');
  const detailsDir = path.join(__dirname, '..', 'public', 'data', 'details');
  
  try {
    const files = await fs.readdir(detailsDir);
    const existingIds = new Set();
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        // Extract school ID from filename (assuming format: {id}-{slug}.json)
        const match = file.match(/^(\d+)-/);
        if (match) {
          existingIds.add(match[1]);
        }
      }
    }
    
    console.log(`✅ Found ${existingIds.size} existing school files`);
    return existingIds;
  } catch (error) {
    console.error('❌ Error reading details directory:', error.message);
    return new Set();
  }
}

// Step 2: Fetch All Official School IDs from API
async function fetchAllSchoolIds() {
  console.log('📡 Step 2: Fetching all school IDs from College Scorecard API...');
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY not found in environment variables');
  }
  
  const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  const allSchoolIds = [];
  let page = 0;
  let totalPages = 1;
  let totalResults = 0;
  
  do {
    page++;
    const params = new URLSearchParams({
      'api_key': apiKey,
      'fields': 'id',
      'per_page': '100',
      'page': (page - 1).toString()
    });
    
    console.log(`📥 Fetching page ${page}...`);
    try {
      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (page === 1) {
        totalResults = data.metadata.total;
        totalPages = Math.ceil(totalResults / 100);
        console.log(`📈 Total schools found: ${totalResults} (${totalPages} pages)`);
      }
      
      if (data.results && Array.isArray(data.results)) {
        const pageIds = data.results.map(school => school.id.toString());
        allSchoolIds.push(...pageIds);
        console.log(`✅ Page ${page}/${totalPages}: ${data.results.length} schools`);
      }
      
      if (page < totalPages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`❌ Error fetching page ${page}:`, error.message);
      throw error;
    }
  } while (page < totalPages);
  
  console.log(`🎉 Successfully fetched ${allSchoolIds.length} school IDs from API`);
  return allSchoolIds;
}

// Step 3: Determine Missing IDs
function findMissingIds(allIds, existingIds) {
  console.log('🔍 Step 3: Determining missing school IDs...');
  const missingIds = allIds.filter(id => !existingIds.has(id));
  console.log(`📊 Found ${missingIds.length} missing schools out of ${allIds.length} total`);
  return missingIds;
}

// Get Detailed Data for School (same as process-data.js)
async function getDetailedDataForSchool(schoolId) {
  const apiKey = process.env.API_KEY;
  const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  let mergedData = { id: schoolId };
  
  for (const [groupName, fields] of Object.entries(FIELD_GROUPS)) {
    try {
      const params = new URLSearchParams({
        'api_key': apiKey,
        'fields': fields.join(','),
        'id': schoolId
      });
      
      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) {
        console.warn(`  ⚠️  ${groupName} request failed for school ${schoolId}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        Object.assign(mergedData, data.results[0]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.warn(`  ⚠️  Error fetching ${groupName} for school ${schoolId}:`, error.message);
    }
  }
  
  return mergedData;
}

// Step 4: Process Missing Schools
async function processMissingSchools(missingIds, lilGrantData) {
  console.log(`🔄 Step 4: Processing ${missingIds.length} missing schools...`);
  
  const detailsDir = path.join(__dirname, '..', 'public', 'data', 'details');
  const newSummaryData = [];
  
  for (let i = 0; i < missingIds.length; i++) {
    const schoolId = missingIds[i];
    try {
      console.log(`\n📊 Processing missing school ${i + 1}/${missingIds.length}: ID ${schoolId}`);
      
      const detailedSchoolData = await getDetailedDataForSchool(schoolId);
      const universityName = detailedSchoolData['school.name'] || 'Unknown University';
      const slug = generateSlug(universityName);
      
      // Build summary object
      const summary = {
        id: detailedSchoolData.id,
        slug: slug,
        name: detailedSchoolData['school.name'],
        city: detailedSchoolData['school.city'],
        state: detailedSchoolData['school.state'],
        url: detailedSchoolData['school.school_url'],
        control: detailedSchoolData['school.ownership'],
        size: detailedSchoolData['latest.student.size'],
        admissionRate: detailedSchoolData['latest.admissions.admission_rate.overall']
      };
      newSummaryData.push(summary);
      
      // Merge LilGrant data
      const normalizedName = universityName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
      const lilGrantInfo = lilGrantData.get(normalizedName);
      if (lilGrantInfo) {
        detailedSchoolData.lilGrantData = {
          meetsFullNeed: lilGrantInfo['Meets full demonstrated need?'] || null,
          typesOfAid: lilGrantInfo['Types of Aid for international students'] || null,
          internationalAidPercentage: lilGrantInfo['Percentage of International students who receive aid'] || null,
          averageAward: lilGrantInfo['Average amount awarded'] || null,
          largestMeritScholarship: lilGrantInfo['Amount of largest Merit Scholarship'] || null,
          scholarshipInfo: lilGrantInfo["Scholarship's Information"] || null,
          totalAwardedMillions: lilGrantInfo['Total awarded in millions'] || null,
          acceptanceRate: lilGrantInfo['Acceptance rate'] || null,
          internationalAdmissionRate: lilGrantInfo['International admission rate'] || null,
          yield: lilGrantInfo['Yield (approximate)'] || null,
          internationalYield: lilGrantInfo['International yield'] || null,
          specialPrograms: {
            earlyAdmission: (lilGrantInfo['Source_List1'] || '').includes('early_admission'),
            generousAid: (lilGrantInfo['Source_List1'] || '').includes('generous_aid'),
            affordable: (lilGrantInfo['Source_List1'] || '').includes('affordable'),
            globalTop200: (lilGrantInfo['Source_List1'] || '').includes('global_top_200'),
            ivyLeague: (lilGrantInfo['Source_List1'] || '').includes('ivy_league'),
            internationalPlaylist: (lilGrantInfo['Source_List1'] || '').includes('international_playlist')
          }
        };
      }
      
      // Write individual detail file
      const detailFilePath = path.join(detailsDir, `${slug}.json`);
      await fs.writeFile(detailFilePath, JSON.stringify(detailedSchoolData, null, 2));
      console.log(`  ✅ Created: ${slug}.json`);
      
    } catch (error) {
      console.error(`  ❌ Error processing school ${schoolId}:`, error.message);
    }
  }
  
  console.log(`\n✅ Successfully processed ${newSummaryData.length} missing schools`);
  return newSummaryData;
}

// Step 5: Update Summary File
async function updateSummaryFile(newSummaryData) {
  console.log('📝 Step 5: Updating summary.json file...');
  
  const summaryPath = path.join(__dirname, '..', 'public', 'data', 'summary.json');
  
  try {
    // Read existing summary file
    const existingSummaryContent = await fs.readFile(summaryPath, 'utf-8');
    const existingSummary = JSON.parse(existingSummaryContent);
    
    // Combine existing and new data
    const combinedSummary = [...existingSummary, ...newSummaryData];
    
    // Write updated summary file
    await fs.writeFile(summaryPath, JSON.stringify(combinedSummary, null, 2));
    
    console.log(`✅ Updated summary.json: ${existingSummary.length} existing + ${newSummaryData.length} new = ${combinedSummary.length} total schools`);
    
  } catch (error) {
    console.error('❌ Error updating summary file:', error.message);
    throw error;
  }
}

// Main Function
async function main() {
  try {
    console.log('🚀 Starting LilGrant Missing Data Fix Script...\n');
    
    // Step 1: Get existing school IDs
    const existingIds = await getExistingSchoolIds();
    
    // Step 2: Fetch all official school IDs from API
    const allSchoolIds = await fetchAllSchoolIds();
    
    // Step 3: Determine missing IDs
    const missingIds = findMissingIds(allSchoolIds, existingIds);
    
    if (missingIds.length === 0) {
      console.log('\n🎉 No missing schools found! All data is complete.');
      return;
    }
    
    // Load LilGrant enrichment data
    console.log('\n📚 Loading LilGrant enrichment data...');
    const lilGrantData = await loadLilGrantData();
    
    // Step 4: Process missing schools
    const newSummaryData = await processMissingSchools(missingIds, lilGrantData);
    
    // Step 5: Update summary file
    await updateSummaryFile(newSummaryData);
    
    console.log('\n🎉🎉🎉 MISSING DATA FIX COMPLETED SUCCESSFULLY! 🎉🎉🎉');
    console.log(`📊 Processed: ${newSummaryData.length} missing schools`);
    console.log(`📁 Updated: public/data/summary.json and public/data/details/*.json`);
    
  } catch (error) {
    console.error('\n💥 Fatal error in missing data fix script:', error.message);
    process.exit(1);
  }
}

// Execute the main function
main(); 