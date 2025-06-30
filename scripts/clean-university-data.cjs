// clean-university-data.js
// Main data processing script for LilGrant University Hub
// Reads all CSV/XLSX files in scripts/data_source/, maps columns, merges, deduplicates, and outputs a master JSON file

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');

const DATA_DIR = path.join(__dirname, 'data_source');
const OUTPUT_PATH = path.join(__dirname, '../../public/data/universities-master-clean.json');

// Standardized schema mapping (add new mappings as needed)
const COLUMN_MAP = {
  'University/College Name': 'name',
  'City': 'city',
  'State': 'state',
  'Name of the state': 'stateFull',
  'Control': 'control',
  'Region': 'region',
  'Popular Metropolitan Area': 'metroArea',
  'Accessible to Metropolitan Area': 'metroArea',
  'Setting': 'setting',
  'Institution size': 'institutionSize',
  "Men's / Women's": 'gender',
  'HBCU?': 'hbcu',
  'Primary Focus': 'primaryFocus',
  'Undergraduate?': 'undergraduate',
  'Where do most students live?': 'studentResidence',
  'Religious?': 'religious',
  'Religious affiliation/influence': 'religiousAffiliation',
  'Budget category': 'budgetCategory',
  'Tuition and fees without aid': 'tuitionFees',
  'Room and board': 'roomBoard',
  'Total cost of attendance without aid': 'totalCost',
  'COA from year': 'coaYear',
  'Types of Aid for international students': 'aidTypes',
  'Number of international students awarded financial aid/scholarships': 'numIntlAid',
  'Number of International Students awarded financial aid/scholarships': 'numIntlAid',
  'Percentage of International students who receive aid': 'pctIntlAid',
  'Average amount awarded': 'avgAidAmount',
  'Average cost in 2023-2024 after aid (merit or need)': 'avgCostAfterAid',
  'Source': 'dataSource',
  'Total awarded in millions': 'totalAwardedMillions',
  'Meets full demonstrated need?': 'meetsFullNeed',
  'Amount of largest merit scholarship': 'largestMeritAmount',
  'Name and info': 'largestMeritName',
  '2024-2025 cost of attendance after largest merit scholarship': 'costAfterMeritScholarship',
  '2024-2025 adjusted tuition after merit scholarship': 'costAfterMerit',
  'How to apply': 'howToApply',
  'Notes': 'notes',
  'Acceptance rate': 'acceptanceRate',
  'International admission rate': 'intlAcceptanceRate',
  'Admission rate data from class year': 'acceptanceRateYear',
  'Yield (approx)': 'yield',
  'International yield': 'intlYield',
  'Class of 2027 - international applications': 'class2027IntlApps',
  'Class of 2027 - international students admitted': 'class2027IntlAdmit',
  'Class of 2027 international accepted offer/enrolled': 'class2027IntlEnroll',
  'Acceptance rate data source': 'acceptanceRateSource',
  'Number of countries represented among admitted students': 'numCountriesAdmitted',
  'RD acceptance rate': 'rdAcceptanceRate',
  'RD acceptance rate from class year': 'rdAcceptanceRateYear',
  'Early plan offered?': 'earlyPlanOffered',
  'ED2 offered?': 'ed2Offered',
  'ED acceptance rate': 'edAcceptanceRate',
  'ED acceptance rate from year': 'edAcceptanceRateYear',
  'ED advantage over RD': 'edAdvantageOverRd',
  'EA acceptance rate': 'eaAcceptanceRate',
  'EA acceptance rate from class year': 'eaAcceptanceRateYear',
  'EA advantage over RD': 'eaAdvantageOverRd',
  'Percent of class of 2027 filled ED': 'pctClassFilledEd',
  'EA offered?': 'eaOffered',
  'ED application deadline': 'edDeadline',
  'EA application deadline': 'eaDeadline',
  'Priority Deadline': 'priorityDeadline',
  'Rolling admission?': 'rollingAdmission',
  'RD deadline': 'rdDeadline',
  'EA/ED document deadline': 'eaEdDocDeadline',
  'EA/ED financial aid deadline': 'eaEdAidDeadline',
  'Latest testing for EA/ED': 'latestTestingEaEd',
  'EA/ED notification date': 'eaEdNotification',
  'RD document deadline': 'rdDocDeadline',
  'Latest testing accepted RD': 'latestTestingRd',
  'RD/only financial aid deadline': 'rdAidDeadline',
  'RD notification date': 'rdNotification',
  'Testing Req.': 'testingReq',
  'Percent of accepted students who submitted SAT scores': 'pctSat',
  'Percent of accepted students who submitted ACT scores': 'pctAct',
  'SAT comp 50%ile': 'satComp50',
  'SAT Math 25%ile': 'satMath25',
  'SAT Math 75%ile': 'satMath75',
  'SAT EBRW 25%ile': 'satEbrw25',
  'SAT EBRW 75%ile': 'satEbrw75',
  'ACT comp 25%ile': 'actComp25',
  'ACT comp 50%ile': 'actComp50',
  'ACT comp 75%ile': 'actComp75',
  'ACT math 25%ile': 'actMath25',
  'ACT math 75%ile': 'actMath75',
  'ACT English 25%ile': 'actEnglish25',
  'ACT English 75%ile': 'actEnglish75',
  'ACT Reading 25%ile': 'actReading25',
  'ACT Reading 75%ile': 'actReading75',
  'ACT Science 25%ile': 'actScience25',
  'ACT Science 75%ile': 'actScience75',
  'Testing - main data source': 'testingSource',
  'International 4-year graduation rate (IPEDS)': 'gradRate4yr',
  'International 5-year graduation rate (IPEDS)': 'gradRate5yr',
  'International 6-year graduation rate (IPEDS)': 'gradRate6yr',
  'Percent of international graduates who take longer than 4 years': 'pctGradLonger4yr',
  'International transfer-out rate': 'transferOutRate',
  'Latest CDS available': 'latestCds',
  'US News National Universities 2025': 'usNewsNationalUniv2025',
  'Times Higher Education 2024 World Universities': 'timesHigherEd2024',
  'THE - rank within USA': 'theRankUsa',
  'QS World Universities': 'qsWorldUniv',
  'QS World Universities (within United States)': 'qsWorldUnivUsa',
  'WSJ Best Colleges Rank': 'wsjBestCollegesRank',
  'WSJ Best Colleges Score': 'wsjBestCollegesScore',
  'US News National Liberal Arts Colleges': 'usNewsLiberalArts',
  'QS World International student rank': 'qsIntlStudentRank',
  'QS World International Student score': 'qsIntlStudentScore',
  'US News Undergrad CS': 'usNewsUndergradCs',
  'US News CS: AI': 'usNewsCsAi',
  'QS Computer Science': 'qsCompSci',
  'CSRankings.org Overall ranking': 'csRankingsOverall',
  'US News Undergraduate Business': 'usNewsUndergradBusiness',
  'QS Business': 'qsBusiness',
  'US News Undergrad Economics': 'usNewsUndergradEcon',
  'US News Top 50 engineering? either doctorate or non-doctorate': 'usNewsTop50Eng',
  'US News Undergrad Engineering programs: Doctorate': 'usNewsEngDoctorate',
  'US News Undergrad Engineering programs: Non- Doctorate': 'usNewsEngNonDoctorate',
  'US News Undergrad Mechanical Engineering': 'usNewsMechEng',
  'US News Undergrad Electrical Engineering': 'usNewsElecEng',
  'US News Undergraduate Computer Engineering': 'usNewsCompEng',
  'US News Undergrad Biomedical Engineering': 'usNewsBioEng',
  'US News Undergrad Chemical Engineering': 'usNewsChemEng',
  'Range between average temperatures (coldest and hottest months) (�C)': 'tempRange',
  'Coldest month': 'coldestMonth',
  'Coldest montly avg low in 2023 (�C)': 'coldestAvgLow',
  'Average temp in 2023 (�C)': 'avgTemp',
  'Warmest monthly avg high in 2023 (�C)': 'warmestAvgHigh',
  'Warmest month in 2023': 'warmestMonth',
  'Driest month in 2023': 'driestMonth',
  'Lowest monthly rainfall (cm)': 'lowestRainfall',
  'Average monthly rainfall (cm)': 'avgRainfall',
  'Highest monthly rainfall (cm)': 'highestRainfall',
  'Rainest month in 2023': 'rainiestMonth',
  'Abortion law status (NYT, as of October 28, 2024)': 'abortionLawStatus',
  'Currently legal until': 'abortionLegalUntil',
  'Gun deaths (non- suicide) per 100,000, 2018-2022, by county (Dept. of Health)': 'gunDeathsPer100k',
  'On-campus violent crimes (non-sexual) reported 2018-2022, average per year (OPE)': 'campusViolentCrimes',
  'On-campus rapes/sexual assaults reported 2018-2022 - average per year (OPE)': 'campusSexualAssaults',
};

