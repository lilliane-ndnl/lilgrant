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

// Rate limiting configuration
const RATE_LIMIT = {
  REQUESTS_PER_SECOND: 0.5, // Much more conservative - one request every 2 seconds
  DELAY_BETWEEN_REQUESTS: 2000, // 2 second delay between requests
  RETRY_ATTEMPTS: 5,
  RETRY_DELAY: 5000 // 5 seconds delay before retry
};

// Field Groups for Multi-Query Strategy
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

// Rate-limited fetch function with retry logic
async function fetchWithRetry(url, options = {}, attemptNumber = 1) {
  try {
    // Always wait before making a request
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.DELAY_BETWEEN_REQUESTS));
    
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      if (attemptNumber <= RATE_LIMIT.RETRY_ATTEMPTS) {
        const delayTime = RATE_LIMIT.RETRY_DELAY * attemptNumber;
        console.log(`    🔄 Rate limited, retrying attempt ${attemptNumber}/${RATE_LIMIT.RETRY_ATTEMPTS} in ${delayTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayTime));
        return fetchWithRetry(url, options, attemptNumber + 1);
      } else {
        throw new Error(`Rate limit exceeded after ${RATE_LIMIT.RETRY_ATTEMPTS} attempts`);
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (attemptNumber <= RATE_LIMIT.RETRY_ATTEMPTS && (error.message.includes('fetch') || error.message.includes('network'))) {
      const delayTime = RATE_LIMIT.RETRY_DELAY * attemptNumber;
      console.log(`    🔄 Network error, retrying attempt ${attemptNumber}/${RATE_LIMIT.RETRY_ATTEMPTS} in ${delayTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayTime));
      return fetchWithRetry(url, options, attemptNumber + 1);
    }
    throw error;
  }
}

// Load LilGrant CSV Data
async function loadLilGrantData() {
  const csvPath = path.join(__dirname, 'scripts', 'data_source', 'lilgrant_international_playlist_masterfile.csv');
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

// API Data Fetching Functions
async function fetchAllUniversityData() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY not found in environment variables');
  }
  console.log('🔍 Fetching basic university list with minimal fields...');
  const minimalFields = 'id,school.name,school.city,school.state,latest.student.size,latest.admissions.admission_rate.overall';
  const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  const allUniversities = [];
  let page = 0;
  let totalPages = 1;
  let totalResults = 0;
  
  do {
    page++;
    const params = new URLSearchParams({
      'api_key': apiKey,
      'fields': minimalFields,
      'per_page': '50',
      'page': (page - 1).toString()
    });
    
    console.log(`📥 Fetching page ${page}...`);
    try {
      const response = await fetchWithRetry(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (page === 1) {
        totalResults = data.metadata.total;
        totalPages = Math.ceil(totalResults / 50);
        console.log(`📈 Total universities found: ${totalResults} (${totalPages} pages)`);
      }
      
      if (data.results && Array.isArray(data.results)) {
        allUniversities.push(...data.results);
        console.log(`✅ Page ${page}/${totalPages}: ${data.results.length} universities`);
      }
      
    } catch (error) {
      console.error(`❌ Error fetching page ${page}:`, error.message);
      throw error;
    }
  } while (page < totalPages);
  
  console.log(`🎉 Successfully fetched ${allUniversities.length} universities from API`);
  return allUniversities;
}

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
      
      const response = await fetchWithRetry(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        Object.assign(mergedData, data.results[0]);
      }
      
    } catch (error) {
      console.warn(`  ⚠️  Error fetching ${groupName} for school ${schoolId}:`, error.message);
    }
  }
  
  return mergedData;
}

// Progress saving functionality
async function saveProgress(summaryData, detailedData, currentIndex) {
  const progressFile = path.join(__dirname, 'processing-progress.json');
  const progress = {
    currentIndex,
    summaryData,
    detailedData: detailedData.map(d => d.slug),
    timestamp: new Date().toISOString()
  };
  await fs.writeFile(progressFile, JSON.stringify(progress, null, 2));
}

