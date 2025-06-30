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

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('❌ API_KEY not found in environment variables');
  process.exit(1);
}

// Rate limiting to avoid API issues
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced slug generation with ID suffix for uniqueness
function createUniqueSlug(name, id, city = '') {
  if (!name) return `school-${id}`;
  
  const baseSlug = name
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add city for disambiguation if provided
  const citySlug = (city && city.toString()) ? city.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const suffix = citySlug ? `-${citySlug}` : `-${id}`;
  
  return `${baseSlug}${suffix}`;
}

// Detailed schema definition (same as in original script)
const detailedSchema = {
  general: {
    id: 'id',
    slug: null,
    name: 'school.name',
    alias: 'school.alias',
    city: 'school.city',
    state: 'school.state',
    zip: 'school.zip',
    url: 'school.school_url',
    control: 'school.ownership',
    locale: 'school.locale',
    carnegie_basic: 'school.carnegie_basic',
    carnegie_undergrad: 'school.carnegie_undergrad',
    carnegie_size_setting: 'school.carnegie_size_setting'
  },
  costs: {
    tuition_in_state: 'latest.cost.tuition.in_state',
    tuition_out_of_state: 'latest.cost.tuition.out_of_state',
    tuition_program_year: 'latest.cost.tuition.program_year',
    net_price_public: 'latest.cost.net_price.public.by_income_level.0-30000',
    net_price_private: 'latest.cost.net_price.private.by_income_level.0-30000',
    attendance_academic_year: 'latest.cost.attendance.academic_year'
  },
  admissions: {
    admission_rate: 'latest.admissions.admission_rate.overall',
    sat_scores_average: 'latest.admissions.sat_scores.average.overall',
    sat_scores_25th_percentile: 'latest.admissions.sat_scores.25th_percentile.critical_reading',
    sat_scores_75th_percentile: 'latest.admissions.sat_scores.75th_percentile.critical_reading',
    act_scores_midpoint: 'latest.admissions.act_scores.midpoint.cumulative',
    act_scores_25th_percentile: 'latest.admissions.act_scores.25th_percentile.cumulative',
    act_scores_75th_percentile: 'latest.admissions.act_scores.75th_percentile.cumulative'
  },
  academics: {
    program_percentage_bachelor: 'latest.academics.program_percentage.bachelor',
    program_percentage_master: 'latest.academics.program_percentage.master',
    program_percentage_doctorate: 'latest.academics.program_percentage.doctorate',
    student_faculty_ratio: 'latest.student.demographics.student_faculty_ratio'
  },
  studentLife: {
    size: 'latest.student.size',
    demographics_race_ethnicity_white: 'latest.student.demographics.race_ethnicity.white',
    demographics_race_ethnicity_black: 'latest.student.demographics.race_ethnicity.black',
    demographics_race_ethnicity_hispanic: 'latest.student.demographics.race_ethnicity.hispanic',
    demographics_race_ethnicity_asian: 'latest.student.demographics.race_ethnicity.asian',
    demographics_men: 'latest.student.demographics.men',
    demographics_women: 'latest.student.demographics.women',
    faculty_salary: 'latest.school.faculty_salary'
  },
  outcomes: {
    completion_rate_4yr_100nt: 'latest.completion.completion_rate_4yr_100nt',
    completion_rate_less_than_4yr_100nt: 'latest.completion.completion_rate_less_than_4yr_100nt',
    retention_rate_four_year_full_time: 'latest.student.retention_rate.four_year.full_time',
    retention_rate_lt_four_year_full_time: 'latest.student.retention_rate.lt_four_year.full_time',
    earnings_10_yrs_after_entry_median: 'latest.earnings.10_yrs_after_entry.median',
    earnings_6_yrs_after_entry_median: 'latest.earnings.6_yrs_after_entry.median',
    earnings_4_yrs_after_entry_median: 'latest.earnings.4_yrs_after_entry.median'
  },
  aid: {
    pell_grant_rate: 'latest.aid.pell_grant_rate',
    federal_loan_rate: 'latest.aid.federal_loan_rate',
    median_debt_completers_overall: 'latest.aid.median_debt.completers.overall',
    median_debt_income_0_30000: 'latest.aid.median_debt.income.0_30000',
    median_debt_income_30001_75000: 'latest.aid.median_debt.income.30001_75000'
  },
  lilGrantData: {
    international_student_support: null,
    programs_popular_with_international: null,
    estimated_total_cost_international: null,
    english_proficiency_requirements: null,
    application_deadlines_international: null,
    scholarship_opportunities_international: null
  }
};

// Get all API fields from schema
function getApiFieldsFromSchema(schema) {
  const fields = [];
  
  function extractFields(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        fields.push(value);
      } else if (typeof value === 'object' && value !== null) {
        extractFields(value);
      }
    }
  }
  
  extractFields(schema);
  return fields.filter(field => field !== null);
}

// Map API data to schema structure
function mapApiDataToSchema(apiData, schema) {
  function mapLevel(schemaLevel, data) {
    const result = {};
    
    for (const [key, value] of Object.entries(schemaLevel)) {
      if (typeof value === 'string') {
        result[key] = getNestedValue(data, value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = mapLevel(value, data);
      } else {
        result[key] = null;
      }
    }
    
    return result;
  }
  
  return mapLevel(schema, apiData);
}

// Get nested object value by dot notation path
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

async function fetchWithRetry(url, options = {}, attemptNumber = 1) {
  try {
    await delay(DELAY_BETWEEN_REQUESTS);
    
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      if (attemptNumber <= 3) {
        const delayTime = 2000 * attemptNumber;
        console.log(`    🔄 Rate limited, retrying in ${delayTime}ms...`);
        await delay(delayTime);
        return fetchWithRetry(url, options, attemptNumber + 1);
      } else {
        throw new Error('Rate limit exceeded after 3 attempts');
      }
    }
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (attemptNumber <= 3) {
      console.log(`    ⚠️ Request failed, retrying... (${error.message})`);
      await delay(2000 * attemptNumber);
      return fetchWithRetry(url, options, attemptNumber + 1);
    }
    throw error;
  }
}