// Helper: Map a row's columns to the standardized schema, log unmapped columns
function mapRow(row, fileName, unmappedColumnsSet) {
  const mapped = {};
  for (const [key, value] of Object.entries(row)) {
    const stdKey = COLUMN_MAP[key.trim()];
    if (stdKey) {
      mapped[stdKey] = value;
    } else if (key.trim() && value !== undefined && value !== '') {
      unmappedColumnsSet.add(key.trim());
    }
  }
  return mapped;
}

// Helper: Merge two university objects (prefer non-empty values, merge arrays/objects if needed)
function mergeUniversityData(a, b) {
  const merged = { ...a };
  for (const key of Object.keys(b)) {
    if (!merged[key] || merged[key] === '' || merged[key] === undefined) {
      merged[key] = b[key];
    } else if (typeof merged[key] === 'object' && typeof b[key] === 'object') {
      merged[key] = { ...merged[key], ...b[key] };
    }
    // If both have values, prefer the first (a)
  }
  return merged;
}

// Main processing function
async function processData() {
  console.log('Starting the university data cleaning process...');
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv') || f.endsWith('.xlsx'));
  console.log('Found the following files to process:', files);
  const master = {};
  let totalRows = 0;
  const unmappedColumns = new Set();

  for (const file of files) {
    console.log(`\nProcessing file: ${file}`);
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(DATA_DIR, file);
    let rows = [];
    if (ext === '.csv') {
      // Detect delimiter (assume ; or ,)
      const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
      const delimiter = firstLine.includes(';') ? ';' : ',';
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({ separator: delimiter }))
          .on('data', (row) => rows.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (ext === '.xlsx') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
    }
    totalRows += rows.length;
    for (const row of rows) {
      const mapped = mapRow(row, file, unmappedColumns);
      if (!mapped.name) continue; // skip if no university name
      const key = mapped.name.trim();
      if (master[key]) {
        master[key] = mergeUniversityData(master[key], mapped);
      } else {
        master[key] = mapped;
      }
    }
    console.log(`Processed ${rows.length} rows from ${file}`);
  }

  // Log unmapped columns
  if (unmappedColumns.size > 0) {
    console.warn('\nWarning: Unmapped columns found:');
    for (const col of unmappedColumns) {
      console.warn(`  - ${col}`);
    }
    console.warn('Please update COLUMN_MAP in clean-university-data.js if needed.');
  }

  const outputArr = Object.values(master);
  console.log(`\nData processing complete. Found ${outputArr.length} unique universities.`);
  console.log(`Resolved output path:`, OUTPUT_PATH);
  const outputDir = path.dirname(OUTPUT_PATH);
  console.log(`Ensuring output directory exists:`, outputDir);
  try {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('Output directory check/creation complete.');
    // TEST FILE WRITE
    fs.writeFileSync('public/data/test-file.txt', 'Hello, this is a test from the script.');
    console.log('Test file written to public/data/test-file.txt');
    // SMALL JSON WRITE TEST
    const testJson = [{ status: 'test successful' }];
    console.log('Attempting to write small test JSON to universities-master-clean.json...');
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(testJson, null, 2), 'utf8');
    console.log('Small test JSON written to universities-master-clean.json');
    // MEDIUM-SIZED JSON WRITE TEST
    const mediumJson = outputArr.slice(0, 10);
    console.log('Attempting to write medium-sized JSON (10 universities) to universities-master-clean.json...');
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mediumJson, null, 2), 'utf8');
    console.log('Medium-sized JSON written to universities-master-clean.json');
    // LARGE DUMMY FILE WRITE TEST
    const approxSize = JSON.stringify(outputArr, null, 2).length;
    const largeDummy = 'X'.repeat(approxSize);
    const largeDummyPath = 'public/data/large-dummy-file.txt';
    console.log(`Attempting to write large dummy file (${approxSize} bytes) to ${largeDummyPath}...`);
    fs.writeFileSync(largeDummyPath, largeDummy, 'utf8');
    console.log('Large dummy file written to public/data/large-dummy-file.txt');
    // Write full JSON to a new file for testing
    const finalTestPath = 'public/data/university-data-final.json';
    console.log('Attempting to write full JSON to university-data-final.json...');
    fs.writeFileSync(finalTestPath, JSON.stringify(outputArr, null, 2), 'utf8');
    console.log('Full JSON written to university-data-final.json');
    console.log(`Attempting to write file to path: ${OUTPUT_PATH}`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputArr, null, 2), 'utf8');
    console.log('SUCCESS: File has been written successfully!');
  } catch (writeErr) {
    console.error('ERROR: Failed to write output file:', writeErr);
    throw writeErr;
  }
  console.log(`\nProcessed ${files.length} files, ${totalRows} rows, and wrote ${outputArr.length} unique universities to ${OUTPUT_PATH}`);
}

processData().catch(error => {
  console.error('A critical error occurred:', error);
  process.exit(1);
});

// Usage:
// npm install csv-parser xlsx
// npm run clean-data 