async function loadProgress() {
  const progressFile = path.join(__dirname, 'processing-progress.json');
  try {
    const content = await fs.readFile(progressFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Main Processing Function
async function main() {
  try {
    console.log('🚀 Starting LilGrant data processing pipeline (Multi-Query Strategy)...\n');
    
    // Check for existing progress
    const existingProgress = await loadProgress();
    let startIndex = 0;
    let summaryData = [];
    let detailedData = [];
    
    if (existingProgress) {
      console.log(`📊 Found existing progress from ${existingProgress.timestamp}`);
      console.log(`📈 Resuming from university ${existingProgress.currentIndex}`);
      startIndex = existingProgress.currentIndex;
      summaryData = existingProgress.summaryData;
      // Load existing detailed data files
      for (const slug of existingProgress.detailedData) {
        try {
          const filePath = path.join(__dirname, 'public', 'data', 'details', `${slug}.json`);
          const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
          detailedData.push({ slug, data });
        } catch {
          // File might be missing, will be recreated
        }
      }
    }
    
    // Step 1: Fetch all university data from College Scorecard API (minimal fields)
    console.log('📡 Step 1: Fetching basic university list');
    const apiUniversities = await fetchAllUniversityData();
    
    // Step 2: Load LilGrant enrichment data
    console.log('\n📚 Step 2: Loading LilGrant enrichment data');
    const lilGrantData = await loadLilGrantData();
    
    // Step 3: Process and merge data
    console.log(`\n🔄 Step 3: Processing and merging data for ${apiUniversities.length} universities`);
    console.log(`⏭️  Starting from index ${startIndex}...`);
    
    for (let i = startIndex; i < apiUniversities.length; i++) {
      const university = apiUniversities[i];
      try {
        const universityName = university['school.name'] || 'Unknown University';
        console.log(`\n📊 Processing university ${i + 1}/${apiUniversities.length}: ${universityName}`);
        
        const detailedUniversityData = await getDetailedDataForSchool(university.id);
        const slug = generateSlug(universityName);
        
        // Build summary object
        const summary = {
          id: detailedUniversityData.id,
          slug: slug,
          name: detailedUniversityData['school.name'],
          city: detailedUniversityData['school.city'],
          state: detailedUniversityData['school.state'],
          url: detailedUniversityData['school.school_url'],
          control: detailedUniversityData['school.ownership'],
          size: detailedUniversityData['latest.student.size'],
          admissionRate: detailedUniversityData['latest.admissions.admission_rate.overall']
        };
        
        summaryData.push(summary);
        
        // Merge LilGrant data
        const normalizedName = universityName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
        const lilGrantInfo = lilGrantData.get(normalizedName);
        
        if (lilGrantInfo) {
          detailedUniversityData.lilGrantData = {
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
        
        detailedData.push({ slug, data: detailedUniversityData });
        
        // Save progress every 50 universities
        if ((i + 1) % 50 === 0) {
          await saveProgress(summaryData, detailedData, i + 1);
          console.log(`💾 Progress saved at university ${i + 1}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing university ${university['school.name']}:`, error.message);
      }
    }
    
    // Step 4: Create output directories
    console.log('\n📁 Step 4: Creating output directories');
    const publicDataDir = path.join(__dirname, 'public', 'data');
    const detailsDir = path.join(publicDataDir, 'details');
    await fs.mkdir(publicDataDir, { recursive: true });
    await fs.mkdir(detailsDir, { recursive: true });
    
    // Step 5: Write output files
    console.log('\n💾 Step 5: Writing output files');
    await fs.writeFile(
      path.join(publicDataDir, 'summary.json'),
      JSON.stringify(summaryData, null, 2)
    );
    console.log(`✅ Written summary.json with ${summaryData.length} universities`);
    
    const writePromises = detailedData.map(async ({ slug, data }) => {
      const filePath = path.join(detailsDir, `${slug}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    });
    await Promise.all(writePromises);
    console.log(`✅ Written ${detailedData.length} individual detail files`);
    
    // Clean up progress file
    try {
      await fs.unlink(path.join(__dirname, 'processing-progress.json'));
    } catch {}
    
    console.log('\n🎉🎉🎉 LILGRANT DATA PIPELINE FINISHED SUCCESSFULLY! 🎉🎉🎉');
    console.log(`📊 Summary: ${summaryData.length} universities processed`);
    console.log(`📁 Output: public/data/summary.json and public/data/details/*.json`);
    
  } catch (error) {
    console.error('\n💥 Fatal error in data processing pipeline:', error.message);
    console.log('\n💾 Progress has been saved. You can restart the script to resume from where it left off.');
    process.exit(1);
  }
}

// Execute the main function
main();