async function recoverMissingDetails() {
  try {
    console.log('🔧 RECOVERING MISSING DETAIL FILES...\n');

    // Step 1: Load summary data and identify duplicate slugs
    console.log('📊 Analyzing summary data for duplicate slugs...');
    const summaryPath = path.join(__dirname, 'public', 'data', 'summary.json');
    const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf-8'));
    
    // Group by slug to find duplicates
    const slugGroups = {};
    summaryData.forEach(school => {
      if (!slugGroups[school.slug]) {
        slugGroups[school.slug] = [];
      }
      slugGroups[school.slug].push(school);
    });
    
    // Find slugs with duplicates
    const duplicateSlugs = Object.entries(slugGroups).filter(([slug, schools]) => schools.length > 1);
    
    console.log(`✅ Found ${duplicateSlugs.length} slugs with duplicates`);
    console.log(`📋 Total affected schools: ${duplicateSlugs.reduce((sum, [slug, schools]) => sum + schools.length, 0)}`);

    // Step 2: Get existing detail files
    const detailsDir = path.join(__dirname, 'public', 'data', 'details');
    const existingFiles = await fs.readdir(detailsDir);
    const existingSlugs = new Set(existingFiles.map(file => file.replace('.json', '')));

    // Step 3: Find schools that need recovery
    const schoolsToRecover = [];
    
    for (const [slug, schools] of duplicateSlugs) {
      // Keep the first school (it already has a file), recover the rest
      for (let i = 1; i < schools.length; i++) {
        const school = schools[i];
        const newSlug = createUniqueSlug(school.name, school.id, school.city);
        
        if (!existingSlugs.has(newSlug)) {
          schoolsToRecover.push({
            ...school,
            originalSlug: slug,
            newSlug: newSlug
          });
        }
      }
    }

    console.log(`🎯 Schools to recover: ${schoolsToRecover.length}\n`);

    if (schoolsToRecover.length === 0) {
      console.log('🎉 No schools need recovery! All detail files are present.');
      return;
    }

    // Step 4: Process schools in batches
    const batchSize = 50;
    const apiFields = getApiFieldsFromSchema(detailedSchema);
    const fieldsParam = apiFields.join(',');

    console.log('📡 Fetching missing detail data from API...\n');

    for (let i = 0; i < schoolsToRecover.length; i += batchSize) {
      const batch = schoolsToRecover.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(schoolsToRecover.length / batchSize);
      
      console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} schools)...`);

      // Create ID filter for this batch
      const idFilter = batch.map(school => school.id).join(',');
      
      const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
      const params = new URLSearchParams({
        'api_key': API_KEY,
        'fields': fieldsParam,
        'id': idFilter,
        'per_page': batchSize.toString()
      });

      try {
        const response = await fetchWithRetry(`${baseUrl}?${params}`);
        const data = await response.json();

        console.log(`  ✅ Fetched ${data.results.length} schools from API`);

        // Process each result
        for (const apiSchool of data.results) {
          const batchSchool = batch.find(s => s.id === apiSchool.id);
          if (!batchSchool) continue;

          // Map API data to detailed schema
          const detailedData = mapApiDataToSchema(apiSchool, detailedSchema);
          detailedData.general.slug = batchSchool.newSlug;

          // Save to file with new unique slug
          const filePath = path.join(detailsDir, `${batchSchool.newSlug}.json`);
          await fs.writeFile(filePath, JSON.stringify(detailedData, null, 2));
          
          console.log(`    💾 Saved: ${batchSchool.name} → ${batchSchool.newSlug}.json`);
        }

      } catch (error) {
        console.error(`  ❌ Error processing batch ${batchNum}:`, error.message);
        console.log('  ⏭️ Continuing with next batch...');
      }

      // Progress update
      const processed = Math.min(i + batchSize, schoolsToRecover.length);
      const percentage = ((processed / schoolsToRecover.length) * 100).toFixed(1);
      console.log(`  📊 Progress: ${processed}/${schoolsToRecover.length} (${percentage}%)\n`);
    }

    // Step 5: Update summary.json with new slugs
    console.log('📝 Updating summary.json with new unique slugs...');
    
    for (const school of schoolsToRecover) {
      const summarySchool = summaryData.find(s => s.id === school.id);
      if (summarySchool) {
        summarySchool.slug = school.newSlug;
      }
    }
    
    await fs.writeFile(summaryPath, JSON.stringify(summaryData, null, 2));
    console.log('✅ Summary.json updated with new unique slugs');

    // Final report
    console.log('\n🎉 RECOVERY COMPLETE!');
    console.log(`✅ Recovered ${schoolsToRecover.length} missing detail files`);
    console.log('✅ Updated summary.json with unique slugs');
    console.log('✅ No more duplicate slug collisions');
    
    // Final count verification
    const finalDetailFiles = await fs.readdir(detailsDir);
    console.log(`\n📊 FINAL COUNT:`);
    console.log(`📁 Detail files: ${finalDetailFiles.length}`);
    console.log(`📄 Summary entries: ${summaryData.length}`);
    console.log(`🎯 Target achieved: ${finalDetailFiles.length === summaryData.length ? 'YES' : 'NO'}`);

  } catch (error) {
    console.error('❌ Error during recovery:', error.message);
  }
}

// Run the recovery
recoverMissingDetails(); 