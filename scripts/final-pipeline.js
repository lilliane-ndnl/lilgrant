import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import csvParser from 'csv-parser';
import { format } from 'fast-csv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DETAILS_DIR = path.join(__dirname, '..', 'public', 'data', 'details');
const SUMMARY_PATH = path.join(__dirname, '..', 'public', 'data', 'summary.json');
const MASTER_CSV = path.join(__dirname, 'data_source', 'Most-Recent-Cohorts-Institution_05192025.csv');
const ENRICH_CSV = path.join(__dirname, 'data_source', 'lilgrant_international_playlist_masterfile.csv');
const API_KEY = process.env.API_KEY;

// --- Helper Functions & Schemas ---
function normalizeName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function generateSlug(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SUMMARY_SCHEMA = [
  'id', 'slug', 'name', 'city', 'state', 'url', 'control', 'size', 'admissionRate', 'isLilGrantPlaylist', 'tags'
];

const DETAILED_SCHEMA = [
  // Add all fields you want in the detailed object, or just use the merged object
];

function buildSummaryObject(detailed, enrich) {
  return {
    id: detailed.id,
    slug: generateSlug(detailed.name || detailed['school.name']),
    name: detailed.name || detailed['school.name'],
    city: detailed.city || detailed['school.city'] || detailed.CITY,
    state: detailed.state || detailed['school.state'] || detailed.STABBR,
    url: detailed.INSTURL || detailed.url || detailed['school.school_url'],
    control: detailed.control || detailed['school.ownership'] || detailed.CONTROL,
    size: detailed.UGDS || detailed.size || detailed['latest.student.size'],
    admissionRate: detailed.ADM_RATE || detailed.admissionRate || detailed['latest.admissions.admission_rate.overall'],
    isLilGrantPlaylist: enrich?.isLilGrantPlaylist || false,
    tags: enrich?.tags || []
  };
}

function buildDetailedObject(apiData, enrich) {
  // API data is source of truth, but merge in enrichment fields if not present
  const merged = { ...enrich, ...apiData };
  // Overwrite with API data for overlapping fields
  Object.assign(merged, apiData);
  return merged;
}

async function getDetailedDataForSchool(schoolId) {
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
  const apiUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  let mergedData = { id: schoolId };
  for (const fields of Object.values(FIELD_GROUPS)) {
    let retry = 0;
    while (true) {
      try {
        const params = new URLSearchParams({
          'api_key': API_KEY,
          'fields': fields.join(','),
          'id': schoolId
        });
        const response = await fetch(`${apiUrl}?${params}`);
        if (response.status === 429) {
          const waitTime = Math.min(60000 * (retry + 1), 5 * 60 * 1000);
          console.warn(`⏳ 429 Too Many Requests. Waiting ${waitTime / 1000}s before retrying (retry #${retry + 1})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retry++;
          continue;
        }
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          Object.assign(mergedData, data.results[0]);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        break;
      } catch (err) {
        if (retry >= 5) throw err;
        const waitTime = Math.min(60000 * (retry + 1), 5 * 60 * 1000);
        console.warn(`⏳ Error fetching group for school ${schoolId}. Waiting ${waitTime / 1000}s before retrying (retry #${retry + 1})...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retry++;
      }
    }
  }
  return mergedData;
}

async function readCsvToArray(filePath, idField = 'UNITID', nameField = 'INSTNM') {
  return new Promise((resolve, reject) => {
    const arr = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', row => {
        arr.push({
          id: row[idField],
          name: row[nameField],
          normalizedName: normalizeName(row[nameField])
        });
      })
      .on('end', () => resolve(arr))
      .on('error', reject);
  });
}

async function readEnrichmentCsv(filePath) {
  return new Promise((resolve, reject) => {
    const map = new Map();
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', row => {
        const normalizedName = normalizeName(row[Object.keys(row)[0]]);
        map.set(normalizedName, {
          ...row,
          isLilGrantPlaylist: true,
          tags: (row['Source_List1'] || '').split(',').map(t => t.trim()).filter(Boolean)
        });
      })
      .on('end', () => resolve(map))
      .on('error', reject);
  });
}

async function getCompletedIds() {
  if (!fs.existsSync(DETAILS_DIR)) return new Set();
  const files = await fsPromises.readdir(DETAILS_DIR);
  const completed = new Set();
  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/^(\d+)-/);
      if (match) completed.add(match[1]);
    }
  }
  return completed;
}

async function main() {
  // Ensure output directory exists
  await fsPromises.mkdir(DETAILS_DIR, { recursive: true });

  // Resumability: get completed IDs
  const completedIds = await getCompletedIds();
  console.log(`Found ${completedIds.size} schools already processed.`);

  // Step 1: Load master data
  const masterList = await readCsvToArray(MASTER_CSV);
  console.log(`Loaded ${masterList.length} schools from master list.`);

  // Step 2: Load enrichment data
  const enrichMap = await readEnrichmentCsv(ENRICH_CSV);
  console.log(`Loaded ${enrichMap.size} enrichment entries.`);

  // Step 3: Merge to create enriched job list
  const enrichedSchoolList = masterList.map(school => {
    const enrich = enrichMap.get(school.normalizedName) || {};
    return {
      ...school,
      ...enrich,
      isLilGrantPlaylist: !!enrich.isLilGrantPlaylist,
      tags: enrich.tags || []
    };
  });

  // Step 4: Fetch/process/write with resume check
  for (let i = 0; i < enrichedSchoolList.length; i++) {
    const school = enrichedSchoolList[i];
    if (completedIds.has(school.id)) {
      console.log(`Skipping ${school.name} (already processed)`);
      continue;
    }
    try {
      console.log(`Processing ${school.name} (${school.id}) [${i + 1}/${enrichedSchoolList.length}]`);
      const apiData = await getDetailedDataForSchool(school.id);
      const detailed = buildDetailedObject(apiData, school);
      const slug = `${school.id}-${generateSlug(school.name)}`;
      const detailPath = path.join(DETAILS_DIR, `${slug}.json`);
      await fsPromises.writeFile(detailPath, JSON.stringify(detailed, null, 2));
      completedIds.add(school.id);
    } catch (err) {
      console.error(`❌ Error processing ${school.name} (${school.id}):`, err.message);
    }
  }

  // Step 5: Generate summary file from all detail files
  const files = await fsPromises.readdir(DETAILS_DIR);
  const summaryArr = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = JSON.parse(await fsPromises.readFile(path.join(DETAILS_DIR, file), 'utf-8'));
      summaryArr.push(buildSummaryObject(data, data));
    }
  }
  await fsPromises.writeFile(SUMMARY_PATH, JSON.stringify(summaryArr, null, 2));
  console.log(`✅ Wrote summary.json with ${summaryArr.length} schools.`);
}

main(); 