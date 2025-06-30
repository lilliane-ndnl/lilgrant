// LilGrant University Data Cleaner & Merger
// Reads all relevant CSVs in scripts/data_source/, merges, dedupes, and outputs a master JSON for the University Hub

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data_source');
const OUTPUT_PATH = path.join(__dirname, '../public/data/universities-master-clean.json');

// List of files to process (add more as needed)
const MAIN_FILE = 'Full data 675.csv';
const SUPPLEMENTARY_FILES = [
  'Ivy League + Stanford Full Data.csv',
  'ED + EA data.csv',
  'Zero EFC.csv',
  'THE & QS Top 200 Global University.csv',
  'Religion.csv',
  'university factor.csv',
];

// Helper: Read CSV file and return array of objects
function readCSV(filePath, delimiter = ',') {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: delimiter, mapHeaders: ({ header }) => header && header.trim() }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Helper: Normalize university name for matching
function normalizeName(name) {
  return name ? name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

// Helper: Merge source codes into sourceList
function addToSourceList(obj, code) {
  if (!obj.sourceList) obj.sourceList = [];
  if (code && !obj.sourceList.includes(code)) obj.sourceList.push(code);
}

(async () => {
  try {
    console.log('Starting university data cleaning process...');
    console.log(`Data directory: ${DATA_DIR}`);
    
    // Check if main file exists
    const mainPath = path.join(DATA_DIR, MAIN_FILE);
    if (!fs.existsSync(mainPath)) {
      console.error(`Main file not found: ${mainPath}`);
      return;
    }
    
    console.log(`Reading main file: ${MAIN_FILE}`);
    const mainData = await readCSV(mainPath);
    console.log(`Read ${mainData.length} records from main file`);

    // 2. Build university map (by normalized name + city + state)
    const uniMap = {};
    const mainMappedFields = [
      'University/College Name','School Link','City','State','Region','Control','Setting','Institution size','Coeducational or Single-sex?','HBCU?','Primary Focus','Undergraduate?','Where do most students live?','Religious?','Tuition and fees without aid','Room and board','Total cost of attendance without aid','Cost of Attendance from year','Types of Aid for international students','Number of international students awarded financial aid/scholarships','Percentage of International students who receive aid','Average amount awarded','Average cost in 2023-2024 after aid (merit or need)','Meets full demonstrated need?','Amount of largest Merit Scholarship',"Scholarship's Name and Information","Scholarship's Link","Scholarship's Information",'2024-2025 adjusted tuition after Merit Scholarship','2024-2025 cost of attendance after largest Merit Scholarship','How to apply','Acceptance rate','Source'
    ];
    for (const row of mainData) {
      const key = normalizeName(row['University/College Name']) + '|' + (row.City || '').toLowerCase() + '|' + (row.State || '').toLowerCase();
      // Collect additional unmapped fields
      const additionalInfo = {};
      for (const col in row) {
        if (!mainMappedFields.includes(col) && row[col] && row[col] !== '-') {
          additionalInfo[col] = row[col];
        }
      }
      uniMap[key] = {
        name: row['University/College Name'],
        schoolLink: row['School Link'],
        city: row.City,
        state: row.State,
        region: row.Region,
        control: row.Control,
        setting: row.Setting,
        institutionSize: row['Institution size'],
        coedOrSingleSex: row['Coeducational or Single-sex?'],
        hbcu: row['HBCU?'],
        primaryFocus: row['Primary Focus'],
        undergraduate: row['Undergraduate?'],
        studentResidence: row['Where do most students live?'],
        religious: row['Religious?'],
        tuition: row['Tuition and fees without aid'],
        roomAndBoard: row['Room and board'],
        totalCost: row['Total cost of attendance without aid'],
        costOfAttendanceYear: row['Cost of Attendance from year'],
        aidTypes: row['Types of Aid for international students'],
        numIntlAid: row['Number of international students awarded financial aid/scholarships'],
        pctIntlAid: row['Percentage of International students who receive aid'],
        avgAid: row['Average amount awarded'],
        avgCostAfterAid: row['Average cost in 2023-2024 after aid (merit or need)'],
        meetsFullNeed: row['Meets full demonstrated need?'],
        largestMeritScholarship: row['Amount of largest Merit Scholarship'],
        scholarshipName: row["Scholarship's Name and Information"],
        scholarshipLink: row["Scholarship's Link"],
        scholarshipInfo: row["Scholarship's Information"],
        adjustedTuitionAfterMerit: row['2024-2025 adjusted tuition after Merit Scholarship'],
        adjustedCOAAfterMerit: row['2024-2025 cost of attendance after largest Merit Scholarship'],
        howToApply: row['How to apply'],
        acceptanceRate: row['Acceptance rate'],
        sourceList: [],
        additionalInfo,
      };
      if (row.Source) addToSourceList(uniMap[key], row.Source);
    }

    console.log(`Created ${Object.keys(uniMap).length} unique university entries`);

    // 3. Merge in supplementary files (in priority order)
    for (const file of SUPPLEMENTARY_FILES) {
      const filePath = path.join(DATA_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping missing file: ${file}`);
        continue;
      }
      console.log(`Processing supplementary file: ${file}`);
      const delimiter = file.endsWith('.csv') ? (file.includes('Full data') ? ',' : ',') : ',';
      const data = await readCSV(filePath, delimiter);
      console.log(`Read ${data.length} records from ${file}`);
      let matches = 0;
      for (const row of data) {
        // Try to match by name + city + state
        const key = normalizeName(row['University/College Name'] || row['Name'] || row['University']) + '|' + (row.City || '').toLowerCase() + '|' + (row.State || '').toLowerCase();
        if (uniMap[key]) {
          matches++;
          // Merge all fields from this file into the university object, but only if missing or empty
          for (const col in row) {
            if (col === 'Source' || col === 'Source_List' || col === 'Elite Group' || col === 'Group') continue; // handled below
            if (!mainMappedFields.includes(col)) {
              // Extra field: put in additionalInfo
              if (row[col] && row[col] !== '-') {
                uniMap[key].additionalInfo = uniMap[key].additionalInfo || {};
                uniMap[key].additionalInfo[col] = row[col];
              }
            } else {
              // Standard field: only overwrite if missing or empty
              const mappedKey = Object.keys(uniMap[key]).find(k => k.toLowerCase() === col.toLowerCase().replace(/\s+/g, ''));
              if (mappedKey && (!uniMap[key][mappedKey] || uniMap[key][mappedKey] === '-' || uniMap[key][mappedKey] === 'N/A')) {
                uniMap[key][mappedKey] = row[col];
              }
            }
          }
          // Add elite/source code if present
          if (row.Source || row.Source_List || row['Elite Group'] || row['Group']) {
            const codes = (row.Source || row.Source_List || row['Elite Group'] || row['Group'] || '').split(',').map(s => s.trim()).filter(Boolean);
            for (const code of codes) addToSourceList(uniMap[key], code);
          }
          // Add special flags (e.g., zeroEFC, ED_EA, Ivy, etc.)
          if (file.includes('Zero EFC')) addToSourceList(uniMap[key], 'ZEROEFC');
          if (file.includes('ED + EA')) addToSourceList(uniMap[key], 'ED_EA');
          if (file.includes('Ivy League')) addToSourceList(uniMap[key], 'IVY');
          if (file.includes('THE & QS')) addToSourceList(uniMap[key], 'QS200');
        }
      }
      console.log(`Matched ${matches} records from ${file}`);
    }

    // 4. Output as pretty JSON
    const outputArr = Object.values(uniMap);
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputArr, null, 2), 'utf-8');

    // 5. Log summary
    console.log(`\n✅ SUCCESS: Processed ${Object.keys(uniMap).length} unique universities.`);
    console.log(`📁 Output written to: ${OUTPUT_PATH}`);
    console.log(`📊 Total records in output: ${outputArr.length}`);
    
  } catch (error) {
    console.error('❌ Error during data processing:', error);
    process.exit(1);
  }
})(); 